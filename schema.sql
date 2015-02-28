-- MySQL dump 10.13  Distrib 5.5.38, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: video_coding
-- ------------------------------------------------------
-- Server version	5.5.38-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `answer` varchar(99) DEFAULT NULL,
  `question` varchar(99) DEFAULT NULL,
  `session` varchar(99) DEFAULT NULL,
  `workerId` varchar(99) DEFAULT NULL,
  `setupId` int(11) DEFAULT NULL,
  `clipIndex` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3060 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `links`
--

DROP TABLE IF EXISTS `links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `links` (
  `session` varchar(99) DEFAULT NULL,
  `link` varchar(99) DEFAULT NULL,
  `author` varchar(99) DEFAULT NULL,
  `timestamp` bigint(20) DEFAULT NULL,
  `numresp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `percentSampled`
--

DROP TABLE IF EXISTS `percentSampled`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `percentSampled` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `session` varchar(99) DEFAULT NULL,
  `percent` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=219 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `segments`
--

DROP TABLE IF EXISTS `segments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `segments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session` varchar(99) DEFAULT NULL,
  `author` varchar(99) DEFAULT NULL,
  `startsegment` float DEFAULT NULL,
  `endsegment` float DEFAULT NULL,
  `confidence` varchar(99) DEFAULT NULL,
  `clipIndex` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8466 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_name` varchar(99) NOT NULL DEFAULT '',
  `session_id` varchar(999) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `active` tinyint(1) DEFAULT NULL,
  `routed_count` int(11) DEFAULT '0',
  `finished_count` int(11) DEFAULT '0',
  `max` int(11) DEFAULT NULL,
  `clipIndex` int(11) DEFAULT NULL,
  `group` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`session_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `setup`
--

DROP TABLE IF EXISTS `setup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setup` (
  `setupId` int(11) NOT NULL AUTO_INCREMENT,
  `videoId` varchar(99) DEFAULT NULL,
  `start` float DEFAULT NULL,
  `end` float DEFAULT NULL,
  `clipStart` float DEFAULT NULL,
  `clipEnd` float DEFAULT NULL,
  `action` varchar(99) DEFAULT NULL,
  `description` text,
  `session` varchar(99) DEFAULT NULL,
  `trial` varchar(99) DEFAULT NULL,
  `clipIndex` int(11) DEFAULT NULL,
  `mturk` varchar(99) DEFAULT NULL,
  `clipLength` float DEFAULT NULL,
  `initialStart` float DEFAULT NULL,
  `initialEnd` float DEFAULT NULL,
  PRIMARY KEY (`setupId`)
) ENGINE=InnoDB AUTO_INCREMENT=2984 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tutorialLog`
--

DROP TABLE IF EXISTS `tutorialLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tutorialLog` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `workerId` varchar(99) DEFAULT NULL,
  `mode` varchar(99) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=807 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visited`
--

DROP TABLE IF EXISTS `visited`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visited` (
  `workerId` varchar(99) DEFAULT NULL,
  `page` varchar(99) DEFAULT NULL,
  `arrivalTime` varchar(120) DEFAULT NULL,
  `submitTime` varchar(120) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session` varchar(99) DEFAULT NULL,
  `clipIndex` int(11) DEFAULT NULL,
  `firstSaw` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21791 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-18 17:32:30
