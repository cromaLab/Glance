#!/bin/ruby

##
#
# Takes in a file with set names and outputs result numbers and summary stats
#
##

# Includes
require 'dbtools.rb'


# Vars
##

def quick_sort(list)
  sl = list.clone
  return sl if sl.size <= 1
  pivot = sl.pop
  left, right = sl.partition { |e| e < pivot }
  quick_sort(left) + [pivot] + quick_sort(right)
end


## Output ##


#####  MAIN  #####
dbh = getDB()

# Read clip info
session = ARGV[0]

sql = "SELECT COUNT(*) FROM setup WHERE session='#{session}' AND clipIndex > -1"
countAry = queryDB(sql, dbh)
numClips = 1
countAry.each{ |v|
	numClips = v[0].to_i
}

for i in 0 .. numClips - 1
	sql = "SELECT * FROM visited WHERE session='#{session}' AND clipIndex = '#{i}' AND page = 'coding' AND firstSaw > 0 AND submitTime > 0"
	rows = queryDB(sql, dbh)

	times = Array.new
	rows.each do |row|
	   times.push(row[3].to_f - row[2].to_f)
	end

	times = times.sort

	print "#{session},#{i},"

	times.each do |time|
	   print "#{time},"
	end

	print "\n"
end




# EOE Notice
# puts("\nDone.")


