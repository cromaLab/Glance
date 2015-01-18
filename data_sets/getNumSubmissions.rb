#!/bin/ruby

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

# Includes
require '../segment_tools/dbtools.rb'


# Vars
##



## Output ##


#####  MAIN  #####
dbh = getDB()

# Read clip info
session = ARGV[0]

sql = "SELECT COUNT(*) FROM visited WHERE submitTime > 0 "
countAry = queryDB(sql, dbh)
numClips = 1
countAry.each{ |v|
	numClips = v[0].to_i
}

print numClips




# EOE Notice
# puts("\nDone.")


