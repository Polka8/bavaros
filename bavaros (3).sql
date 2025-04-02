-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Creato il: Apr 01, 2025 alle 23:52
-- Versione del server: 8.4.4
-- Versione PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bavaros`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `dettagli_prenotazione`
--

CREATE TABLE `dettagli_prenotazione` (
  `id_dettaglio` int NOT NULL,
  `fk_prenotazione` int NOT NULL,
  `fk_piatto` int NOT NULL,
  `quantita` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `dettagli_prenotazione`
--

INSERT INTO `dettagli_prenotazione` (`id_dettaglio`, `fk_prenotazione`, `fk_piatto`, `quantita`) VALUES
(16, 7, 3, 1),
(17, 7, 2, 1),
(18, 9, 3, 2),
(19, 9, 2, 3),
(20, 10, 3, 2),
(21, 10, 4, 1),
(22, 10, 2, 1),
(23, 14, 3, 1),
(24, 14, 1, 1),
(25, 14, 4, 1),
(26, 14, 2, 1),
(27, 15, 3, 1),
(28, 15, 1, 1),
(29, 15, 4, 1),
(30, 15, 2, 1),
(31, 17, 1, 2),
(32, 17, 4, 1),
(33, 17, 2, 1),
(34, 18, 3, 1),
(35, 18, 1, 1),
(36, 18, 4, 1),
(37, 18, 2, 1),
(38, 20, 1, 1),
(39, 20, 2, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `menu`
--

CREATE TABLE `menu` (
  `id_menu` int NOT NULL,
  `titolo` varchar(255) NOT NULL,
  `is_pubblico` tinyint(1) NOT NULL DEFAULT '1',
  `data_creazione` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `menu`
--

INSERT INTO `menu` (`id_menu`, `titolo`, `is_pubblico`, `data_creazione`) VALUES
(16, 'Menù bergamo', 1, '2025-03-22 13:11:02'),
(19, 'menù  modificato', 1, '2025-03-28 13:02:06'),
(21, 'Menù mare', 1, '2025-04-01 23:34:07');

-- --------------------------------------------------------

--
-- Struttura della tabella `menu_item`
--

CREATE TABLE `menu_item` (
  `id_item` int NOT NULL,
  `id_menu_sezione` int NOT NULL,
  `id_piatto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `menu_item`
--

INSERT INTO `menu_item` (`id_item`, `id_menu_sezione`, `id_piatto`) VALUES
(49, 61, 3),
(50, 62, 1),
(51, 63, 4),
(52, 64, 2),
(60, 74, 1),
(61, 75, 4),
(62, 76, 2),
(63, 82, 5),
(64, 83, 6);

-- --------------------------------------------------------

--
-- Struttura della tabella `menu_sezione`
--

CREATE TABLE `menu_sezione` (
  `id_sezione` int NOT NULL,
  `nome_sezione` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `menu_sezione`
--

INSERT INTO `menu_sezione` (`id_sezione`, `nome_sezione`) VALUES
(1, 'Antipasto'),
(2, 'Primo'),
(3, 'Secondo'),
(4, 'Dolce');

-- --------------------------------------------------------

--
-- Struttura della tabella `menu_sezione_rel`
--

CREATE TABLE `menu_sezione_rel` (
  `id_menu_sezione` int NOT NULL,
  `id_menu` int NOT NULL,
  `id_sezione` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `menu_sezione_rel`
--

INSERT INTO `menu_sezione_rel` (`id_menu_sezione`, `id_menu`, `id_sezione`) VALUES
(61, 16, 1),
(62, 16, 2),
(63, 16, 3),
(64, 16, 4),
(73, 19, 1),
(74, 19, 2),
(75, 19, 3),
(76, 19, 4),
(81, 21, 1),
(82, 21, 2),
(83, 21, 3),
(84, 21, 4);

-- --------------------------------------------------------

--
-- Struttura della tabella `notifica`
--

CREATE TABLE `notifica` (
  `id_notifica` int NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `messaggio` text NOT NULL,
  `data_notifica` datetime DEFAULT NULL,
  `letto` tinyint(1) DEFAULT NULL,
  `id_prenotazione` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `notifica`
--

INSERT INTO `notifica` (`id_notifica`, `tipo`, `messaggio`, `data_notifica`, `letto`, `id_prenotazione`) VALUES
(1, 'nuova_prenotazione', 'Nuova prenotazione da 7 per 2025-03-28T02:59', '2025-03-24 21:59:26', 1, 8),
(2, 'annullamento', 'Prenotazione di Gamba Squalo per il 2025-04-04 23:08:00 annullata', '2025-03-24 22:51:41', 1, 9),
(3, 'nuova_prenotazione_con_menu', 'Nuova prenotazione con menù da Gamba Squalo per 7 posti il 2025-05-13 02:56:00. Piatti: tagliere di salumi, tagliata di manzo con patate, cheesecake ai frutti di bosco', '2025-03-24 22:52:20', 1, 10),
(4, 'nuova_prenotazione', 'Nuova prenotazione da Gamba Squalo per 5 posti il 2025-04-05 02:01:00', '2025-03-24 22:58:31', 1, 11),
(5, 'annullamento', 'Prenotazione di Gamba Squalo per il 2025-03-28 02:59:00 annullata', '2025-03-24 22:58:40', 1, 8),
(6, 'nuova_prenotazione', 'Nuova prenotazione da Gamba Squalo per 4 posti il 2025-03-30 04:25:00', '2025-03-24 23:20:36', 1, 12),
(7, 'nuova_prenotazione', 'Nuova prenotazione da Roberto Parco per 4 posti il 2025-03-30 17:58:00', '2025-03-28 12:58:43', 1, 13),
(8, 'nuova_prenotazione_con_menu', 'Nuova prenotazione con menù da Gamba Squalo per 2 posti il 2025-04-02 15:57:00. Piatti: tagliere di salumi, Casoncelli, tagliata di manzo con patate, cheesecake ai frutti di bosco', '2025-03-30 21:53:30', 1, 14),
(9, 'nuova_prenotazione_con_menu', 'Nuova prenotazione con menù da Roberto Parco per 1 posti il 2025-04-18 02:57:00. Piatti: tagliere di salumi, Casoncelli, tagliata di manzo con patate, cheesecake ai frutti di bosco', '2025-03-30 21:57:54', 1, 15),
(10, 'nuova_prenotazione', 'Nuova prenotazione da Gamba Squalo per 1 posti il 2025-04-25 03:03:00', '2025-03-30 21:59:41', 0, 16),
(11, 'nuova_prenotazione_con_menu', 'Nuova prenotazione con menù da Gamba Squalo per 2 posti il 2025-05-01 00:08:00. Piatti: Casoncelli, tagliata di manzo con patate, cheesecake ai frutti di bosco', '2025-03-30 22:08:20', 0, 17),
(12, 'nuova_prenotazione_con_menu', 'Nuova prenotazione con menù da Luca Alberghi per 2 posti il 2025-05-01 21:57:00. Piatti: tagliere di salumi, Casoncelli, tagliata di manzo con patate, cheesecake ai frutti di bosco', '2025-04-01 16:54:23', 0, 18),
(13, 'nuova_prenotazione', 'Nuova prenotazione da Gamba Squalo per 1 posti il 2025-05-01 22:54:00', '2025-04-01 16:54:50', 0, 19),
(14, 'nuova_prenotazione_con_menu', 'Nuova prenotazione con menù da Roberto Parco per 1 posti il 2025-05-01 19:00:00. Piatti: Casoncelli, cheesecake ai frutti di bosco', '2025-04-01 16:55:32', 0, 20),
(15, 'annullamento', 'Prenotazione di Roberto Parco per il 2025-05-01 19:00:00 annullata', '2025-04-01 18:50:26', 0, 20);

-- --------------------------------------------------------

--
-- Struttura della tabella `piatto`
--

CREATE TABLE `piatto` (
  `id_piatto` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `prezzo` float NOT NULL,
  `descrizione` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `piatto`
--

INSERT INTO `piatto` (`id_piatto`, `nome`, `prezzo`, `descrizione`) VALUES
(1, 'Casoncelli', 4, 'casoncellli con pasta all\'uovo,burro e salvia'),
(2, 'cheesecake ai frutti di bosco', 3, 'cheesecake a base di marmellata di ribes e fragole con frutti a parte.Può contenere tracce di allergeni e arachidi'),
(3, 'tagliere di salumi', 2, 'tagliere di fette di salame piccante,salame ungherese,prosciutto cotto e crudo,mortadella e porchetta'),
(4, 'tagliata di manzo con patate', 5, 'tagliata di carne di manzo al sangue con patate cotte al forno'),
(5, 'spaghetto frutti di mare', 7, 'spaghetti trafilati al bronzo con cozze,vongole e gamberi sgusciati.Può contenere crostacei'),
(6, 'Fritto misto', 5, 'frittura di riso,mais e pane a base di calamari,gamberetti,baccalà e polpi');

-- --------------------------------------------------------

--
-- Struttura della tabella `prenotazione`
--

CREATE TABLE `prenotazione` (
  `id_prenotazione` int NOT NULL,
  `data_prenotata` datetime NOT NULL,
  `stato` varchar(50) NOT NULL,
  `id_utente` int NOT NULL,
  `data_annullamento` datetime DEFAULT NULL,
  `data_creazione` datetime NOT NULL,
  `note_aggiuntive` text,
  `numero_posti` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `prenotazione`
--

INSERT INTO `prenotazione` (`id_prenotazione`, `data_prenotata`, `stato`, `id_utente`, `data_annullamento`, `data_creazione`, `note_aggiuntive`, `numero_posti`) VALUES
(7, '2025-03-30 18:23:00', 'annullata', 7, '2025-03-22 17:23:40', '2025-03-22 17:23:16', '', 1),
(8, '2025-03-28 02:59:00', 'annullata', 7, '2025-03-24 22:58:40', '2025-03-24 21:59:26', '', 1),
(9, '2025-04-04 23:08:00', 'annullata', 7, '2025-03-24 22:51:41', '2025-03-24 22:08:53', '', 6),
(10, '2025-05-13 02:56:00', 'attiva', 7, NULL, '2025-03-24 22:52:20', '', 7),
(11, '2025-04-05 02:01:00', 'attiva', 7, NULL, '2025-03-24 22:58:31', 'porto anche il cane', 5),
(12, '2025-03-30 04:25:00', 'attiva', 7, NULL, '2025-03-24 23:20:36', 'Porto anche il cane', 4),
(13, '2025-03-30 17:58:00', 'attiva', 8, NULL, '2025-03-28 12:58:43', 'C\'è anche il cane', 4),
(14, '2025-04-02 15:57:00', 'attiva', 7, NULL, '2025-03-30 21:53:29', 'puppa', 2),
(15, '2025-04-18 02:57:00', 'attiva', 8, NULL, '2025-03-30 21:57:54', '', 1),
(16, '2025-04-25 03:03:00', 'attiva', 7, NULL, '2025-03-30 21:59:41', 'provo', 1),
(17, '2025-05-01 00:08:00', 'attiva', 7, NULL, '2025-03-30 22:08:20', '', 2),
(18, '2025-05-01 21:57:00', 'attiva', 9, NULL, '2025-04-01 16:54:23', '', 2),
(19, '2025-05-01 22:54:00', 'attiva', 7, NULL, '2025-04-01 16:54:50', '', 1),
(20, '2025-05-01 19:00:00', 'annullata', 8, '2025-04-01 18:50:26', '2025-04-01 16:55:32', 'c\'è salvini', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `id_utente` int NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `psw` varchar(200) NOT NULL,
  `ruolo` enum('admin','cliente') NOT NULL,
  `creato_il` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`id_utente`, `nome`, `cognome`, `email`, `psw`, `ruolo`, `creato_il`) VALUES
(2, 'Gabriel', 'Cuter', 'Gabrielcuter27@gmail.com', 'scrypt:32768:8:1$47PI5tq7W99JmTGK$d7810e95e8c31e840d6da308e5786bd65d8a1141c7fe8b152d593a2ac4361347d0a3d689178aafb8cb79ae91f8284f9873285c4194386a999ed1d3ce61e05e7a', 'admin', '2025-03-19 20:06:02'),
(7, 'Gamba', 'Squalo', 'prova@gmail.com', 'scrypt:32768:8:1$8O20nRwrF6a210jw$206212c43d6e47e690b0fbea415a12bfc8b0add4a1871eb4506d1896dff693d8ef2aa25e5c3ef46fe64eab4a9f09ad6ad44fe3831e928d6c28e28d9613981a73', 'cliente', '2025-03-21 21:41:41'),
(8, 'Roberto', 'Parco', 'Parco@gmail.com', 'scrypt:32768:8:1$tFaTRgTQSEm72j9j$0cf1175221b4b9ab9f85cd8ecb9142b570bffec2ad70fcdd2c993d61b59c650198afa6d698e73c37f30d5784b4630c10fe4bdb319169e745e30293585214ae2f', 'cliente', '2025-03-28 12:57:42'),
(9, 'Luca', 'Alberghi', 'Luca@gmail.com', 'scrypt:32768:8:1$4DxbIKiXOXPcBmOL$626ef265d6901114f7176f02526b8c2a04d211c9a21d6e00ef6843f18ac81477beb819f3fa1c80710cdbfe90ad751aafbf628332abc370546d4ea832756376be', 'cliente', '2025-04-01 16:53:11');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `dettagli_prenotazione`
--
ALTER TABLE `dettagli_prenotazione`
  ADD PRIMARY KEY (`id_dettaglio`),
  ADD KEY `fk_prenotazione` (`fk_prenotazione`),
  ADD KEY `fk_piatto` (`fk_piatto`);

--
-- Indici per le tabelle `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indici per le tabelle `menu_item`
--
ALTER TABLE `menu_item`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_menu_sezione` (`id_menu_sezione`),
  ADD KEY `id_piatto` (`id_piatto`);

--
-- Indici per le tabelle `menu_sezione`
--
ALTER TABLE `menu_sezione`
  ADD PRIMARY KEY (`id_sezione`);

--
-- Indici per le tabelle `menu_sezione_rel`
--
ALTER TABLE `menu_sezione_rel`
  ADD PRIMARY KEY (`id_menu_sezione`),
  ADD KEY `id_menu` (`id_menu`),
  ADD KEY `id_sezione` (`id_sezione`);

--
-- Indici per le tabelle `notifica`
--
ALTER TABLE `notifica`
  ADD PRIMARY KEY (`id_notifica`),
  ADD KEY `id_prenotazione` (`id_prenotazione`);

--
-- Indici per le tabelle `piatto`
--
ALTER TABLE `piatto`
  ADD PRIMARY KEY (`id_piatto`);

--
-- Indici per le tabelle `prenotazione`
--
ALTER TABLE `prenotazione`
  ADD PRIMARY KEY (`id_prenotazione`),
  ADD KEY `id_utente` (`id_utente`);

--
-- Indici per le tabelle `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`id_utente`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `dettagli_prenotazione`
--
ALTER TABLE `dettagli_prenotazione`
  MODIFY `id_dettaglio` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT per la tabella `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT per la tabella `menu_item`
--
ALTER TABLE `menu_item`
  MODIFY `id_item` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT per la tabella `menu_sezione`
--
ALTER TABLE `menu_sezione`
  MODIFY `id_sezione` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `menu_sezione_rel`
--
ALTER TABLE `menu_sezione_rel`
  MODIFY `id_menu_sezione` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT per la tabella `notifica`
--
ALTER TABLE `notifica`
  MODIFY `id_notifica` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT per la tabella `piatto`
--
ALTER TABLE `piatto`
  MODIFY `id_piatto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `prenotazione`
--
ALTER TABLE `prenotazione`
  MODIFY `id_prenotazione` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `id_utente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `dettagli_prenotazione`
--
ALTER TABLE `dettagli_prenotazione`
  ADD CONSTRAINT `dettagli_prenotazione_ibfk_1` FOREIGN KEY (`fk_prenotazione`) REFERENCES `prenotazione` (`id_prenotazione`),
  ADD CONSTRAINT `dettagli_prenotazione_ibfk_2` FOREIGN KEY (`fk_piatto`) REFERENCES `piatto` (`id_piatto`);

--
-- Limiti per la tabella `menu_item`
--
ALTER TABLE `menu_item`
  ADD CONSTRAINT `menu_item_ibfk_1` FOREIGN KEY (`id_menu_sezione`) REFERENCES `menu_sezione_rel` (`id_menu_sezione`),
  ADD CONSTRAINT `menu_item_ibfk_2` FOREIGN KEY (`id_piatto`) REFERENCES `piatto` (`id_piatto`);

--
-- Limiti per la tabella `menu_sezione_rel`
--
ALTER TABLE `menu_sezione_rel`
  ADD CONSTRAINT `menu_sezione_rel_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`),
  ADD CONSTRAINT `menu_sezione_rel_ibfk_2` FOREIGN KEY (`id_sezione`) REFERENCES `menu_sezione` (`id_sezione`);

--
-- Limiti per la tabella `notifica`
--
ALTER TABLE `notifica`
  ADD CONSTRAINT `notifica_ibfk_1` FOREIGN KEY (`id_prenotazione`) REFERENCES `prenotazione` (`id_prenotazione`);

--
-- Limiti per la tabella `prenotazione`
--
ALTER TABLE `prenotazione`
  ADD CONSTRAINT `prenotazione_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
