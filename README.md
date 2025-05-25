🍽️ Bavaros - Gestione Ristorante (Fullstack Web App)
Bavaros è una potente web app fullstack per la gestione moderna di un ristorante, sviluppata con Angular per il frontend e Python per il backend. Offre un sistema completo per la prenotazione, la gestione dei menù e il monitoraggio tramite calendario, con funzionalità differenziate per clienti e amministratori.

✅ 100% Docker Ready – Setup semplice e deploy immediato.

🚀 Features principali
👤 Cliente
✅ Login e registrazione

📆 Prenotazione tavolo con o senza menù

🗂️ Storico prenotazioni con possibilità di annullare quelle attive

👑 Admin
📅 Calendario interattivo delle prenotazioni (giorno, settimana, mese)

⛔ Blocco/sblocco di giorni specifici

🧾 Newsletter degli annullamenti ricevuti

🧑‍🍳 Modifica completa del menù tramite drag & drop

🌍 Homepage

Recensioni, anteprima del menù e invito alla prenotazione

Routing automatico al login per azioni protette

Navbar dinamica con icone per login/profilo

⚙️ Tecnologie utilizzate

Area	Stack
Frontend	Angular 17+, SCSS
Backend	Python (Flask o FastAPI)
Database	(PHPMyAdmin)
Container	Docker, Docker Compose

🔧 Configurazione ambiente

Il progetto utilizza variabili d’ambiente per configurare le connessioni e la password del database.

Crea un file .env nella cartella frontend/ con il seguente contenuto:
env
MYSQL_ROOT_PASSWORD=password123(o quella che preferisci)
Non committare il file .env su GitHub: è già ignorato tramite .gitignore.
Se vuoi collaborare con altri, condividi solo il file .env.example.

Il file .env.example fornisce un modello da cui partire.

▶️ Avvio del progetto

Assicurati di avere Docker e Docker Compose installati.
git clone https://github.com/tuo-utente/bavaros.git
cd bavaros
cp frontend/.env.example frontend/.env  # crea il file di configurazione
docker-compose up --build
Il progetto sarà disponibile su:

Frontend: http://localhost:4200

Backend API (Flask): http://localhost:3000

phpMyAdmin: http://localhost:3307

Username: root

Password: quella specificata nel file .env

⚠️ Sicurezza

Il file .env contiene credenziali e configurazioni sensibili. Non deve mai essere incluso nel repository.
Usa .env.example per condividere le variabili richieste senza rivelare valori reali.

✅ TODO (Future Improvements)

 Integrazione pagamenti online

 Notifiche email per conferme/annullamenti

 Supporto multi-lingua

 Upload immagini menù

🤝 Contribuire

Hai idee o miglioramenti? Apri una Issue o una Pull Request!
Il contributo della community è benvenuto ❤️

📜 Licenza

Questo progetto è distribuito con licenza MIT. Vedi il file LICENSE per maggiori dettagli.
