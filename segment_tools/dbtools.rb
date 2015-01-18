############################################################
#
#  Functions for connecting to and querying DBs
#
############################################################


# Includes
require 'rubygems'
require 'mysql'
#require 'mysql2'


def getDB()
	# Get the worker data from sql
	dbh = Mysql.connect("localhost", "root", "borkborkbork", "video_coding")
	#puts("DB Handle Aquired!")

	return dbh
end

def queryDB(qry, dbh)
	# Make the DB query
	sth = dbh.query(qry)

	return sth
end

