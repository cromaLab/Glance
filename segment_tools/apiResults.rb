#!/bin/ruby

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

@VERBOSE = false

# Includes
require 'segmetrics.rb'
require 'dbtools.rb'
require 'json'


# Vars
@BaseSuffix = "Baseline2"  # Use this value to append to the DB query session to set "baseline" mode
#@ToolName = "findSegments_simpleRules.rb"  # Current FindSegments tool (Ruby)
@ToolName = "findSegments_scanning.rb"
@Type = ""
@UseAligned = false

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

#####  MAIN  #####
session = ARGV[0]

if( ARGV[1] )
	@ToolName = ARGV[1]

	if( ARGV[2] )
		@Type = ARGV[2]
	end
end

# If a session has a Baseline3, use it
if session == "designExcitement" || session == "designFocus" || session == "eyeContact1" || session == "eyeContact2"
	@BaseSuffix = session + "Baseline3"
elsif session == "dateNodBlurLevel6" || session == "dateNodBlurLevel4" || session == "dateNodBlurLevel10"
	@BaseSuffix = "dateNodFullBaseline2"
elsif session == "interview_level3_headturn" || session == "interview_level4_headturn" || session == "interview_level6_headturn" || session == "interview_level5_headturn" || session == "interview_level10_headturn"
	@BaseSuffix = "interview_baseline_headturn"
elsif session == "interview_level3_eyeContact" || session == "interview_level4_eyeContact" || session == "interview_level6_eyeContact" || session == "interview_level5_eyeContact" || session == "interview_level10_eyeContact"
	@BaseSuffix = "interview_baseline_eyeContact"
elsif session == "interview_level3_smile" || session == "interview_level4_smile" || session == "interview_level6_smile" || session == "interview_cropped_smile" || session == "interview_level5_smile" || session == "interview_level10_smile"
	@BaseSuffix = "interview_baseline_smile"
elsif session == "interview_level3_openbody" || session == "interview_level4_openbody" || session == "interview_level6_openbody" || session == "interview_level5_openbody" || session == "interview_level10_openbody"
	@BaseSuffix = "interview_baseline_openbody"
elsif session == "interview_level3_facetouch" || session == "interview_level4_facetouch" || session == "interview_level6_facetouch" || session == "interview_level5_facetouch" || session == "interview_level10_facetouch"
	@BaseSuffix = "interview_baseline_facetouch"
else
	@BaseSuffix = session + @BaseSuffix
end

# Get the DB hangle
dbh = getDB()

# Get the total number of workers who worked on this task
sql = "SELECT COUNT(*) FROM setup WHERE session='#{session}' AND clipIndex > -1"
countAry = queryDB(sql, dbh)
numClips = 1
countAry.each{ |v|
	numClips = v[0].to_i
}


wTotalArray = Array.new
bTotalArray = Array.new
# For each segment, run get worker and baseline data
clip_stats = []
for i in 0...numClips
	clipIdx = i
	# Run the FindSegment tool
	if( @ToolName == "findSegments_simpleRules.rb")
		workerAns = `ruby #{@ToolName} #{session} #{clipIdx}`  # Get the crowd's combined answer
		baselineAns = `ruby #{@ToolName} #{@BaseSuffix} #{clipIdx}`  # Get the baseline answer
	else
		workerAns = `ruby #{@ToolName} #{session} #{clipIdx} #{@Type}`  # Get the crowd's combined answer
		baselineAns = `ruby #{@ToolName} #{@BaseSuffix} #{clipIdx} #{@Type}`  # Get the baseline answer
	end
	# puts("Querying: ruby #{@ToolName} #{session}#{@BaseSuffix} #{clipIdx} #{@Type}")

	# puts("Worker ans: #{workerAns}[.]")
	# puts("Baseline ans: #{baselineAns}[.]")

	# Parse the results into arrays
	wArray = parseAnsStr(workerAns)
	bArray = parseAnsStr(baselineAns)

	# Update the aggregate arrays
	wTotalArray += wArray
	bTotalArray += bArray

	# TODO: Add time-shift code
	avgTimeShift = 0.0
	if( @UseAligned )
		# Align the output segments to their best-fit in the baseline for comparison
	end

	# puts("W: #{wArray}, B: #{bArray}")

	## Summary Statistics ##
	stats = getSummaryStats(wArray, bArray)  # Returns a complex hashmap of categorized stats


	if( @VERBOSE )
		puts("STATS: #{stats.inspect}\n\n")
	end
	clip_stats << stats
end


total_stats = getSummaryStats(wTotalArray, bTotalArray)  # Returns a complex hashmap of categorized stats

if( ARGV[3] )
	if(ARGV[3] == "betterJSON")
		output = ({:clip_stats => clip_stats , :total_stats => total_stats}.to_json(:allow_nan => true))
		output.gsub! 'NaN', 'null'
		puts output
	end
else 
	p({:clip_stats => clip_stats , :total_stats => total_stats}.to_json(:allow_nan => true))
end


