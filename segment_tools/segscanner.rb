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
require 'kmeans.rb'

# Params
@BinSize = 0.1
@MinSpan = 0.5
@MissThresh = 2



def scanSegments(segSet, timeRange)
	histogram = Array.new
	curOffset = timeRange[0]
	while( curOffset < timeRange[1] )
		binStart = curOffset
		binEnd = binStart + @BinSize

		tally = 0
		contactTally = 0
		# Check all other workers
		segSet.each{ |workerSegments|
			segments = workerSegments[1]
			# Check each segment for this worker
			segments.each{ |seg|
				# Check for overlap	
				if( binStart < seg[1] && binEnd > seg[0] )
					# Check how much overlap exists
					overlapSpan = [binEnd, seg[1]].min - [binStart, seg[0]].max
					# Check that at least have the bun is overlapped
					if( overlapSpan > @BinSize * 0.5 )
						tally += 1  # This should only be possible to increment once per worker per bin
					end
				end
			}
		}
		histogram << [[binStart,binEnd], tally]

		curOffset += @BinSize
	end
	
	return histogram
end

def outputHistogramCSV(hist)
	File.delete("histogram.csv")
	outfile = File.new("histogram.csv", "w")
	hist.each { |binPair|
		outfile.write("#{binPair[0][0]},#{binPair[1]}\n")
	}

	outfile.close
end

def getSegmentsFromHistogram(wSegs, hist, threshold)
	retSegs = Array.new

	# Find each continuous range of above-threshold agreement
	curStart = -1.0
	curEnd = -1.0
	missedBins = 0
	hist.each{ |binPair|  # Format: [start, end], count
		# Check if the current bin should be included
		if( binPair[1] >= threshold )
			# Then update the running segment
			if( curStart < 0 )
				# Set the start time when we see a new segment start
				curStart = binPair[0][0] + getAdjOverlap(binPair[0][0], wSegs, -1, threshold)
				#curStart = binPair[0][0]
			end
			missedBins = 0
			# Update the ending time
			curEnd = binPair[0][1]
		else
			# Reset the running bin
			# TODO: Make this rely on more than 1 missed bin in the future?
			if( missedBins >= @MissThresh )
				# Log the previous streak if there was one
				if( curStart >= 0 )
					curEnd = curEnd + getAdjOverlap(curEnd, wSegs, 1, threshold)
					# Make sure the event is large enough to note
					if( curEnd - curStart >= @MinSpan )
						retSegs << [curStart, curEnd]
					end
				end

				# Reset the trackers
				curStart = -1.0
				curEnd = -1.0
			else
				# If this is a minor gap, just log it
				#puts("MISS NUMBER ##{missedBins}")
				missedBins += 1
			end
		end
	}


	# Return the segment list
	return retSegs
end

# Check to see how much overlap with the prev segment there should be
def getAdjOverlap(borderTime, wSegs, dir, threshold)
#	return 0.0  # Handy disable

	# Figure out the time period we're looking at
	rangeTime = borderTime + (dir*@BinSize)

	diffSet = Array.new
	wSegs.each{ |entry|
		segs = entry[1]

		segs.each{ |seg|
			# If our border falls in the range of this span...
			if( borderTime >= seg[0] && borderTime <= seg[1] )
				# Find out how much the range overlaps, coming from the correct direction
				if( dir < 0 )
					# Then the border is the max
					curDiff = borderTime - [rangeTime, seg[0]].max  # Gets the portion of the range in this bin
				else
					# Dir > 0, so the border is the min
					curDiff = [rangeTime, seg[1]].min - borderTime
				end
				diffSet << curDiff
			end
		}
	}

	# Now, find out what the min winning overlap is
	if( diffSet.length == 0 || diffSet.length < threshold.ceil )
		# Then we can't possibly get enough agreement
		return 0.0
	else
		# Figure out the max overlap that we can use
		sortedSet = diffSet.clone.sort

#puts("#{sortedSet.length} @ #{sortedSet.length-threshold.ceil} (#{threshold})")
		return sortedSet[sortedSet.length-threshold.ceil-1]*dir.to_f
	end

end

def firstSegments(resultSegs, workerSegs, useAverageSpan = true)
  all_worker_segments = []
  workerSegs.each {|ws| all_worker_segments += ws[1]}

  resultSegs.map do |rseg|
    #only intersecting worker segments
    matching_segs = all_worker_segments.reject {|ws| ws[0] > rseg[1] || ws[1] < rseg[0]}

    #reject inputs out 2*STDEV range
    matching_segs = reject_not_trusted_input matching_segs

    min_start = matching_segs.map{|ms| ms[0]}.min

    if useAverageSpan
      #first start and average length
      avg_span_length = matching_segs.map{|ms| ms[1]-ms[0]}.mean
# WSL PATCH:
      if( avg_span_length == nil )
puts("SETTING 0")
        avg_span_length = 0
      end
if( min_start == nil )
puts("NOT MIN TOOOO")
end
      [min_start, min_start + avg_span_length]
    else
      #average minimums and scanning output
      min_end = matching_segs.map{|ms| ms[1]}.min
      [[min_start, rseg[0]].mean, [min_end, rseg[1]].mean]
    end
  end
end

def reject_not_trusted_input(matching_segs, nstdev = 1)
  m_starts = matching_segs.map{|ms| ms[0]}
  m_ends = matching_segs.map{|ms| ms[1]}
  m_lengths = matching_segs.map{|ms| ms[1]-ms[0]}

  m_starts_stdev = m_starts.stdev
  m_starts_mean = m_starts.mean
  m_ends_stdev = m_ends.stdev
  m_ends_mean = m_ends.mean
  m_lengths_stdev = m_lengths.stdev
  m_lengths_mean = m_lengths.mean

  matching_segs.reject do |ms|
    #not trusted start
    ms[0] < (m_starts_mean - nstdev * m_starts_stdev) ||
        ms[0] > (m_starts_mean + nstdev * m_starts_stdev) ||
        #not trusted end
        ms[1] < (m_ends_mean - nstdev * m_ends_stdev) ||
        ms[1] > (m_ends_mean + nstdev * m_ends_stdev) ||
        #not trusted length
        (ms[1] - ms[0]) < (m_lengths_mean - nstdev * m_lengths_stdev) ||
        (ms[1] - ms[0]) > (m_lengths_mean + nstdev * m_lengths_stdev)
  end
end

#use kmeans algorithm
def use_kmeans(workerSegs, threshold, stdev_filtering = nil)
  best_clusters = []
  min_rmse = 1000000000 # lazy maxint

  1000.times do
    begin
      starts = kmeans(workerSegs, :start, threshold, stdev_filtering)
      ends = kmeans(workerSegs, :end, threshold, stdev_filtering)
    rescue Exception => e
      # p 'skipped'
      next
    end

    # Update if best clustering (using average rmse)
    current_rmse = [starts[:rmse], ends[:rmse]].mean
    if current_rmse < min_rmse
      min_rmse = current_rmse

      starts_sorted = starts[:centroids].map{|c| c[0]}.sort
      ends_sorted = ends[:centroids].map{|c| c[0]}.sort

      best_clusters = make_spans_by_points(starts_sorted, ends_sorted)
    end
  end

  best_clusters
end


