-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Creato il: Mar 19, 2025 alle 20:36
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

-- --------------------------------------------------------

--
-- Struttura della tabella `menu`
--

CREATE TABLE `menu` (
  `id_menu` int NOT NULL,
  `titolo` varchar(255) NOT NULL,
  `data_creazione` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `menu_item`
--

CREATE TABLE `menu_item` (
  `id_item` int NOT NULL,
  `id_menu_sezione` int NOT NULL,
  `id_piatto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `menu_sezione`
--

CREATE TABLE `menu_sezione` (
  `id_sezione` int NOT NULL,
  `nome_sezione` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `menu_sezione_rel`
--

CREATE TABLE `menu_sezione_rel` (
  `id_menu_sezione` int NOT NULL,
  `id_menu` int NOT NULL,
  `id_sezione` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(4, 'tagliata di manzo con patate', 5, 'tagliata di carne di manzo al sangue con patate cotte al forno');

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
(4, 'Gab', 'c', 'Mamba@gmail.com', 'scrypt:32768:8:1$IMIuYqCSKD64oJRj$999c27c3edd08d28315840f941df279c065ac9728d6287e68fc70f811270dcdcb2f5ce2680bf28813cc12c2e81e02ca9a519e60b4aade1c22d62206a10da1cfd', 'cliente', '2025-03-19 20:10:18');

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
  MODIFY `id_dettaglio` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `menu_item`
--
ALTER TABLE `menu_item`
  MODIFY `id_item` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `menu_sezione`
--
ALTER TABLE `menu_sezione`
  MODIFY `id_sezione` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `menu_sezione_rel`
--
ALTER TABLE `menu_sezione_rel`
  MODIFY `id_menu_sezione` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `piatto`
--
ALTER TABLE `piatto`
  MODIFY `id_piatto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `prenotazione`
--
ALTER TABLE `prenotazione`
  MODIFY `id_prenotazione` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `id_utente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- Limiti per la tabella `prenotazione`
--
ALTER TABLE `prenotazione`
  ADD CONSTRAINT `prenotazione_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
