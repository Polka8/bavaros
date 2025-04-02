import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../shared/services/menu.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-gestione-menu',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatInputModule
  ],
  template: `
    <div class="menu-management">
      <h2>Gestione Menù</h2>
      
      <!-- Titolo Menù modificabile -->
      <div class="menu-header">
        <input type="text" [(ngModel)]="menuTitle" placeholder="Titolo Menù" />
      </div>
      
      <div class="container">
        <!-- Lista dei piatti disponibili (non modificabile) -->
        <div class="available-dishes" 
             cdkDropList 
             [id]="'availableDishes'"
             [cdkDropListData]="availableDishes"
             [cdkDropListConnectedTo]="connectedDropLists"
             (cdkDropListDropped)="dropAvailable($event)">
          <h3>Piatti Disponibili</h3>
          <div class="dish-item" *ngFor="let dish of availableDishes" cdkDrag>
            {{ dish.nome }} ({{ dish.prezzo | currency }})
          </div>
        </div>
      
        <!-- Drop zones per le sezioni del menù -->
        <div class="menu-sections">
          <div class="section" 
               *ngFor="let section of sections" 
               cdkDropList 
               [id]="section"
               [cdkDropListData]="menuData[section]"
               [cdkDropListConnectedTo]="connectedDropLists"
               (cdkDropListDropped)="dropSection($event, section)">
            <h3>{{ section }}</h3>
            <div class="menu-item" *ngFor="let item of menuData[section]" cdkDrag>
              {{ item.nome }} ({{ item.prezzo | currency }})
            </div>
          </div>
        </div>
      </div>
      
      <button mat-raised-button color="primary" (click)="saveMenu()">Salva Menù</button>
      
      <!-- Lista dei menù salvati -->
      <div class="saved-menus">
        <h3>Menù Salvati</h3>
       <div class="saved-menu" *ngFor="let saved of savedMenus">
        <h4>{{ saved.titolo }}</h4>
        
        <!-- Mostra le sezioni e i piatti del menù salvato -->
        <div class="menu-preview">
          <div *ngFor="let sezione of saved.sezioni" class="section-preview">
            <strong>{{ sezione.nome_sezione }}:</strong>
            <div *ngFor="let piatto of sezione.piatti">
              - {{ piatto.nome }} ({{ piatto.prezzo | currency }})
            </div>
          </div>
        </div>

        <button mat-button (click)="editMenu(saved)">Modifica</button>
        <button mat-button color="warn" (click)="removeMenu(saved.id_menu)">Elimina</button>
       </div>
      </div>

    </div>
  `,
  styles: [`
    .menu-management {
      padding: 20px;
    }
    .menu-header input {
      font-size: 1.2rem;
      padding: 5px;
      width: 100%;
      margin-bottom: 15px;
    }
    .menu-preview {
        margin: 10px 0;
        padding: 10px;
        background: #f8f8f8;
        border-radius: 4px;
      }

    .section-preview {
        margin-bottom: 8px;
      }

    .section-preview strong {
        display: block;
        margin-bottom: 4px;
        color: #333;
      }
    .container {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .available-dishes {
      width: 30%;
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 4px;
      background: #fafafa;
    }
    .available-dishes h3 {
      text-align: center;
      margin-top: 0;
    }
    .dish-item {
      padding: 5px;
      margin: 5px 0;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: move;
    }
    .menu-sections {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      flex: 1;
    }
    .section {
      border: 1px dashed #ccc;
      width: 45%;
      min-height: 150px;
      padding: 10px;
      border-radius: 4px;
      background: #fff;
    }
    .section h3 {
      text-align: center;
      margin-top: 0;
    }
    .menu-item {
      padding: 5px;
      margin: 5px 0;
      background: #e0f7fa;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: move;
    }
    .saved-menus {
      margin-top: 20px;
    }
    .saved-menu {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin: 5px 0;
      cursor: pointer;
    }
  `]
})
export class GestioneMenuComponent implements OnInit {
  currentMenuId: number | null = null; // Aggiungi questa riga nella classe
  menuTitle: string = "Titolo Menù";
  sections: string[] = ["Antipasto", "Primo", "Secondo", "Dolce"];
  // Inizialmente, le sezioni del menù sono vuote
  menuData: { [key: string]: any[] } = {
    "Antipasto": [],
    "Primo": [],
    "Secondo": [],
    "Dolce": []
  };
  allAvailableDishes: any[] = [];
  availableDishes: any[] = [];  // Piatti disponibili caricati dal backend
  savedMenus: any[] = [];         // Menù salvati

  connectedDropLists: string[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadAllAvailableDishes();
    this.loadSavedMenus();
    // Imposta i drop list connessi: la lista disponibile e tutte le sezioni
    this.connectedDropLists = ['availableDishes', ...this.sections];
  }
  loadAllAvailableDishes(): void {
    this.menuService.getMenu().subscribe(
      data => {
        this.allAvailableDishes = data; // Memorizza la lista completa
        this.availableDishes = [...data]; // Crea una copia per la visualizzazione
      },
      error => console.error('Errore nel caricamento dei piatti', error)
    );
  }
  loadAvailableDishes(): void {
    this.menuService.getMenu().subscribe(
      data => {
        this.allAvailableDishes = data; // Salva la lista completa
        this.availableDishes = [...data]; // Inizializza la lista filtrata
      },
      error => console.error('Errore nel caricamento dei piatti', error)
    );
  }

  loadSavedMenus(): void {
    this.menuService.getSavedMenus().subscribe(
      data => this.savedMenus = data,
      error => console.error('Errore nel caricamento dei menù salvati', error)
    );
  }

  dropAvailable(event: CdkDragDrop<any[]>): void {
    // Permetti di riportare un elemento dalla sezione alla lista disponibili, se necessario
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropSection(event: CdkDragDrop<any[]>, section: string): void {
    if (event.previousContainer.id === 'availableDishes') {
      // Usa transferArrayItem invece di clonare manualmente
      transferArrayItem(
        event.previousContainer.data,  // Da qui
        event.container.data,          // A qui
        event.previousIndex,
        event.currentIndex
      );
    } else if (event.previousContainer === event.container) {
      moveItemInArray(this.menuData[section], event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  saveMenu(): void {
    const menuToSave = {
      titolo: this.menuTitle,
      is_pubblico: true,
      sezioni: this.sections.reduce((acc, section) => {
        acc[section] = this.menuData[section].map(dish => ({ id_piatto: dish.id_piatto }));
        return acc;
      }, {} as { [key: string]: { id_piatto: number }[] })
    };
  
    this.menuService.saveMenu(menuToSave).subscribe(
      response => {
        console.log('Menù salvato', response);
        this.resetForm();
        this.loadSavedMenus();
        // Ripristina la lista completa dei piatti disponibili
        this.availableDishes = [...this.allAvailableDishes];
      },
      error => console.error('Errore nel salvataggio del menù', error)
    );
  }
  editMenu(menu: any): void {
    this.currentMenuId = menu.id_menu;
    this.menuTitle = menu.titolo;
  
    // Resetta le sezioni
    this.sections.forEach(section => this.menuData[section] = []);
  
    // Raccogli gli ID dei piatti nel menù corrente
    const currentDishIds = new Set<number>();
    menu.sezioni.forEach((sezione: any) => {
      sezione.piatti.forEach((piatto: any) => currentDishIds.add(piatto.id_piatto));
    });
  
    // Popola le sezioni con i dati del menù
    menu.sezioni.forEach((sezione: any) => {
      const sectionName = sezione.nome_sezione;
      if (this.menuData.hasOwnProperty(sectionName)) {
        this.menuData[sectionName] = sezione.piatti.map((piatto: any) => ({
          id_piatto: piatto.id_piatto,
          nome: piatto.nome,
          prezzo: piatto.prezzo
        }));
      }
    });
  
    // Filtra la lista disponibile per escludere i piatti del menù corrente
    this.availableDishes = this.allAvailableDishes.filter(
      dish => !currentDishIds.has(dish.id_piatto)
    );
  }
  
  removeMenu(menuId: number): void {
    this.menuService.deleteMenu(menuId).subscribe(
      response => {
        console.log('Menù eliminato', response);
        this.loadSavedMenus();
      },
      error => console.error('Errore nell\'eliminazione del menù', error)
    );
  }
  private resetForm(): void {
    this.menuTitle = "Titolo Menù";
    this.sections.forEach(section => this.menuData[section] = []);
    this.currentMenuId = null;
    // Ripristina la lista disponibile alla versione completa
    this.availableDishes = [...this.allAvailableDishes];
  }
  
  updateMenu(): void {
    if (!this.currentMenuId) {
      console.error("Nessun menù selezionato per l'aggiornamento");
      return;
    }
  
    const menuToUpdate = {
      id_menu: this.currentMenuId, // Usa l'ID salvato
      titolo: this.menuTitle,
      sezioni: this.sections.reduce((acc, section) => {
        acc[section] = this.menuData[section].map(dish => ({ id_piatto: dish.id_piatto }));
        return acc;
      }, {} as { [key: string]: { id_piatto: number }[] })
    };
  
    this.menuService.updateMenu(menuToUpdate).subscribe(
      response => {
        console.log('Menù aggiornato', response);
        this.loadSavedMenus();
        this.resetForm(); // Opzionale: reimposta il form dopo l'aggiornamento
      },
      error => console.error('Errore nell\'aggiornamento del menù', error)
    );
  }
  
}
