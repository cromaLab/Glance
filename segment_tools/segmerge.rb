############################################################
## Simple rules version. Rev 1
## - If disjoint from median range, remove
## - If the span difference is > 2*STDEV, remove
## - If subsumed by a majority group, remove/merge
## - < End of CHI list. More pending >
##
## Average the remaining segments 
##
## >> Once these rules are in place, we can try to make a
##     better prediction than average later on.
############################################################


# Includes
require 'arraystats.rb'
require 'parsetools.rb'

# Params
##



def calcCountStats(countArray)
	# TODO: Change this from acting on the start time to the median time AND length of segment (use [x][0] -- [x][1] instad of just [x])
	retHash = Hash.new()

	# Find the median
	retHash['median'] = countArray.median
	#puts("Median segment count: #{retHash['median']}")

	# Find the mean
	retHash['mean'] = countArray.mean
	#puts("Mean segment count: #{retHash['mean']}")

	# Find the standard deviation
	retHash['var'] = countArray.variance
	retHash['stdev'] = countArray.stdev
	#puts("Variance: #{retHash['var']}, Standard Dev: #{retHash['stdev']}")

	# Set the upper and lower bounds
	tolerance = 2 * retHash['stdev']
	retHash['upper'] = retHash['mean'] + tolerance
	retHash['lower'] = retHash['mean'] - tolerance

	return retHash
end

def filterOutlierSegments(workerSegments)
	numSegsArray = Array.new()
	midSegsArray = Array.new()
	lenSegsArray = Array.new()

	# First pass to get stats
	workerSegments.each{ |curSegs|
		# [1] is the segments ([0] is worker name)
		numSegsArray << curSegs[1].length
		#puts("Adding segments for worker: #{curSegs[0]}")

		curSegs[1].each{ |seg|
			# Create the centroid set
			midSegsArray << ((seg[0] + seg[1]) / 2.0)

			# Create the span set
			lenSegsArray << (seg[1] - seg[0])
		}

		
	}

=begin
	# NOTE: This code is for calculating summary stats without leaving the current comparison point out

	# TODO: Calc stats as leave-current-out when testing, not vs all segs including the one in question
	# Get the stats for the number of segments per worker
	numStatsHash = calcCountStats(numSegsArray)

	# Get the stats for the segment center of the segments for each worker
	midStatsHash = calcCountStats(midSegsArray)

	# Get the stats for the segment length of the segment for each worker
	lenStatsHash = calcCountStats(lenSegsArray)
=end

	# Create a set of entries to filter out
	skipSet = Array.new

	workerSegments.each{ |curSegs|
		# Get the stats for the number of segments per worker
		numSegsArrayTemp = numSegsArray.clone
		numSegsArrayTemp.delete(curSegs[0])
		numStatsHash = calcCountStats(numSegsArrayTemp)

		# Get the stats for the segment center of the segments for each worker
		midSegsArrayTemp = midSegsArray.clone
		midSegsArrayTemp.delete(curSegs[0])
		midStatsHash = calcCountStats(midSegsArrayTemp)

		# Get the stats for the segment length of the segment for each worker
		lenSegsArrayTemp = lenSegsArray.clone
		lenSegsArrayTemp.delete(curSegs[0])
		lenStatsHash = calcCountStats(lenSegsArrayTemp)


		# Check if there is a plausible number of segments
		if( curSegs[1].length < numStatsHash['upper'] && curSegs[1].length > numStatsHash['lower'] )
			# Check the individual segments
			curSegs[1].each{ |seg|
				curMid = (seg[0] + seg[1]) / 2.0
				curLen = seg[1] - seg[0]

				# Check if the middle and span of the segment are outliers
				if( (curMid < midStatsHash['upper'] && curMid > midStatsHash['lower']) && (curLen < lenStatsHash['upper'] && curLen > lenStatsHash['lower']) )
				else
					# Remove from return set
					skipSet <<  curSegs[0]
				end
			}
		end
	}

	skipSet.uniq!
	# Remove entries with invalid segments
	skipSet.each { |toSkip|
		#puts("Removing #{toSkip}... (Size: #{workerSegments.length})")
		workerSegments.delete(toSkip)
	}


	return workerSegments
end

def filterSubsumedDisjointSegments(workerSegments)
	# First, create a local copy for this function
	workerSegments = workerSegments.clone
	# Create a set of aggregated elements to swap out
	swapSet = Array.new
	# Create a set of disjoint elments to be removed
	removeSet = Array.new

	workerSegments.each{ |curSegs|
		segs = curSegs[1]
		for i in 0...segs.length
			seg = segs[i]
			curStart = seg[0]
			curEnd = seg[1]
			idx = i
			isMajorityContained = true
			toSwap = Array.new
			while( isMajorityContained && idx < segs.length)
				containedTally = 0
				disjointTally = 0
				# For each other worker input set...
				workerSegments.each{ |innerSegs|
					compareSegs = innerSegs[1]
					isDisjoint = true
					# For each other individual segment
					compareSegs.each{ |compSeg|
						if( compSeg[0] < curStart && compSeg[1] > curEnd )
							containedTally += 1
						# TODO: Add in disjoint-segment detection
						elsif( !(compSeg[0] >= curEnd || compSeg[1] <= curEnd) )
							isDisjoint = false
						end
					}
					if( isDisjoint )
						disjointTally += 1
					end
				}

				# If we have a majority disjoint segment...
				if( disjointTally < (0.5*workerSegments.length.to_f) )
					# Add the element to the to-be-removed set
					removeSet << [curSegs[0], seg]
				end

				# If we don't have a majority of the segments subsuming the current...
				if( containedTally < (0.5*workerSegments.length.to_f) )
					isMajorityContained = false
				else

					idx += 1
					# If we're not at the end...
					if( idx < segs.length )
						newToSwap = Array.new
						# Save the current most subsumed segment
						newToSwap[0] = curSegs[0]
						newToSwap[1] = Array.new
						if( toSwap[1] )
							toSwap.each{ |elem|
								newToSwap[1] << elem
							}
						end
						newToSwap[1] << segs[idx]
						newToSwap[2] = [curStart, curEnd]
						toSwap = newToSwap

						# Add the next segment to te aggregated range
						curEnd = segs[idx][1]
					end
				end

				
			end
			if( toSwap.length > 0 )
				swapSet << toSwap	
			end
		end

		# Swap out the to-merge elements
		swapSet.each{ |entry|
			wid = entry[0]
			entry[1].each{ |seg|
				workerSegments[wid].delete(seg)
			}
			workerSegments[wid] << entry[2]
		}

		# Remove the disjoint elements
		removeSet.each{ |entry|
			wid = entry[0]
			seg = entry[1]
			workerSegments[wid].delete(seg)
		}
	}

	workerSegments.each{ |curSegs|
	}


	return workerSegments
end


# Find and return a single merged set of segments from the previously-trimmed input set
def getSegments(segSet, inWorkerCount)
	# Before we start, check if there is enough input to validate ANY segments existing
	numWorkers = segSet.length
	if( numWorkers < (inWorkerCount*0.5) )
		#puts("No segments! Only #{numWorkers} / #{inWorkerCount} workers reporting segments!")
		return Array.new
	else
		#puts("Using input from #{numWorkers} / #{inWorkerCount} workers!")
	end

	# First, get a count of all the segments
	countArray = Array.new
	segSet.each{ |seg|
		countArray << seg[1].length
	}

	#numSegs = countArray.median
	numSegs = countArray.mode
	#puts("Final Num Segs: #{numSegs}")


	# First, check all workers with the right number of segments and get an average
	centerArray = Array.new
	segSet.each{ |segs|
		if( segs[1].length == numSegs )
			for i in 0...segs[1].length
				curSeg = segs[1][i]
				if( !centerArray[i] )
					centerArray[i] = Array.new
				end
				centerArray[i] << (curSeg[0].to_f + curSeg[1].to_f) / 2.0
			end
		end
	}
	
	# Calc average center
	averageCenters = Array.new
	for i in 0...centerArray.length
		averageCenters[i] = centerArray[i].mean
	end

	# Now find the rages, aligned to the closest centers
	finalRanges = Array.new
	segSet.each{ |segs|
		curSet = segs[1].clone
		for i in 0...[numSegs, segs[1].length].min
			closestIdx = getClosestIndex(averageCenters, segs[1][i].mean)
			#puts("##{i}: #{closestIdx}")

			if( closestIdx )
				if( !finalRanges[closestIdx] )
					finalRanges[closestIdx] = Array.new
				end

				finalRanges[closestIdx] << segs[1][i].clone
			end
		end
	}


	mergedRanges = Array.new
	finalRanges.each{ |segs|
		startAry = Array.new
		endAry = Array.new
if( segs != nil )
		segs.each{ |seg|
			startAry << seg[0]
			endAry << seg[1]
		}
		mergedRanges << [startAry.mean, endAry.mean]
end
	}
			

	return mergedRanges
end


def getClosestIndex(segAry, val)
	minDiff = 1000000000  # poor man's INT_MAX
	minIdx = nil

	for i in 0...segAry.length
		#puts("SEG ARRAY: #{segAry[i]},#{segAry[i]}")
		curDiff = (val - segAry[i]).abs
		if( curDiff < minDiff )
			minDiff = curDiff
			#minVal = ary[i]
			minIdx = i
		end
	end

	return minIdx
end

