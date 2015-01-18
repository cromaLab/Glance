#!/bin/ruby

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

# Includes
require 'segmetrics.rb'


# Vars
@BaseSuffix = "Baseline2"  # Use this value to append to the DB query session to set "baseline" mode
#@ToolName = "findSegments_simpleRules.rb"  # Current FindSegments tool (Ruby)
@ToolName = "findSegments_scanning.rb"


## Parsing Tools ##
def parseAnsStr(answerStr)
	# 
	retArray = Array.new
	answerStr.split(";").each{ |segmentStr|
		segAry = segmentStr.split("-")
		startTime = segAry[0].to_f  # Convert to a number
		endTime = segAry[1].to_f  # Convert to a number

		retArray << [startTime, endTime]
	}

	return retArray
end


## Output ##
def printStats(stats)
	stats.each{ |category, results|
		puts("#{category}::")
		results.each{ |name, value|
			puts("#{name}: #{value}")
		}
		puts("\n")
	}
end

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


# For each segment, run get worker and baseline data
isFirst = true
testSet.each{ |entry|
	session = entry[0]
	clipIdx = entry[1]

	# Run the FindSegment tool
	workerAns = `ruby #{@ToolName} #{session} #{clipIdx}`  # Get the crowd's combined answer
	baselineAns = `ruby #{@ToolName} #{session}#{@BaseSuffix} #{clipIdx}`  # Get the baseline answer


	# Parse the results into arrays
	wArray = parseAnsStr(workerAns)
	bArray = parseAnsStr(baselineAns)

	## Summary Statistics ##
	stats = getSummaryStats(wArray, bArray)  # Returns a complex hashmap of categorized stats
	if( ARGV[1] )
		case ARGV[1].downcase
		when "area"
			if( !isFirst )
				print(";")
			end
			apiParsePR(stats["Area"])  # Returns a complex hashmap of categorized stats
		end
	else
		# Print out summary stats as desired
		puts("\n\n======  Results for \"#{session}\" clip ##{clipIdx}  ======")
		printStats(stats)
		puts("=================================================\n")
	end

	isFirst = false
}


# EOE Notice
puts("\nDone.")


