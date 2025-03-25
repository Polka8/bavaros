import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../shared/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="newsletter-container">
      <!-- Barra di navigazione -->
      <div class="tabs">
        <button (click)="setSection('unread')">Da leggere</button>
        <button (click)="setSection('read')">Lette</button>
      </div>

      <!-- Sezione corrente -->
      <div *ngIf="activeSection === 'unread'" class="notifications-section">
        <h3>Notifiche da leggere</h3>
        <div *ngFor="let notifica of unreadNotifications" class="notifica-item">
          <strong>{{ notifica.tipo }}</strong> - {{ notifica.messaggio }}<br>
          <small>{{ notifica.data | date:'medium' }}</small>
          <button (click)="markAsRead(notifica.id_notifica)">Segna come letto</button>
        </div>
      </div>

      <div *ngIf="activeSection === 'read'" class="notifications-section">
        <h3>Notifiche lette</h3>
        <div *ngFor="let notifica of readNotifications" class="notifica-item">
          <strong>{{ notifica.tipo }}</strong> - {{ notifica.messaggio }}<br>
          <small>{{ notifica.data | date:'medium' }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .newsletter-container {
      padding: 20px;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .tabs button {
      padding: 10px;
      cursor: pointer;
    }
    .notifications-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .notifica-item {
      margin-bottom: 15px;
    }
  `]
})
export class NewsletterComponent implements OnInit {
  activeSection: 'unread' | 'read' = 'unread'; // Sezione attiva
  allNotifications: any[] = [];
  unreadNotifications: any[] = [];
  readNotifications: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadNotifiche();
  }

  loadNotifiche() {
    this.adminService.getNotifiche().subscribe(
      data => {
        this.allNotifications = data;
        this.unreadNotifications = this.allNotifications.filter(n => !n.letto);
        this.readNotifications = this.allNotifications.filter(n => n.letto);
      },
      error => console.error('Errore:', error)
    );
  }

  setSection(section: 'unread' | 'read') {
    this.activeSection = section;
  }

  markAsRead(notificaId: number) {
    this.adminService.markNotificaAsRead(notificaId).subscribe(
      () => this.loadNotifiche(),
      error => console.error('Errore:', error)
    );
  }
}