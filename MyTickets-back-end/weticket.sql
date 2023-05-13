-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: May 13, 2023 at 12:36 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.0.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weticket`
--

-- --------------------------------------------------------

--
-- Table structure for table `ticket_data`
--

CREATE TABLE `ticket_data` (
  `ticketID` int(11) NOT NULL,
  `contactID` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `description` varchar(100) NOT NULL,
  `created_by_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ticket_data`
--

INSERT INTO `ticket_data` (`ticketID`, `contactID`, `title`, `description`, `created_by_date`) VALUES
(1, 1, 'Ticket 1', 'This is ex!', '2023-05-10 09:43:42'),
(2, 3, 'Ticket 2', 'Ticket 2 is expensive! But it is so worth for buying.', '2023-05-10 15:49:11');

-- --------------------------------------------------------

--
-- Table structure for table `ticket_status`
--

CREATE TABLE `ticket_status` (
  `statusID` int(11) NOT NULL,
  `ticketID` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `latest_update_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ticket_status`
--

INSERT INTO `ticket_status` (`statusID`, `ticketID`, `status`, `latest_update_date`) VALUES
(1, 1, 'pending', '2023-05-10 09:43:42'),
(2, 2, 'accepted', '2023-05-13 09:17:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_data`
--

CREATE TABLE `user_data` (
  `userID` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `phone` varchar(20) NOT NULL DEFAULT 'undefined',
  `created_by_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_data`
--

INSERT INTO `user_data` (`userID`, `username`, `email`, `password`, `phone`, `created_by_date`, `role`) VALUES
(1, 'nid', 'nid@gmail.com', '$2b$12$tcYTQBODC/2EbKAslmrKFeGpCoqwrhI4qMNgcimUn0qwGQ0WC9RyS', '', '2023-05-10 06:41:49', 'admin'),
(2, 'captain', 'captainrockp1@gmail.com', '$2b$12$dDXXDoZyhhzTr6q5GA0TAuKKMb/LJ/UA0Lij.iZMomQ1.yXE/ohTS', '', '2023-05-10 06:46:15', 'admin'),
(3, 'soda', 'soda@gmail.com', '$2b$12$VLXVtzkwzJws9QL3ayd6ceDNlBSreGqLHyFDkIbDIPFdhyNiUPnIq', '087-531-4585', '2023-05-10 10:23:30', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ticket_data`
--
ALTER TABLE `ticket_data`
  ADD PRIMARY KEY (`ticketID`),
  ADD KEY `contactID` (`contactID`);

--
-- Indexes for table `ticket_status`
--
ALTER TABLE `ticket_status`
  ADD PRIMARY KEY (`statusID`),
  ADD KEY `ticketID` (`ticketID`);

--
-- Indexes for table `user_data`
--
ALTER TABLE `user_data`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ticket_data`
--
ALTER TABLE `ticket_data`
  MODIFY `ticketID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ticket_status`
--
ALTER TABLE `ticket_status`
  MODIFY `statusID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_data`
--
ALTER TABLE `user_data`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ticket_data`
--
ALTER TABLE `ticket_data`
  ADD CONSTRAINT `ticket_data_ibfk_1` FOREIGN KEY (`contactID`) REFERENCES `user_data` (`userID`);

--
-- Constraints for table `ticket_status`
--
ALTER TABLE `ticket_status`
  ADD CONSTRAINT `ticket_status_ibfk_1` FOREIGN KEY (`ticketID`) REFERENCES `ticket_data` (`ticketID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
