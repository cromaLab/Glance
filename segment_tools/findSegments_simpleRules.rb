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
require 'segmerge.rb'
require 'dbtools.rb'

# Params
##



######  MAIN  ######

testSet = Array.new

if( ARGV.length == 1 )
	file = File.open(ARGV[0])
	file.each{ |line|
		testSet << line.split
	}

	file.close
elsif( ARGV.length == 2 )
	testSet << [ARGV[0], ARGV[1]]
end


testSet.each{ |pair|
	# Set test vals for this run
	session = pair[0]
	clipIdx = pair[1]


	#puts("Finding segment boundries for session '" + session + "...")

	# Get the DB hangle
	dbh = getDB()

	# Get the results for this clip/segment from the DB
	sql = "SELECT author,startsegment,endsegment FROM segments WHERE session='#{session}' AND clipIndex='#{clipIdx}' ORDER BY startsegment ASC"
	valAry = queryDB(sql, dbh)

	# Parse the DB results into a segment matrix
	workerSegs = segmentResults(valAry)
	# workerSegs has 1 entry for each worker. It contains all that worker's segments.

	# Get the total number of workers who worked on this task
	wsql = "SELECT DISTINCT workerId FROM visited WHERE page='coding' AND session='#{session}' AND clipIndex='#{clipIdx}' AND submitTime > 0 AND workerId NOT IN (SELECT author FROM segments WHERE session='#{session}' AND clipIndex='#{clipIdx}')"
	countAry = queryDB(wsql, dbh)
	totalWorkers = workerSegs.length
	countAry.each{ |worker|
			#puts("Adding worker: #{worker}")
			#workerSegs[worker] = Array.new
			totalWorkers += 1
	}
	#puts("#{totalWorkers} workers found in db")

	# Filter out segents that fall mor than 2 STDEVs from the average of the others
	filt1Segs = filterOutlierSegments(workerSegs)

	# If there are no more segments, stop processing
	if( filt1Segs.length == 0 )
		#puts("No segements left after filterOutlierSegments")
		next
	end


	# Filter out segments that are separate or sets that are subsumed by the majority
	filt2Segs = filterSubsumedDisjointSegments(filt1Segs)

	# If there are no more segments, stop processing
	if( filt2Segs.length == 0 )
		#puts("No segements left after filterSubsumedDisjointSegments")
		next
	end


	# Calculate the final aggregate segments from the filtered input
	finalSegs = getSegments(filt2Segs, totalWorkers)
	#puts("Final num segs confirm: #{finalSegs.length}")

	# Print the final answers
	#puts("RESULTS :: ")
	for i in 0...finalSegs.length
		if( i > 0 )
			#print(",")
			print(";")
		end

		#puts("Segment ##{i}: #{finalSegs[i].join(" - ")}")
		print("#{finalSegs[i].join("-")}")
		# print("[#{finalSegs[i].join(",")}]")

	end

	if( finalSegs.length > 0 )
		print("\n")
	end

}

# EOE Notice
#puts("\nDone.")



