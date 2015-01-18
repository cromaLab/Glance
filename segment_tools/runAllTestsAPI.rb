

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

# Includes
require 'segmetrics.rb'
require 'rubygems'
require 'json'


# Vars
@ToolModes = ["default", "jaccard", "f1", "noem", "kmeans", "simple"]
# @ToolModes = ["default", "jaccard", "f1", "simple"]
@OutputDir = "blur_temp_results_csv" # CSV files will be output to this dir


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
# Order of printing: ["default", "jaccard", "f1", "noem", "kmeans", "simple"]

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
@ToolModes.each{ |mode|
	isFirst = true
	out_file = File.new("#{@OutputDir}/#{mode}.csv", "w")
	out_file.puts("session,clip,area,,count,,aligned,") # header info
	out_file.puts(",,precision,recall,precision,recall,precision,recall") # header info
	puts "working..." 
	testSet.each{ |entry|
		session = entry[0]
		if mode == "simple"
			@ToolName = "findSegments_simpleRules.rb"
		else 
			@ToolName = "findSegments_scanning.rb"
		end

		# Run the FindSegment tool
		ans = `ruby apiResults.rb #{session} #{@ToolName} #{mode} betterJSON`  # Get the answer
		parsed = JSON.parse(ans)


		i = 0
		parsed["clip_stats"].each{ |clip|

# #WSL DEBUG::
 if( clip['area']['precision'].to_f > clip['aligned']['precision'].to_f || clip['area']['recall'].to_f > clip['aligned']['recall'].to_f)
 	puts("#{session}(#{mode}) ##{i}: START: (#{clip['area']['precision']}, #{clip['area']['recall']} | ALIGNED: (#{clip['aligned']['precision']}, #{clip['aligned']['recall']}) << SHIFT: #{clip['aligned']['shift']}")
 end
			out_file.print("#{session},#{i},#{clip['area']['precision']},#{clip['area']['recall']},#{clip['count']['precision']},#{clip['count']['recall']}")
			if clip['aligned']['precision'] >= clip['area']['precision'] && clip['aligned']['recall'] >= clip['area']['recall']
				out_file.print(",#{clip['aligned']['precision']},#{clip['aligned']['recall']}")
			end
			i = i + 1
			out_file.print "\n"
		}
		clip = parsed["total_stats"]
		out_file.print("#{session},overall,#{clip['area']['precision']},#{clip['area']['recall']},#{clip['count']['precision']},#{clip['count']['recall']}")
		if clip['aligned']['precision'] >= clip['area']['precision'] && clip['aligned']['recall'] >= clip['area']['recall']
			out_file.print(",#{clip['aligned']['precision']},#{clip['aligned']['recall']}")
		end
		out_file.print "\n"
		isFirst = false
	}
	out_file.close
	puts "#{mode} done"

}

# EOE Notice
puts("\nDone.")


