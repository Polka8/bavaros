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

📁 Struttura del progetto
/bavaros
├── frontend/
│   └── src/app/
│       ├── admin/
│       │   ├── calendario/
│       │   ├── gestione-menu/
│       │   └── newsletter/
│       ├── auth/
│       │   ├── login/
│       │   └── register/
│       ├── core/
│       │   ├── footer/
│       │   ├── navbar/
│       │   └── not-found/
│       ├── environment/
│       ├── features/
│       │   └── dashboard/
│       ├── home/
│       ├── prenotazioni/
│       │   ├── prenotazioni-con-menu/
│       │   ├── prenotazioni-solo/
│       │   ├── prenota/
│       │   └── storico/
│       ├── profilo/
│       └── shared/
│           ├── interceptors/
│           ├── guards/
│           └── services/
│   ├── app.routes.ts
│   ├── app.component.ts|html|scss
│   └── app.config.ts
│
└── backend/
    ├── routes.py
    ├── models.py
    ├── run.py
    └── __init__.py
▶️ Esecuzione locale con Docker
1. Clona il progetto
git clone https://github.com/tuo-utente/bavaros.git
cd bavaros
2. Avvia i container
bash
Copia
Modifica
docker-compose up --build
L'applicazione sarà disponibile su http://localhost:4200.

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
