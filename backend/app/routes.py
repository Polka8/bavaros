from flask import jsonify, request
from .models import Notifica, db, User, RuoloEnum, Prenotazione, DettagliPrenotazione, Piatto, Menu, MenuSezione, MenuSezioneRel, MenuItem
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
import os
import re
import json

def init_routes(app):

    @ app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Dati mancanti"}), 400

        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_pattern, data['email']):
            return jsonify({"message": "Formato email non valido"}), 400

        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"message": "Attenzione, utente già registrato"}), 409

        try:
            new_user = User(
                email=data['email'],
                nome=data.get('nome', ''),
                cognome=data.get('cognome', ''),
                ruolo=RuoloEnum.cliente
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()

            # Correggi qui: usa new_user.id
            access_token = create_access_token(identity=str(new_user.id), expires_delta=timedelta(days=1))
            return jsonify({
                "message": "Registrazione completata",
                "token": access_token,
                "user": {
                    "id": new_user.id,
                    "nome": new_user.nome,
                    "cognome": new_user.cognome,
                    "email": new_user.email,
                    "ruolo": new_user.ruolo.value,
                    "creato_il": new_user.creato_il.isoformat()
                }
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore server: {str(e)}"}), 500


    @ app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Dati mancanti"}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"message": "Utente non trovato"}), 404

        if not user.check_password(data['password']):
            return jsonify({"message": "Password errata"}), 401

        # Imposta le credenziali admin dai parametri d'ambiente o di default
        admin_email = os.getenv('ADMIN_EMAIL', 'Gabrielcuter27@gmail.com')
        admin_password = os.getenv('ADMIN_PASSWORD', 'Gabicu27')

        print("Admin email:", admin_email)
        print("Admin password:", admin_password)
        print("Input email:", data['email'])
        print("Input password:", data['password'])

        if data['email'] == admin_email and data['password'] == admin_password:
            user.ruolo = RuoloEnum.admin
            print("Ruolo impostato a admin")
        else:
            user.ruolo = RuoloEnum.cliente
            print("Ruolo impostato a cliente")

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore di aggiornamento ruolo: {str(e)}"}), 500

        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=1))
        return jsonify({
            "message": "Login riuscito",
            "token": access_token,
            "user": {
                "id": user.id,
                "nome": user.nome,
                "cognome": user.cognome,
                "ruolo": user.ruolo.value,
                "email": user.email,
                "creato_il": user.creato_il.isoformat()
            }
        }), 200


    @app.route('/api/profilo', methods=['GET'])
    @jwt_required()
    def get_profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Utente non trovato"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "nome": user.nome,
            "cognome": user.cognome,
            "ruolo": user.ruolo.value,
            "creato_il": user.creato_il.isoformat()
        }), 200

    # --- Endpoint per prenotazioni ---

    # Endpoint per prenotazioni "solo posti"
    @app.route('/api/prenotazioni', methods=['POST'])
    @jwt_required()
    def crea_prenotazione():
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            data = request.get_json()
            if not data:
                return jsonify({"message": "Nessun dato inviato"}), 400
            # Validazione data
            try:
                data_prenotata = datetime.fromisoformat(data['data_prenotata'])
                if data_prenotata.date() < datetime.utcnow().date():
                    return jsonify({"message": "La data prenotata non può essere antecedente ad oggi"}), 400
            except Exception:
                return jsonify({"message": "Formato data non valido"}), 400
            # Validazione numero di posti
            try:
                num_posti = int(data.get('numero_posti', 0))
                if num_posti < 1:
                    return jsonify({"message": "Il numero di posti deve essere almeno 1"}), 400
            except Exception:
                return jsonify({"message": "Numero di posti non valido"}), 400

            try:
                nuova_prenotazione = Prenotazione(
                    data_prenotata=data_prenotata,
                    stato="attiva",
                    id_utente=user_id,
                    data_creazione=datetime.utcnow(),
                    note_aggiuntive=data.get('note_aggiuntive', ''),
                    numero_posti=num_posti
                )
                db.session.add(nuova_prenotazione)
                db.session.commit()
                notifica = Notifica(
                    tipo="nuova_prenotazione",
                    messaggio=f"Nuova prenotazione da {user.nome} {user.cognome} per {num_posti} posti il {data_prenotata}",
                    id_prenotazione=nuova_prenotazione.id_prenotazione
                )
                db.session.add(notifica)
                db.session.commit()
                return jsonify({
                    "message": "Prenotazione creata con successo",
                    "prenotazione_id": nuova_prenotazione.id_prenotazione
                }), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({"message": f"Errore server: {str(e)}"}), 500

    @app.route('/api/prenotazioni/menu', methods=['POST'])
    @jwt_required()
    def crea_prenotazione_con_menu():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()
        
        if not data:
            return jsonify({"message": "Nessun dato inviato"}), 400
        
        # Validazione data
        try:
            data_prenotata = datetime.fromisoformat(data['data_prenotata'])
            if data_prenotata.date() < datetime.utcnow().date():
                return jsonify({"message": "La data prenotata non può essere antecedente ad oggi"}), 400
        except Exception:
            return jsonify({"message": "Formato data non valido"}), 400
        
        # Validazione numero di posti
        try:
            num_posti = int(data.get('numero_posti', 0))
            if num_posti < 1:
                return jsonify({"message": "Il numero di posti deve essere almeno 1"}), 400
        except Exception:
            return jsonify({"message": "Numero di posti non valido"}), 400
        
        # Validazione piatti
        if 'piatti' not in data or not isinstance(data['piatti'], list) or len(data['piatti']) == 0:
            return jsonify({"message": "Nessun piatto selezionato"}), 400
        
        for item in data['piatti']:
            try:
                if int(item.get('quantita', 0)) < 1:
                    return jsonify({"message": "La quantità per ogni piatto deve essere almeno 1"}), 400
            except Exception:
                return jsonify({"message": "Quantità non valida per un piatto"}), 400
        
        # Creazione prenotazione e dettagli
        try:
            prenotazione = Prenotazione(
                data_prenotata=data_prenotata,
                stato="attiva",
                id_utente=user_id,
                data_creazione=datetime.utcnow(),
                note_aggiuntive=data.get('note_aggiuntive', ''),
                numero_posti=num_posti
            )
            db.session.add(prenotazione)
            db.session.flush()  # Ottieni l'id_prenotazione
            
            # Aggiungi dettagli piatti
            for item in data['piatti']:
                dettaglio = DettagliPrenotazione(
                    fk_prenotazione=prenotazione.id_prenotazione,
                    fk_piatto=item['fk_piatto'],
                    quantita=int(item['quantita'])
                )
                db.session.add(dettaglio)
            
            # Crea notifica
            piatti_nomi = [Piatto.query.get(item['fk_piatto']).nome for item in data['piatti']]
            notifica = Notifica(
                tipo="nuova_prenotazione_con_menu",
                messaggio=f"Nuova prenotazione con menù da {user.nome} {user.cognome} per {num_posti} posti il {data_prenotata}. Piatti: {', '.join(piatti_nomi)}",
                id_prenotazione=prenotazione.id_prenotazione
            )
            db.session.add(notifica)
            db.session.commit()
            
            return jsonify({
                "message": "Prenotazione con menu creata con successo",
                "prenotazione_id": prenotazione.id_prenotazione
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore server: {str(e)}"}), 500



    @app.route('/api/prenotazioni/storico/<int:user_id>', methods=['GET'])
    @jwt_required()
    def storico_prenotazioni(user_id):
        prenotazioni = Prenotazione.query.filter_by(id_utente=user_id).all()
        prenotazioni_data = []
        for p in prenotazioni:
            prenotazioni_data.append({
                "id_prenotazione": p.id_prenotazione,
                "data_prenotata": p.data_prenotata.isoformat(),
                "stato": p.stato,
                "data_creazione": p.data_creazione.isoformat(),
                "numero_posti": p.numero_posti,
                "note_aggiuntive": p.note_aggiuntive
            })
        return jsonify(prenotazioni_data), 200

    @app.route('/api/prenotazioni/calendario', methods=['GET'])
    @jwt_required()
    def get_prenotazioni_calendario():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.ruolo != RuoloEnum.admin:
            return jsonify({"message": "Accesso negato"}), 403

        # Recupera i parametri di filtro
        anno = request.args.get('anno', type=int)
        mese = request.args.get('mese', type=int)
        giorno = request.args.get('giorno', type=int)
        stato = request.args.get('stato', 'attiva')  # ✅ Filtra per stato attivo

        # Costruisci la query
        query = Prenotazione.query.filter_by(stato=stato)  # ✅ Aggiungi filtro per stato

        # Applica filtri per data se presenti
        if anno and mese and giorno:
            data_inizio = datetime(anno, mese, giorno)
            data_fine = data_inizio + timedelta(days=7)
            query = query.filter(Prenotazione.data_prenotata.between(data_inizio, data_fine))
        elif anno and mese:
            query = query.filter(
                db.extract('year', Prenotazione.data_prenotata) == anno,
                db.extract('month', Prenotazione.data_prenotata) == mese
            )

        prenotazioni = query.all()
        result = []
        for p in prenotazioni:
            utente = User.query.get(p.id_utente)
            result.append({
                "id": p.id_prenotazione,
                "data": p.data_prenotata.isoformat(),
                "utente": f"{utente.nome} {utente.cognome}",
                "numero_posti": p.numero_posti,
                "stato": p.stato,
                "note": p.note_aggiuntive
            })
        return jsonify(result), 200

    # Ottieni la lista dei piatti disponibili (usato per il menù)
    @app.route('/api/menu', methods=['GET'])
    def get_piatti():
        piatti = Piatto.query.all()
        piatti_data = [{
            "id_piatto": p.id_piatto,
            "nome": p.nome,
            "prezzo": p.prezzo,
            "descrizione": p.descrizione
        } for p in piatti]
        return jsonify(piatti_data), 200

    # Salva un nuovo menù (solo admin)
    @app.route('/api/menu', methods=['POST'])
    @jwt_required()
    def save_menu():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.ruolo != RuoloEnum.admin:
            return jsonify({"message": "Accesso negato"}), 403
        data = request.get_json()
        if not data or 'titolo' not in data or 'sezioni' not in data:
            return jsonify({"message": "Dati mancanti per il menù"}), 400
        try:
            nuovo_menu = Menu(titolo=data['titolo'])
            db.session.add(nuovo_menu)
            db.session.flush()  # Per ottenere nuovo_menu.id_menu

            sezioni_data = data['sezioni']  # Es. {"Antipasto": [{"id_piatto": 1}], ...}
            for nome_sezione, items in sezioni_data.items():
                # Trova o crea la sezione
                sezione = MenuSezione.query.filter_by(nome_sezione=nome_sezione).first()
                if not sezione:
                    sezione = MenuSezione(nome_sezione=nome_sezione)
                    db.session.add(sezione)
                    db.session.flush()

                # Crea la relazione
                rel = MenuSezioneRel(id_menu=nuovo_menu.id_menu, id_sezione=sezione.id_sezione)
                db.session.add(rel)
                db.session.flush()

                # Aggiungi gli item
                for item in items:
                    mi = MenuItem(id_menu_sezione=rel.id_menu_sezione, id_piatto=item['id_piatto'])
                    db.session.add(mi)

            db.session.commit()
            return jsonify({
                "message": "Menù salvato",
                "menu": {
                    "id_menu": nuovo_menu.id_menu,
                    "titolo": nuovo_menu.titolo,
                    "data_creazione": nuovo_menu.data_creazione.isoformat()
                }
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore nel salvataggio del menù: {str(e)}"}), 500

    # Ottieni tutti i menù salvati
    @app.route('/api/menu/saved', methods=['GET'])
    @jwt_required()
    def get_saved_menus():
        try:
            menus = Menu.query.all()
            result = []
            for m in menus:
                sezioni_list = []
                for rel in m.sezioni:
                    sezione_obj = MenuSezione.query.get(rel.id_sezione)
                    items = []
                    for mi in rel.items:
                        piatto = Piatto.query.get(mi.id_piatto)
                        items.append({
                            "id_piatto": piatto.id_piatto,
                            "nome": piatto.nome,
                            "prezzo": piatto.prezzo,
                            "descrizione": piatto.descrizione
                        })
                    sezioni_list.append({
                        "nome_sezione": sezione_obj.nome_sezione,
                        "piatti": items
                    })
                result.append({
                    "id_menu": m.id_menu,
                    "titolo": m.titolo,
                    "data_creazione": m.data_creazione.isoformat(),
                    "sezioni": sezioni_list
                })
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"message": f"Errore nel recupero dei menù: {str(e)}"}), 500
    @app.route('/api/menu/<int:menu_id>', methods=['PUT'])
    @jwt_required()
    def update_menu(menu_id):
            # Verifica che l'utente sia admin
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.ruolo != RuoloEnum.admin:
                return jsonify({"message": "Accesso negato"}), 403

            data = request.get_json()
            if not data or 'titolo' not in data or 'sezioni' not in data:
                return jsonify({"message": "Dati mancanti per l'aggiornamento del menù"}), 400

            menu = Menu.query.get(menu_id)
            if not menu:
                return jsonify({"message": "Menù non trovato"}), 404

            try:
                # Aggiorna il titolo
                menu.titolo = data['titolo']
                
                # Per aggiornare le sezioni, eliminiamo quelle esistenti e ricreiamo la relazione
                for rel in menu.sezioni:
                    # Se ci sono item associati, li eliminiamo prima
                    for mi in rel.items:
                        db.session.delete(mi)
                    db.session.delete(rel)
                db.session.flush()

                sezioni_data = data['sezioni']  # Es: {"Antipasto": [ { "id_piatto": 1 }, ... ], ... }
                for nome_sezione, items in sezioni_data.items():
                    # Trova o crea la sezione
                    sezione = MenuSezione.query.filter_by(nome_sezione=nome_sezione).first()
                    if not sezione:
                        sezione = MenuSezione(nome_sezione=nome_sezione)
                        db.session.add(sezione)
                        db.session.flush()
                    # Crea la relazione
                    rel = MenuSezioneRel(id_menu=menu.id_menu, id_sezione=sezione.id_sezione)
                    db.session.add(rel)
                    db.session.flush()
                    # Aggiungi gli item
                    for item in items:
                        mi = MenuItem(id_menu_sezione=rel.id_menu_sezione, id_piatto=item['id_piatto'])
                        db.session.add(mi)

                db.session.commit()
                return jsonify({"message": "Menù aggiornato"}), 200
            except Exception as e:
                db.session.rollback()
                return jsonify({"message": f"Errore nell'aggiornamento del menù: {str(e)}"}), 500
                
    @app.route('/api/menu/<int:menu_id>', methods=['DELETE'])
    @jwt_required()
    def delete_menu(menu_id):
        # Verifica che l'utente sia admin
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.ruolo != RuoloEnum.admin:
            return jsonify({"message": "Accesso negato"}), 403

        menu = Menu.query.get(menu_id)
        if not menu:
            return jsonify({"message": "Menù non trovato"}), 404

        try:
            # Se vuoi, elimina anche tutte le relazioni e gli item associati
            for rel in menu.sezioni:
                for mi in rel.items:
                    db.session.delete(mi)
                db.session.delete(rel)
            db.session.delete(menu)
            db.session.commit()
            return jsonify({"message": "Menù eliminato"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore nell'eliminazione del menù: {str(e)}"}), 500

    @app.route('/api/prenotazioni/<int:prenotazione_id>', methods=['DELETE', 'OPTIONS'])
    @jwt_required()
    def annulla_prenotazione(prenotazione_id):
        if request.method == 'OPTIONS':
            response = jsonify({})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
            response.headers.add('Access-Control-Allow-Methods', 'DELETE, GET, POST, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
            return response, 200

        user_id = int(get_jwt_identity())  # Converti in intero
        prenotazione = Prenotazione.query.get(prenotazione_id)
        user = User.query.get(prenotazione.id_utente)
        if not prenotazione:
            return jsonify({"message": "Prenotazione non trovata"}), 404
        
        # Controllo: il proprietario o admin possono annullare
        if prenotazione.id_utente != user_id and user.ruolo != RuoloEnum.admin:
            return jsonify({"message": "Non autorizzato"}), 403
        
        try:
            prenotazione.stato = "annullata"
            prenotazione.data_annullamento = datetime.utcnow()
            notifica = Notifica(
                tipo="annullamento",
                messaggio=f"Prenotazione di {user.nome} {user.cognome} per il {prenotazione.data_prenotata} annullata",
                id_prenotazione=prenotazione.id_prenotazione
            )
            db.session.add(notifica)
            db.session.commit()
            
            
            response = jsonify({"message": "Prenotazione annullata"})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
            return response, 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Errore: {str(e)}"}), 500
    @app.route('/api/notifiche', methods=['GET', 'OPTIONS'])
    @jwt_required(optional=True)  # Permette OPTIONS senza autenticazione
    def get_notifiche():
        if request.method == 'OPTIONS':
            response = jsonify({})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
            response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
            return response, 200

        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.ruolo != RuoloEnum.admin:
            return jsonify({"message": "Accesso negato"}), 403
        letto = request.args.get('letto', None)
        if letto is not None:
            try:
                letto = letto.lower() == 'true'  # Converte in booleano
            except ValueError:
                return jsonify({"message": "Parametro 'letto' non valido"}), 400

        # Filtra le notifiche in base al parametro 'letto'
        query = Notifica.query.order_by(Notifica.data_notifica.desc())
        if letto is not None:
         query = query.filter_by(letto=letto)

        notifiche = query.all()
        notifiche_data = []
        for n in notifiche:
            prenotazione = Prenotazione.query.get(n.id_prenotazione)
            utente = User.query.get(prenotazione.id_utente) if prenotazione else None
            dettagli = DettagliPrenotazione.query.filter_by(fk_prenotazione=n.id_prenotazione).all() if prenotazione else []

            notifiche_data.append({
                "id_notifica": n.id_notifica,
                "tipo": n.tipo,
                "messaggio": n.messaggio,
                "data": n.data_notifica.isoformat(),
                "letto": n.letto,
                "dettagli_prenotazione": {
                    "id": prenotazione.id_prenotazione,
                    "data_prenotata": prenotazione.data_prenotata.isoformat(),
                    "stato": prenotazione.stato,
                    "utente": f"{utente.nome} {utente.cognome}" if utente else "Utente eliminato",
                    "numero_posti": prenotazione.numero_posti,
                    "piatti": [
                        {"nome": Piatto.query.get(d.fk_piatto).nome, "quantita": d.quantita}
                        for d in dettagli
                    ] if dettagli else []
                } if prenotazione else {}
            })
        return jsonify(notifiche_data), 200
          
    @app.route('/api/notifiche/<int:notifica_id>/letto', methods=['PUT', 'OPTIONS'])
    @jwt_required()
    def mark_notifica_as_read(notifica_id):
        if request.method == 'OPTIONS':
            response = jsonify({})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
            response.headers.add('Access-Control-Allow-Methods', 'PUT, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Authorization, Content-Type')
            return response, 200

        user_id = get_jwt_identity()
        user = User.query.get(user_id)  # Correggi qui: 'User' → 'user'
        if not user or user.ruolo != RuoloEnum.admin:
            return jsonify({"message": "Accesso negato"}), 403

        notifica = Notifica.query.get(notifica_id)
        if not notifica:
            return jsonify({"message": "Notifica non trovata"}), 404

        notifica.letto = True
        db.session.commit()
        return jsonify({"message": "Notifica aggiornata"}), 200