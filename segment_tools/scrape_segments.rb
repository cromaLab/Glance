############################################################
##
## Get formatted output for the db contexnts related to a
##  given test file.
##
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

	puts("\n#{session},#{clipIdx}")
	#puts("\n#{session}")

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


	#puts("START: #{workerSegs} @ #{workerSegs.length}")
	workerSegs.each{ |workerEntry|
		print("#{workerEntry[0]}:")

		workerEntry.each{ |segEntry|
			isFirstSeg = true
			segEntry.each{ |seg|

				if( seg.length == 2 )  # Confirm we have a pair not a worker ID string
					if( !isFirstSeg )
						print(";")
					else
						isFirstSeg = false
					end

					print("#{seg[0]}_#{seg[1]}")
				end
			}
		}
		puts("\n")
	}
}

# EOE Notice
#puts("\nDone.")



