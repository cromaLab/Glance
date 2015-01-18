#!/bin/ruby

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

# Includes
require 'agreemetrics.rb'
require 'parsetools.rb'
require 'dbtools.rb'


# Vars
##


## Output ##
def printRaw(str)
	puts(str)
end

#####  MAIN  #####


# Read clip info
session = ARGV[0]
clipIdx = ARGV[1]


# Get the DB hangle
dbh = getDB()

# Get the results for this clip/segment from the DB
sql = "SELECT author,startsegment,endsegment FROM segments WHERE session='#{session}' AND clipIndex='#{clipIdx}' ORDER BY startsegment ASC"
valAry = queryDB(sql, dbh)

workerSegs = segmentResults(valAry)

# TODO: Add all non-inputting workers to this list with 0 segments (empty array for entry[1], workerID for entry[0])

currentAgreement = checkAgreement(workerSegs)


# Print out summary stats as desired
# puts("\n\n======  Results for \"#{session}\" clip ##{clipIdx}  ======")
printRaw(currentAgreement)



# EOE Notice
# puts("\nDone.")


