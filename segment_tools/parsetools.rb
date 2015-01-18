#!/bin/ruby



# Create a formatted segment matrix from from th DB output
def segmentResults(inSet)
	# Store all of the worker-labeled start and end points in an array:: Structure - [author][answer #][0=start, 1=end]
	workerSegments = Hash.new
	# For each entry returned from the DB...
	inSet.each{ |row|
		worker = row[0]
		startTime = row[1].to_f
		endTime = row[2].to_f

		# If this is the first input we've seen from the worker, add a worker answer array
		if( !workerSegments.include?(worker) )
			workerSegments[worker] = Array.new
		end

		# Store the worker's answer
		toAdd = Array.new
		toAdd[0] = startTime
		toAdd[1] = endTime
		workerSegments[worker].push(toAdd)
	}

	# Structure: [worker][segment_in_clip_index][start_time,end_time]
	return workerSegments
end

