#!/bin/ruby

##
#
# Tools for measuring clip agrement between workers as a task progresses
#
##

# Includes
require 'arraystats.rb'


def checkAgreement(workerSegs)
	# Find the area-based agreement score
	countVal = getCountAgreement(workerSegs)
# puts("COUNT: #{countVal}")

	# Find the area-based agreement score
	areaVal = getAreaAgreement(workerSegs)
# puts("AREA: #{areaVal}")

  # Find the variance of worker-described duration
  duration_variance = get_duration_variance(workerSegs)
# puts("VARIANCE: #{duration_variance}")

	# Select the current combination of values to use
	retVal = countVal
	#retVal = (countVal+areaVal)/2.0;


	# Return the result array
	return retVal
end


# Count stats: measure the number of answers each worker is generating
def getCountAgreement(workerSegs)
	# Collect the number of segments found by each worker
	countArray = Array.new
	workerSegs.each{ |entry|
		wID = entry[0]
		segs = entry[1]

		countArray << segs.length
	}

	# puts("Array: #{countArray.join(", ")}")
	# puts("STDEV: #{countArray.stdev}")
	# puts("MIN: #{countArray.min}")
	# puts("MAX: #{countArray.max}")
	# puts("AVRG: #{countArray.mean}")


	#Calculate our count-score
	retVal = 1.0 - (countArray.stdev / (1 + (countArray.mean)))

	# Return our agreement level estimate
	return retVal
end

# Returns the variance in the duration reported
# by the workers. Sums up the total duration over
# all reported segments for each worker.
# Input:
#   worker_segments: Array of Array of workerId, Array of segments, which are arrays of start, stop points
# Returns:
#   a float variance
def get_duration_variance(worker_segments)
  # Pull out lists of segments (id doesn't matter)
  segment_lists = worker_segments.map {|worker_segment| worker_segment[1]}

  # We now have the structure:
  # [[segment1, segment2, segment3],
  #  [segment1, segment2, segment3]]
  # Where each segment looks like:
  #  [start, stop]
  maxDur = 1;
  numDur = 0;
  durations = segment_lists.map do |segment_list|
    if( segment_list.length > numDur )
      numDur = segment_list.length
    end
    segment_list.reduce(0.0) do |worker_duration, segment|
      segment_duration = segment[1] - segment[0]
      if( segment_duration > maxDur )
        maxDur = segment_duration
      end
      worker_duration = segment_duration
    end
  end
  return durations.variance/(maxDur*numDur)
end

# Area agreement: measure overlapping regions between the worker answers
def getAreaAgreement(workerSegs)
	# The maximum overlap, calculated as the sum of pairs, can be = N * SUM(worker_area, 1, N)

	totalOverlap = 0.0
	totalArea = 0.0
	workerSegs.each{ |entry|
		curWorker = entry[0]
		segments = entry[1]

		# For each segment in the worker's responses...
		segments.each{ |seg|
			segStart = seg[0]
			segEnd = seg[1]

			workerOverlap = 0.0
			# Compare to each other worker's responses...
			workerSegs.each{ |compareEntry|
				if( compareEntry[0] == curWorker )
					# Skip this comparison if it's the same worker's input
					next
				end

				# Add the overlapping spans
				compareEntry[1].each{ |compareSeg|
					cmpStart = compareSeg[0]
					cmpEnd = compareSeg[1]

					# If th two segments overlap...
					if( segStart < cmpEnd && segEnd > cmpStart )
						# Then add the total area of the overlap
						workerOverlap += [segEnd, cmpEnd].min - [segStart, cmpStart].max
					end

					# Even if there is no overlap, increase the aggregate potential area (normalizing value)
					totalArea += segEnd - segStart
				}
			}


			# Update the aggregate counters
			totalOverlap += workerOverlap
		}
	}


	# Calculate our agreement score
	retVal = totalOverlap / totalArea
	# puts("Agree = #{totalOverlap} / #{totalArea} = #{retVal}")
	# Return the agreement estimate
	return retVal
end

# useful if we want to use worker inputs
# w1 1 0 0
# w2 1 0 1
# w3 1 0 1
# w4 0 0 0 - didn't report
# def checkFleissKappa(histogram)
#   big_n = workersData.first.length #number of subjects
#   n = workersData.length
#   k = 2 #number of categories (0,1)
#
#   # build voting matrix
#   nij = (0..1).map do |subj|
#     nj = Array.new(big_n,0)
#     workersData.each do |wd|
#       (1..big_n).each do |i|
#         nj[i-1] += 1 if wd[i-1] == subj
#       end
#     end
#     nj
#   end
#
#   ...
# end

# use histogram and it's reverted version
def checkFleissKappa(histogram, n_workers)
  return 1 if n_workers == 1 #full agreement

  big_n = histogram.length #number of subjects
  n = n_workers

  # build voting matrix
  histogram = histogram.map{|h| h[1]}
  nij = [histogram, reverted_histogram(histogram, n_workers)]

  # pj
  pj = nij.map{|nj| nj.sum/big_n/n}

  # Pi
  pi = Array.new(big_n,0)
  (1..big_n).each do |i|
    pi[i-1] = ((0..1).map{|j| nij[j][i-1]**2}.sum - n)/n/(n-1)
  end

  # P_
  p_mean = pi.mean

  # P_e
  p_e = pj.map{|p| p**2}.sum

  k = if p_e == 1
    1 #edge case when all agree on all counts, meaning that we have no second category, but algorithm will give a division by zero
  else
    (p_mean - p_e)/(1 - p_e)
  end

end

def reverted_histogram(histogram, n)
  histogram.map {|h| n - h}
end

