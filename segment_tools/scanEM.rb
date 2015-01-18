#!/bin/ruby

# Pass in a sorted segment list, and this will remove overlaps and merge
def mergeOverlappingSegments(inSegs)
	retSet = Array.new
	lastStart = -1.0
	lastEnd = -1.0
	# Main code, since we usually will be operating over only 1-worker inputs
	inSegs.each{ |seg|
		# If this is the first seg, intialize the running counters
		if( lastStart < 0 )
			lastStart = seg[0]
			lastEnd = seg[1]
		end

		# Check for new edge bounds
		# TODO: Check for edge cases in imperfectly sorted lists (aka, ones with subsumed segments, etc)
		if( seg[0] < lastEnd  )
			if( seg[0] < lastStart )
				lastStart = seg[0]  # Edge case
			end
			if( seg[1] > lastEnd )
				lastEnd = seg[1]
			end
		else
			# Log this segment and start a new one
			retSet << [lastStart, lastEnd]
			lastStart = seg[0]
			lastEnd = seg[1]
		end
	}

	# Log the final one if it wasn't already
	if( lastStart > 0 && lastEnd > 0 )
		retSet << [lastStart, lastEnd]
	end 

	# Return the new list of merged segmented
	return retSet
				
end

# Pass an initial guess at the range and the set of worker inputs
def refineSegmentsEM(initRanges, inSegs, type)
	type.downcase!
	# Default test type is to not refine
	if( type == "default")
		return initRanges
	end

	#puts("Refining...")
	curSegs = inSegs
	curRanges = initRanges
	workerWeights = Hash.new

	# Get intial worker weights
	curSegs.each{ |entry|
		# Trust every worker completely to begin with
		workerWeights[entry[0]] = 1.0
	}

	# First, trim to our current set to remove all non-clipped elements
	curRanges.each_index{ |idx|
		#puts("Segment ##{idx}")
		curRange = curRanges[idx]

		# Alias some key values
		rSt = curRange[0]
		rEnd = curRange[1]
		rArea = rEnd - rSt

		# Define tracking arrays
		includedSegs = Array.new
		workerStats = Hash.new

		# E the M out of this thing!
		hasConverged = false
		while( !hasConverged )
		hasConverged = true

		# For each worker input...
		curSegs.each{ |wSegs|
			worker = wSegs[0]
			segs = wSegs[1]

			includedWorkerSegs = Array.new
			segs.each{ |curSeg|
				cSt = curSeg[0]
				cEnd = curSeg[1]
				# For all overlapping segments...
				if( rSt < cEnd && rEnd > cSt )
					# Record some stats for this worker
					if( !workerStats[worker] )
						workerStats[worker] = Hash.new
						workerStats[worker]["overlaps"] = Array.new
					end

					# Add the segment to the included list
					includedWorkerSegs << curSeg.clone
				end
			}

			# Add this worker's included input to the total set
			includedSegs << [worker, includedWorkerSegs]
		}


		# TODO: Trim outliers here (from includedSegs)


		startGuess = 0.0
		endGuess = 0.0
		totalWeight = 0.0

		includedSegs.each{ |wSegs|
			worker = wSegs[0]
			segs = wSegs[1]


			# Re-guess the range (partial update step based on this worker)
			wSt = 0.0
			wEnd = 0.0
			wArea = 0.0
			wOverlap = 0.0

			if( segs.length > 0 )
				wSt = 999999999
				wEnd = -1
				# Find the min and max of the overlapping ranges
				segs.each{ |seg|
					# Check for a new start
					if( seg[0] < wSt )
						wSt = seg[0]
					end

					# Check for a new end
					if( seg[1] > wEnd )
						wEnd = seg[1]
					end
				}

				# Find the overlapping region
				wOverlap += [rEnd, wEnd].min - [rSt, wSt].max
				#puts("overlap add: (#{wSt},#{wEnd}); (#{rSt},#{rEnd})#{[rEnd, wEnd].min - [rSt, wSt].max} --> SUM: #{wOverlap}")
			end
			wArea += wEnd - wSt  # NOTE: This is the CONNECTED span, not the sum of segments

			# Revise worker weights
			case type
			when 'jaccard'
				workerWeights[worker] = rateWorkerJaccard(wOverlap, rArea, wArea)
			when 'precision'
				workerWeights[worker] = rateWorkerPrec(wOverlap, rArea, wArea)
			when 'recall'
				workerWeights[worker] = rateWorkerRecall(wOverlap, rArea, wArea)
			when 'f1'
				workerWeights[worker] = rateWorkerF1(wOverlap, rArea, wArea)
			else
				workerWeights[worker] = rateWorkerJaccard(wOverlap, rArea, wArea)
			end
			#puts("NEW SCORE: #{workerWeights[worker]}")
				

			if( wArea > 0 )	
				# Update guesses / running normalization value
				# This gets the weighted averages of all start and end points
#puts("adding start: #{wSt} @ wt: #{workerWeights[worker]}")
				startGuess += wSt * workerWeights[worker]
#puts("adding end: #{wEnd} @ wt: #{workerWeights[worker]}")
				endGuess += wEnd * workerWeights[worker]
				totalWeight += workerWeights[worker]
			else
				#puts("ZERO LENGTH. Area: #{wArea}")
			end
		}

#puts("total end: #{endGuess} @ wt: #{totalWeight}")
		# New start time for this segment
		nStart = startGuess / totalWeight
		nEnd = endGuess / totalWeight

		# If a change has been made, update
		if( curRanges[idx][0] != nStart || curRanges[idx][1] != nEnd )
			#puts("(#{curRanges[idx][0]}, #{curRanges[idx][1]}) -> (#{nStart}, #{nEnd})")
			curRanges[idx] = [nStart, nEnd]
			hasConverged = false
		end


		end
	}

	# Merge overlaps
	finalRanges = mergeOverlappingSegments(curRanges)
	return finalRanges
end



####  METRICS  ####


# Metric 1: Intersection over uniion (of baseline and all clipped segments) == Jaccard similarity 
# Metric 2: F1 Score
# Metric 3: 

# Jaccard: Intersection / union
def rateWorkerJaccard(overlap, regionSpan, workerSpan)
#puts("OVERLAP #{overlap}  |  REGION: #{regionSpan}  |  WORKER: #{workerSpan}  ========================")
	return overlap / ((regionSpan+workerSpan)-overlap)
end


# Precision: Intersection / Answer
def rateWorkerPrec(overlap, regionSpan, workerSpan)
	#puts("Prec. overlap: #{overlap}, wSpan: #{workerSpan}")
	if( workerSpan == 0 )
		if( regionSpan == 0 )
			return 1.0
		else
			return 0.0
		end
	end

	return overlap / workerSpan
end
# Recall: Intersection / Truth
def rateWorkerRecall(overlap, regionSpan, workerSpan)
	#puts("Recall. overlap: #{overlap}, wSpan: #{workerSpan}")
	if( regionSpan == 0 )
		if( workerSpan == 0 )
			return 1.0
		else
			return 0.0
		end
	end

	return overlap / regionSpan
end

# F1-Score: 2 * (P*R / P+R)
def rateWorkerF1(overlap, regionSpan, workerSpan)
	prec = rateWorkerPrec(overlap, regionSpan, workerSpan)
	recall = rateWorkerRecall(overlap, regionSpan, workerSpan)

	#puts("P: #{prec}, R: #{recall}")

	if( prec+recall == 0 && prec*recall == 0 )  # It should only be possible for the 2nd to be true if the first is
		return 1.0
	end

	return 2*((prec*recall)/(prec+recall))
end

