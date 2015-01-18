#!/bin/ruby

###################
### Version 1.0 ###
###################

# TO RUN: ruby findSegments.rb <SESSION_NAME> <START_TIME_IN_SECONDS> <END_TIME_IN_SECONDS>

require 'rubygems'
require 'mysql'


# Tools
#########

def timeToFloat(inTimeStr)
	timeStrAry = inTimeStr.split(':')
	return (vidLenAry[0].to_i + (vidLenAry[1].to_f / 60.0))
end

#########



# Params
spanTime = 30 #seconds

session = ARGV[0]
#@VideoStart = timeToFloat(ARGV[1])
#@VideoEnd = timeToFloat(ARGV[2])
@VideoStart = ARGV[1].to_f
@VideoEnd = ARGV[2].to_f



##############################

# K-Means clustering implementation for 1D data (in workerSegments array structure)
def kMeans( workerSegs, idx )
	## First, find our guess for K
	##  This can be improved by jointly optimizing the start and end times and seeing tightest correlation
	totalEntries = 0
	entryCounts = Array.new
	linearSet = Array.new
	workerSegs.each{ |entry|
		numEntries = entry.length
		totalEntries += numEntries
		entryCounts << numEntries

		entry.each{ |segRange|
			linearSet << segRange[idx].to_f
		}
	}
	puts("Total entries: " + totalEntries.to_s)

	# Find the median value to use as K
	entryCounts = entryCounts.sort
	k = (entryCounts[(workerSegs.length - 1) / 2] + entryCounts[workerSegs.length / 2]) / 2.0


	## Now find the clusters

	# First, initialize the K centroids
	centroids = Array.new
	for i in 0...k
		newRand = 0
		# Loop until we have non-overlapping centroids
		while( newRand == 0 || centroids.include?(newRand) )
			newRand = @VideoStart + (rand() * (@VideoEnd - @VideoStart))
		end

		centroids << newRand
	end

	# Next, match all points to their centroid
	lastMatch = Array.new(linearSet.length)
	delta = linearSet.length
	while( delta > 0 )
		puts("\nSTART: " + delta.to_s)
		newMatch = Array.new
		# For each point...
		for i in 0...linearSet.length
			minDist = @VideoEnd
			minIdx = -1
			# For each centroid...
			for j in 0...centroids.length
				#puts("::: #{linearSet[i]}")
				#puts("||| " + centroids[j])
				if( (centroids[j] - linearSet[i].to_f).abs < minDist )
					minDist = centroids[j] - linearSet[i]
					minIdx = j
				end
			end
			newMatch[i] = minIdx
		end

		
		# Update the "last" set with the new values
		centroidSets = Hash.new
		delta = 0
		# For each point...
		for i in 0...linearSet.length
			if( lastMatch[i] != newMatch[i] )
				# Mark a change if the new is not the same as the old
				puts("Diff: #{lastMatch[i]} VS #{newMatch[i]} --> #{delta}++")
				delta += 1
			else
				puts("Match: #{lastMatch[i]} VS #{newMatch[i]} --> #{delta}.")
			end

			# Bin the times by centroid
			if( centroidSets[newMatch[i]] == nil )
				centroidSets[newMatch[i]] = Array.new
			end

			centroidSets[newMatch[i]] << linearSet[i]
		end

		lastMatch = Array.new(newMatch)

		# Next, find the best centroid locations and update
		for i in 0...centroidSets.length
			setTotal = 0
			if( centroidSets[i] != nil )
				# For each centroid bin...
				for j in 0...centroidSets[i].length
					setTotal += centroidSets[i][j]
				end
				centroids[i] = setTotal.to_f / centroidSets[i].length.to_f
			end
		end

		puts("Delta END = " + delta.to_s)
	end


	return Array.new(centroids)
end

##############################



puts("Finding segment boundries for session '" + session + "'.")

# Get the worker data from sql
dbh = Mysql.connect("localhost", "root", "borkborkbork", "video_coding")
#puts("DB Handle Aquired!")

sql = "SELECT author,startsegment,endsegment FROM segments WHERE session='" + session + "' ORDER BY startsegment ASC";
#puts(sql)

# Make the DB query
sth = dbh.query(sql)

# Store all of the worker-labeled start and end points in an array:: Structure - [author][answer #][0=start, 1=end]
workerSegments = Hash.new

# For each entry returned from the DB...
sth.each{ |row|
	worker = row[0]
	startTime = row[1]
	endTime = row[2]
	puts(worker + " | " + startTime + " | " + endTime)

	# If this is the first input we've seen from the worker, add a worker answer array
	if( !workerSegments.include?(worker) )
		workerSegments[worker] = Hash.new
	end

	# Store the worker's answer
	toAdd = Array.new
	toAdd[0] = startTime
	toAdd[1] = endTime
	workerSegments[worker] = toAdd
}



#####
# Now that we have all of the data, extract the segment boundries
#  METHOD: [brute-force] K-Means
#####

finalStarts = kMeans(workerSegments, 0)
finalEnds = kMeans(workerSegments, 0)

puts("Final ST size: #{finalStarts.length}")
puts("Final END size: #{finalEnds.length}")

finalSegments = Array.new
for i in 0...finalStarts.length
	toAdd = Array.new
	toAdd[0] = finalStarts[i]
	toAdd[1] = finalEnds[i]

	finalSegments << toAdd
end


# Print the final result
puts("Final Results ::")
puts("----------------")
for i in 0...finalSegments.length
	if( i > 0 )
		print("; ")
	end

	print("{#{finalSegments[i][0]}, #{finalSegments[i][1]}}")
end



puts("\nDone.")

