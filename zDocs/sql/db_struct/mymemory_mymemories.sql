-- CREATE DATABASE  IF NOT EXISTS `mymemory` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `memozgbn_mymemory`;
-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mymemory
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mymemories`
--

DROP TABLE IF EXISTS `mymemories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mymemories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL COMMENT '- person\n- animal\n- object\n',
  `text` varchar(450) DEFAULT NULL,
  `link` varchar(250) DEFAULT NULL COMMENT 'link of the image- where to get the picture',
  `href` varchar(250) DEFAULT NULL COMMENT 'link point to a website to show about the person/object, etc',
  `private` tinyint(4) DEFAULT '0' COMMENT 'private = parents, friends, etc\npublic = public people: artists, sport, polititian, etc\n',
  `user` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `status` varchar(45) DEFAULT '0' COMMENT 'status of the memory\n0 - show it\n1- do not show it',
  `picture` varchar(150) DEFAULT NULL COMMENT 'name of the file with the picture - use this field or the link field',
  PRIMARY KEY (`id`),
  KEY `mymem.user_idx` (`user`),
  KEY `mymem.name_id_idx` (`id`,`name`),
  CONSTRAINT `mymem.user` FOREIGN KEY (`user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-17 13:06:52
