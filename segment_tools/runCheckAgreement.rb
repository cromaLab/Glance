

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

# Includes
require 'segmetrics.rb'
require 'rubygems'
require 'json'
require 'dbtools.rb'

# @AgreeTool = "checkAgreement.rb"
@AgreeTool = "checkFleiss.rb"


#####  MAIN  #####

# Open the specified file
inFile = File.open(ARGV[0])

testSet = Array.new

# Parse all of the segment sessions/indexes from file
inFile.each{ |line|
	testSet << line.split
}

# We're done with the input file now
inFile.close

dbh = getDB()

testSet.each{ |entry|
	session = entry[0]
	sql = "SELECT COUNT(*) FROM setup WHERE session='#{entry}' AND clipIndex > -1"
	countAry = queryDB(sql, dbh)
	numClips = 1
	countAry.each{ |v|
		numClips = v[0].to_i
	}

	sum = 0
	for i in 0...numClips
		clipIdx = i
		ans = `ruby #{@AgreeTool} #{session} #{i}`
		# sum += ans.to_i
		# puts "#{session},#{i},#{ans}"
		# fleissAns = `ruby checkFleiss.rb #{session} #{i}`
		# fleissAnsSum += fleissAns
		# puts "#{session},#{i},#{ans}"
		# puts "fleiss:         #{session} #{i} #{ans}"
		puts "#{ans}"
		# puts "#{checkAgreeAns},#{fleissAns}"
	end
	puts ""
}

# EOE Notice
puts("\nDone.")
