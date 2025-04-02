import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  CalendarModule, 
  CalendarEvent, 
  CalendarView, 
  DateAdapter 
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { 
  addDays, addMonths, addWeeks, 
  format, getHours, isSameDay, 
  isSameMonth, isSameWeek, isToday, 
  startOfMonth, startOfWeek, endOfWeek, endOfMonth,
  formatISO
} from 'date-fns';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrenotazioniService } from 'src/app/shared/services/prenotazioni.service';

interface PrenotazioneInterface {
  id_prenotazione: number;
  data_prenotata: string;
  nome: string;
  cognome: string;
  numero_posti: number;
  menu_items?: string[];
  note_aggiuntive?: string;
}

interface EventGroup {
  start: Date;
  end: Date;
  events: CalendarEvent[];
}



@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon,
    MatTooltipModule
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory }
  ],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  showDatePicker = false; // <-- Aggiungi questa riga
  
  @ViewChild('datePicker') datePicker!: MatDatepicker<Date>;
  CalendarView = CalendarView;
  calendarViews = [CalendarView.Month, CalendarView.Week, CalendarView.Day];
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  
  daysInMonth: Date[][] = [];
  daysInWeek: Date[] = [];
  weekRange = '';
  
  timeSlots = Array.from({ length: 13 }, (_, i) => ({
    hour: 8 + i,
    label: `${(8 + i).toString().padStart(2, '0')}:00`
  }));

  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
  events: CalendarEvent[] = [];
  
  constructor(private prenotazioniService: PrenotazioniService) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.loadPrenotazioni();
  }

  setView(view: CalendarView): void {
    this.view = view;
    this.generateCalendar();
    this.loadPrenotazioni();
  }

  viewDay(day: Date): void {
    this.viewDate = day;
    this.setView(CalendarView.Day);
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.generateCalendar();
    this.loadPrenotazioni();
  }

  onDateSelected(date: Date): void {
    this.viewDate = date;
    this.generateCalendar();
    this.loadPrenotazioni();
    this.datePicker.close();
  }

  navigatePeriod(offset: number): void {
    switch(this.view) {
      case CalendarView.Month:
        this.viewDate = addMonths(this.viewDate, offset);
        break;
      case CalendarView.Week:
        this.viewDate = addWeeks(this.viewDate, offset);
        break;
      case CalendarView.Day:
        this.viewDate = addDays(this.viewDate, offset);
        break;
    }
    this.generateCalendar();
    this.loadPrenotazioni();
  }

  // METODO GENERATECALENDAR PRESENTE QUI
  private generateCalendar(): void {
    switch(this.view) {
      case CalendarView.Month:
        this.generateMonthView();
        break;
      case CalendarView.Week:
        this.generateWeekView();
        break;
      case CalendarView.Day:
        this.generateDayView();
        break;
    }
  }
  getGroupedEvents(): EventGroup[] {
    const events = this.getEventsForTimeline();
    const groups: EventGroup[] = [];
    
    events.forEach(event => {
      let placed = false;
      
      groups.forEach(group => {
        if (event.start < group.end && (event.end ?? event.start) > group.start) {
          group.events.push(event);
          group.start = new Date(Math.min(group.start.getTime(), event.start.getTime()));
          group.end = new Date(Math.max(group.end.getTime(), (event.end ?? event.start).getTime()));
          placed = true;
        }
      });
  
      if (!placed) {
        groups.push({
          start: new Date(event.start),
          end: new Date(event.end ?? event.start),
          events: [event]
        });
      }
    });
  
    return groups;
  }
  
  calculateEventWidth(group: EventGroup): number {
    return 100 / group.events.length;
  }
  private generateMonthView(): void {
    const start = startOfMonth(this.viewDate);
    let date = startOfWeek(start, { weekStartsOn: 1 });
    const weeks: Date[][] = [];

    for (let week = 0; week < 6; week++) {
      const days: Date[] = [];
      for (let day = 0; day < 7; day++) {
        days.push(date);
        date = addDays(date, 1);
      }
      weeks.push(days);
    }
    this.daysInMonth = weeks;
  }

  private generateWeekView(): void {
    const start = startOfWeek(this.viewDate, { weekStartsOn: 1 });
    const end = endOfWeek(this.viewDate, { weekStartsOn: 1 });
    this.daysInWeek = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    this.weekRange = `${format(start, 'd MMM')} - ${format(end, 'd MMM y')}`;
  }

  private generateDayView(): void {
    // Implementazione per la vista giornaliera
    // (Mantieni la tua implementazione esistente)
  }

  private loadPrenotazioni(): void {
    let params: any = {};
  
    switch(this.view) {
      case CalendarView.Month:
        params = {
          anno: this.viewDate.getFullYear(),
          mese: this.viewDate.getMonth() + 1
        };
        break;
      case CalendarView.Week:
        const weekStart = startOfWeek(this.viewDate, { weekStartsOn: 1 });
        params = {
          start_date: formatISO(weekStart),
          end_date: formatISO(endOfWeek(this.viewDate, { weekStartsOn: 1 }))
        };
        break;
      case CalendarView.Day:
        params = {
          giorno: formatISO(this.viewDate, { representation: 'date' })
        };
        break;
    }
  
    this.prenotazioniService.getPrenotazioniAttive(params).subscribe({
      next: (reservations: PrenotazioneInterface[]) => {
        this.events = reservations.map(res => {
          const start = new Date(res.data_prenotata);
          const end = new Date(res.data_prenotata);
          
          // Normalizza le date rimuovendo l'ora
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
  
          return {
            start: start,
            end: end,
            title: `${res.nome} ${res.cognome} - ${res.numero_posti} posti`,
            color: { 
              primary: this.colors[res.id_prenotazione % this.colors.length],
              secondary: this.colors[res.id_prenotazione % this.colors.length]
            },
            meta: {
              id: res.id_prenotazione,
              nome: res.nome,
              cognome: res.cognome,
              posti: res.numero_posti,
              menu: res.menu_items || [],
              note: res.note_aggiuntive || ''
            }
          };
        });
      },
      error: (err) => console.error('Errore caricamento prenotazioni:', err)
    });
  }

  getEventsForDay(day: Date): CalendarEvent[] {
    return this.events.filter(event => isSameDay(event.start, day));
  }

  getEventsForTimeline(): CalendarEvent[] {
    return this.events
      .filter(event => isSameDay(event.start, this.viewDate))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }
  calculateEventTop(event: CalendarEvent): number {
    const start = new Date(event.start);
    return (start.getHours() - 8) * 60 + start.getMinutes();
  }
  calculateEventPosition(event: CalendarEvent): number {
    const start = new Date(event.start);
    const minutesFromTop = (start.getHours() - 8) * 60 + start.getMinutes();
    return minutesFromTop;
  }
  
  calculateEventDuration(event: CalendarEvent): number {
    const end = event.end || event.start;
    return (end.getTime() - event.start.getTime()) / (1000 * 60);
  }

  calculateEventHeight(event: CalendarEvent): number {
    const end = event.end || event.start;
    const durationMinutes = (end.getTime() - event.start.getTime()) / (1000 * 60);
    return Math.max(durationMinutes, 15); // Altezza minima di 15px
  }

  getTooltipText(event: CalendarEvent): string {
    return `${event.meta.nome} ${event.meta.cognome}
Posti: ${event.meta.posti}
${event.meta.menu?.length ? 'Menu: ' + event.meta.menu.join(', ') : ''}
${event.meta.note ? 'Note: ' + event.meta.note : ''}`;
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    return isSameMonth(date1, date2);
  }

  isSameWeek(date1: Date, date2: Date): boolean {
    return isSameWeek(date1, date2, { weekStartsOn: 1 });
  }

  isToday(date: Date): boolean {
    return isToday(date);
  }
}