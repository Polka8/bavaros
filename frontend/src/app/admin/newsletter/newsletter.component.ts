import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../shared/services/admin.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="newsletter-container">
 <!-- Barra di navigazione -->
 <div class="tabs">
   <button (click)="setSection('unread')">Da leggere</button>
   <button (click)="setSection('read')">Lette</button>
 </div>

 <!-- Sezione corrente per le notifiche non lette -->
 <div *ngIf="activeSection === 'unread'" class="notifications-section">
   <h3>Notifiche da leggere</h3>
   <button class="mark-all" (click)="markAllAsRead()">Segna tutto come letto</button>
   
   <div *ngFor="let notifica of unreadNotifications" class="notifica-item">
     <strong>{{ notifica.tipo }}</strong> - {{ notifica.messaggio }}<br>
     <small>{{ notifica.data | date:'medium' }}</small>
     <button (click)="markAsRead(notifica.id_notifica)">Segna come letto</button>
   </div>
 </div>

 <!-- Sezione corrente per le notifiche lette -->
 <div *ngIf="activeSection === 'read'" class="notifications-section">
   <h3>Notifiche lette</h3>
   <div class="filters">
     <div class="date-filter">
       <input type="date" [(ngModel)]="filterDate" (change)="applyDateFilter()">
       <button (click)="clearDateFilter()">×</button>
     </div>
     <select [(ngModel)]="sortOrder" (change)="applySort()">
       <option value="recent">Più recenti</option>
       <option value="oldest">Più vecchie</option>
     </select>
   </div>
   
   <!-- Elenco delle notifiche lette -->
   <div *ngFor="let notifica of readNotifications" class="notifica-item">
     <strong>{{ notifica.tipo }}</strong> - {{ notifica.messaggio }}<br>
     <small>{{ notifica.data | date:'medium' }}</small>
   </div>
 </div>
</div>

 `,
 styles: [`
    .section-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 20px;
   }
   .filters {
     display: flex;
     gap: 10px;
     align-items: center;
   }
   .date-filter {
     position: relative;
     display: flex;
     align-items: center;
   }
   .date-filter button {
     margin-left: 5px;
     background: #ff4444;
     color: white;
     border: none;
     border-radius: 50%;
     cursor: pointer;
   }
   .mark-all {
     background: #4CAF50;
     color: white;
     border: none;
     padding: 8px 15px;
     border-radius: 4px;
     cursor: pointer;
   }
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
     select {
     padding: 5px;
     border-radius: 4px;
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
  activeSection: 'unread' | 'read' = 'unread';
  allNotifications: any[] = [];
  unreadNotifications: any[] = [];
  readNotifications: any[] = [];
  filterDate: string = '';
  sortOrder: 'recent' | 'oldest' = 'recent';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadNotifiche();
  }

  loadNotifiche(): void {
    this.adminService.getNotifiche().subscribe({
      next: (data: any[]) => {
        this.allNotifications = data;
        this.filterNotifications();
      },
      error: (err) => console.error('Errore caricamento notifiche:', err)
    });
  }

  setSection(section: 'unread' | 'read'): void {
    this.activeSection = section;
    this.filterNotifications();
  }

  filterNotifications(): void {
    this.unreadNotifications = this.allNotifications
      .filter(n => !n.letto)
      .sort(this.getSortFunction());

    this.readNotifications = this.allNotifications
      .filter(n => n.letto)
      .sort(this.getSortFunction());
  }

  getSortFunction(): (a: any, b: any) => number {
    return this.sortOrder === 'recent' 
      ? (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      : (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime();
  }

  markAsRead(notificaId: number): void {
    this.adminService.markNotificaAsRead(notificaId).subscribe({
      next: () => {
        const index = this.allNotifications.findIndex(n => n.id_notifica === notificaId);
        if (index !== -1) {
          this.allNotifications[index].letto = true;
          this.filterNotifications();
        }
      },
      error: (err) => console.error('Errore:', err)
    });
  }

  markAllAsRead(): void {
    this.adminService.markAllAsRead().subscribe({
      next: () => {
        this.allNotifications.forEach(n => n.letto = true);
        this.filterNotifications();
      },
      error: (err) => console.error('Errore:', err)
    });
  }

  applyDateFilter() {
    this.applyFilters();
}

private applyFilters() {
    let filtered = [...this.readNotifications];
    if (this.filterDate) {
        const filterDateObj = new Date(this.filterDate);
        filtered = filtered.filter(n => {
            const notifDate = new Date(n.data);
            return notifDate.toDateString() === filterDateObj.toDateString();
        });
    }
    // Ordinamento...
    this.readNotifications = filtered;
}


  clearDateFilter(): void {
    this.filterDate = '';
    this.filterNotifications();
  }
  applySort(): void {
    this.filterNotifications();
  }
}