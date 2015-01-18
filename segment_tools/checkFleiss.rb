require 'agreemetrics.rb'
require 'arraystats.rb'
require 'segscanner.rb'
require 'dbtools.rb'

######  MAIN  ######

session = ARGV[0]
clipIdx = ARGV[1]


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
  totalWorkers += 1
}

csql = "SELECT start,end FROM setup WHERE session='#{session}' AND clipIndex='#{clipIdx}'"
clipSpanAry = queryDB(csql, dbh)

clipTimes = nil
clipSpanAry.each{ |entry|  # NOTE: There should only be one
  clipTimes = [entry[0].to_f, entry[1].to_f]
}


segHistogram = scanSegments(workerSegs,  clipTimes)
k = checkFleissKappa segHistogram, totalWorkers

p k