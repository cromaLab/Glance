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
require 'segscanner.rb'
require 'scanEM.rb'
require 'dbtools.rb'

# Params
@Threshold = 0.6
@Refinement = "default"


######  MAIN  ######

testSet = Array.new

if( ARGV.length == 1 )
	file = File.open(ARGV[0])
	file.each{ |line|
		testSet << line.split
	}

	file.close
elsif( ARGV.length >= 2 )
	testSet << [ARGV[0], ARGV[1]]
end

if( ARGV.length == 3 )
	@Refinement = ARGV[2].downcase
	#puts("SETTING:: #{@Refinement}")
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

  finalSegs = if @Refinement == 'kmeans'
     #use_kmeans(workerSegs, totalWorkers*@Threshold) for no filtering
     #use_kmeans(workerSegs, totalWorkers*@Threshold, 1) for 2*STDEV filtering
     #use_kmeans(workerSegs, totalWorkers*@Threshold, 2) for 4*STDEV filtering, etc
     use_kmeans(workerSegs, totalWorkers*@Threshold, 1)
  else
    # Find the start and end times of this clip (acts as a worst-case scan range)
    # TODO: Use the max/min range times to reduce wasted cycles
    csql = "SELECT start,end FROM setup WHERE session='#{session}' AND clipIndex='#{clipIdx}'"
    clipSpanAry = queryDB(csql, dbh)

    clipTimes = nil
    clipSpanAry.each{ |entry|  # NOTE: There should only be one
      clipTimes = [entry[0].to_f, entry[1].to_f]
    }

    if( clipTimes == nil )
        next
    end


    segHistogram = scanSegments(workerSegs,  clipTimes)
    outputHistogramCSV(segHistogram)
    resultSegs = getSegmentsFromHistogram(workerSegs, segHistogram, totalWorkers*@Threshold)


    # Refine the results
    if @Refinement == 'noem'
      fsOutput = firstSegments(resultSegs, workerSegs)
# WSL DEBUG:
puts("NOEM DEBUG: #{fsOutput}")
      fsOutput
    else
      refineSegmentsEM(resultSegs, workerSegs, @Refinement)
    end
  end

	# Print the final answers
	#puts("RESULTS :: ")
	if( finalSegs != nil )
	for i in 0...finalSegs.length
		if( i > 0 )
			#print(",")
			print(";")
		end

		#puts("Segment ##{i}: #{finalSegs[i].join(" - ")}")
		print("#{finalSegs[i].join("-")}")
		# print("[#{finalSegs[i].join(",")}]")

	end
	end

	if( finalSegs != nil && finalSegs.length > 0 )
		print("\n")
	end

}

# EOE Notice
#puts("\nDone.")


