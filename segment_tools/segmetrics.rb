#!/bin/ruby

##
#
# Tools for measuring clip response agrement with the baseline
#
##

@VERBOSE = false

# Includes
require 'arraystats.rb'
require 'align.rb'


def getSummaryStats(answer, baseline)
#puts("BASELINE: #{baseline.join(";")}")
#puts("ANSWER: #{answer.join(";")}")
	# Define the vals we're going to return later [Index]
	retHash = Hash.new

	# Create the result categories
	retHash["count"] = nil
	retHash["area"] = nil
	retHash["points"] = nil

	# Find the segment count stats
	retHash["count"] = getCountStats(answer, baseline)
	#puts(retHash["Count"])
	#puts("--------------")

	# Find the start and end -point stats
	retHash["points"] = getPointStats(answer, baseline)
	#puts(retHash["Points"])
	#puts("--------------")

	# Find the start and end -point stats
	retHash["area"] = getAreaStats(answer, baseline)
	#puts(retHash["Area"])
	#puts("--------------")

	retHash["aligned"] = getAlignedStats(answer, baseline, retHash["area"])

	# Return the result array
	return retHash
end


# Count stats: error/precision/recall on number of segments
def getCountStats(answer, baseline)
	retHash = Hash.new

	# Note the specific values we will fill in
	retHash["error"] = nil
	retHash["precision"] = nil
	retHash["recall"] = nil

	# Compute values!
	ansCount = answer.length.to_f
	baseCount = baseline.length.to_f

  #duplicate answers - we want to work with this array
  answer_copy = answer.dup

	hitCount = 0
  baseline.each{ |baseSeg|
		baseStart = baseSeg[0]
		baseEnd = baseSeg[1]
    answer_copy.each_with_index{ |ansSeg, i|
			ansStart = ansSeg[0]
			ansEnd = ansSeg[1]

			if ansStart < baseEnd && ansEnd > baseStart
				hitCount += 1
        answer_copy.delete_at(i)
        break
			end
		}
	}

	if hitCount > 0
		# Calculate precision
		retHash["precision"] = hitCount / ansCount
		# Calculate recall
		retHash["recall"] = hitCount / baseCount
	else
		if ansCount > 0
			retHash["precision"] = 0.0
		else
			retHash["precision"] = 1.0
		end

		if baseCount == 0
			retHash["recall"] = 1.0
		else
			retHash["recall"] = 0.0
		end
	end

	# Return the stats
	retHash
end

# Point stats: differences between closest start/end/center in worker answer and baseline
def getPointStats(answer, baseline)

	## TODO: Fix this so that the points matched cannot be the same (that is, find joint optimal fit, no redundant matches)

	retHash = Hash.new

	# Note the specific values we will fill in
	retHash["start"] = nil
	retHash["end"] = nil
	retHash["center"] = nil

	# Find all of the differences in points
	stArray = Array.new
	endArray = Array.new
	ctrArray = Array.new
	answer.each{ |ansSeg|
		aStart = ansSeg[0]
		aEnd = ansSeg[1]
		aCenter = (ansSeg[0] + ansSeg[1]) / 2.0

if( baseline.length > 0 )
		minStGap = -1
		minEndGap = -1
		minCtrGap = -1
		baseline.each{ |baseSeg|
			bStart = baseSeg[0]
			bEnd = baseSeg[1]
			bCenter = (baseSeg[0] + baseSeg[1]) / 2.0

			# Check if updates are needed
			if( (aStart - bStart).abs < minStGap || minStGap < 0 )
				minStGap = (aStart - bStart).abs
			end
			if( (aEnd - bEnd).abs < minEndGap || minEndGap < 0 )
				minEndGap = (aEnd - bEnd).abs
			end
			if( (aCenter - bCenter).abs < minCtrGap || minCtrGap < 0 )
				minCtrGap = (aCenter - bCenter).abs
			end
		}
end

	}

	# Calculate answers
	retHash["start"] = stArray.mean
	retHash["end"] = endArray.mean
	retHash["center"] = ctrArray.mean


	# Return the stats
	return retHash
end

# Area stats: precision/recall/error for the overlapping regions between the worker answer and the baseline
def getAreaStats(answer, baseline)
	retHash = Hash.new

	# Note the specific values we will fill in
	retHash["precision"] = nil
	retHash["recall"] = nil


	# Find the overlap in all segments
	totalOverlap = 0.0
	workerTotal = 0.0
	baseTotal = 0.0
	firstPassAnswer = true
	answer.each{ |ansSeg|
		aStart = ansSeg[0]
		aEnd = ansSeg[1]
		if( @VERBOSE )
			puts("ANSWER SPAN: #{aStart} - #{aEnd}");
		end

		baseline.each{ |baseSeg|
			bStart = baseSeg[0]
			bEnd = baseSeg[1]
			if( @VERBOSE )
				puts("BASELINE SPAN: #{bStart} - #{bEnd}");
			end

			#puts("Checking: #{aStart} < #{bEnd} && #{aEnd} > #{bStart}")
			# If there is some overlap...
			if( aStart < bEnd && aEnd > bStart )
				# Find the span of the overlap
				totalOverlap += [aEnd, bEnd].min - [aStart, bStart].max
				#puts("ADDING #{[aEnd, bEnd].min} - #{[aStart, bStart].max} (#{aStart}, #{bStart}) = #{[aEnd, bEnd].min - [aStart, bStart].max}")
			end

			if( firstPassAnswer )
				# Add to the total area of the baseline answer
				baseTotal += bEnd - bStart
				#puts("BASELINE ADDING #{bEnd} - #{bStart} = #{bEnd - bStart}")
			end
		}

		# Add to the total area of the worker answer
		workerTotal += aEnd - aStart
		firstPassAnswer = false
	}
	if( firstPassAnswer ) # if we never entered the loop above...
		baseline.each{ |baseSeg|
			bStart = baseSeg[0]
			bEnd = baseSeg[1]

			if( firstPassAnswer )
				# Add to the total area of the baseline answer
				baseTotal += bEnd - bStart
				#puts("BASELINE ADDING #{bEnd} - #{bStart} = #{bEnd - bStart}")
			end
		}
		firstPassAnswer = false
	end
	

	if( @VERBOSE )
		puts("Total overlap: #{totalOverlap}")
		puts("Total worker: #{workerTotal}")
		puts("Total baseline: #{baseTotal}")
	end

	if( totalOverlap > 0 )
		retHash["precision"] = totalOverlap / workerTotal
		retHash["recall"] = totalOverlap / baseTotal
		if( @VERBOSE )
			puts("P/R: " + retHash["precision"].to_s + " / " + retHash["recall"].to_s);
		end
	else
		# puts("No overap.");
		if( workerTotal > 0 )
			retHash["precision"] = 0.0
		else
			retHash["precision"] = 1.0
		end

		if( baseTotal == 0 )
			retHash["recall"] = 1.0
		else
			retHash["recall"] = 0.0
			#retHash["error"] = 1.0
		end
	end

	# Return the stats
	return retHash
end


def getAlignedStats(answer, baseline, area_stats = nil)
	#ans = alignSegs(answer, baseline)
	retHash = Hash.new


	if( baseline == nil || baseline.length == 0 )
		if( @VERBOSE )
			puts(">> NIL IN BASELINE");
		end

		retHash["recall"] = 1.0
		if( answer.length > 0 )
			retHash["precision"] = 0.0
		else
			retHash["precision"] = 1.0
		end

		return retHash
	elsif( answer == nil || answer.length == 0 )
		if( @VERBOSE )
			puts("ANSWER NIL:: #{answer}")
		end

		retHash["recall"] = 0.0
		retHash["precision"] = 1.0
		#retHash["error"] = 1.0

		return retHash
	else
		if( @VERBOSE )
			puts("DATA IN BOTH SETS.");
		end
	end

	ans = solveAlign(answer, baseline)

	retHash = getAreaStats(ans["segs"], baseline)
	retHash["shift"] = ans["shift"]

  if area_stats
    retHash['precision'] = [retHash['precision'], area_stats['precision']].max
    retHash['recall'] = [retHash['recall'], area_stats['recall']].max
  end

	return retHash
end


# API Wrapper for PR-returning stats
def apiParsePR(inArray)
	print("#{inArray["precision"]},#{inArray["recall"]}")
	if( inArray["shift"] != nil )
		print(",#{inArray["shift"]}")
	end
end
# API Wrapper for point-returning stats
def apiParsePoints(inArray)
	print("#{inArray["start"]},#{inArray["center"]},#{inArray["end"]}")
end

