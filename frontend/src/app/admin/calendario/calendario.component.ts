import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BlockConfirmationDialog } from './block-confirmation.dialog';
import {
  CalendarModule,
  CalendarEvent,
  CalendarView,
  DateAdapter
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isToday,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  formatISO,
  getHours,
  getMinutes,
  parseISO
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
  showDatePicker = false;
  @ViewChild('datePicker') datePicker!: MatDatepicker<Date>;
  CalendarView = CalendarView;
  calendarViews = [CalendarView.Month, CalendarView.Week, CalendarView.Day];
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  daysInMonth: Date[][] = [];
  daysInWeek: Date[] = [];
  blockedDays: Date[] = [];
  weekRange = '';
  timeSlots = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i.toString().padStart(2, '0')}:00`
  }));
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
  events: CalendarEvent[] = [];

  constructor(
    private prenotazioniService: PrenotazioniService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBlockedDays();
    this.generateCalendar();
    this.loadPrenotazioni();
  }
  loadBlockedDays() {
    this.prenotazioniService.getBlockedDays().subscribe({
      next: days => {
        this.blockedDays = days.map(d => typeof d === 'string' ? parseISO(d) : d); // Ora sicuramente Date
      },
      error: err => console.error("Errore nel caricamento giorni bloccati:", err)
    });
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
  // calendario.component.ts
openBlockConfirmation(event: Event, day: Date) {
  event.stopPropagation(); // Ora funzionerà
  if (confirm('Confermare il blocco di questo giorno?')) {
    this.blockDay(day);
  }
}
  
blockDay(day: Date) {
  this.prenotazioniService.blockDay(day).subscribe({
    next: () => {
      this.blockedDays.push(day);
      this.refreshView(); // ✅ Aggiorna la vista
    },
    error: err => console.error("Errore blocco:", err)
  });
}
  
  
  isBlocked(day: Date): boolean {
    return this.blockedDays.some(blockedDay => 
      isSameDay(blockedDay, day)
    );
  }
  // Aggiungi nuovo metodo per lo sblocco
openUnblockConfirmation(event: Event, day: Date) {
  event.stopPropagation();
  if (!confirm('Confermare lo sblocco di questo giorno?')) return;
  
  this.unblockDay(day);
}

unblockDay(day: Date) {
  this.prenotazioniService.unblockDay(day).subscribe({
    next: () => {
      this.blockedDays = this.blockedDays.filter(d => !isSameDay(d, day));
      this.refreshView(); // ✅ Aggiorna la vista
    },
    error: err => console.error("Errore sblocco:", err)
  });
}
  

  navigatePeriod(offset: number): void {
    switch (this.view) {
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

  private generateCalendar(): void {
    switch (this.view) {
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
          group.events.sort((a, b) => a.start.getTime() - b.start.getTime());
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
    // Ora non facciamo nulla qui, la logica è nel template
  }

  private loadPrenotazioni(): void {
    let params: any = {};

    switch (this.view) {
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
    this.prenotazioniService.getBlockedDays().subscribe(days => {
      this.blockedDays = days;
    });

    this.prenotazioniService.getPrenotazioniAttive(params).subscribe({
      next: (reservations: PrenotazioneInterface[]) => {
        console.log('Prenotazioni ricevute:', reservations); // <--- AGGIUNGI QUESTO

        this.events = reservations.map((res) => {
          let start = new Date(res.data_prenotata);
          let end = new Date(res.data_prenotata);

          if (this.view === CalendarView.Day) {
            const dateParts = res.data_prenotata.split('T')[0].split('-');
            const timeParts = res.data_prenotata.split('T')[1].split(':');
            start = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2]),
              parseInt(timeParts[0]),
              parseInt(timeParts[1]),
              parseInt(timeParts[2].split('.')[0])
            );
          // Imposta una durata minima di 30 minuti se non è specificata una fine
          end = new Date(start.getTime() + 30 * 60 * 1000);
          } else {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
          }

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
        this.events.sort((a, b) => a.start.getTime() - b.start.getTime());
      },
      error: (error) => {
        console.error('Errore nel recupero delle prenotazioni:', error);
      }
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

  getEventsForDayTimeline(): CalendarEvent[] {
    const dailyEvents = this.events.filter(event => isSameDay(event.start, this.viewDate));
    console.log('Eventi del giorno:', dailyEvents.map(e => e.start)); // <--- AGGIUNGI QUESTO
    dailyEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

    const positionedEvents: CalendarEvent[] = [];
    const eventsByStartTime: { [key: number]: CalendarEvent[] } = {};

    dailyEvents.forEach(event => {
      const startTime = event.start.getTime();
      if (!eventsByStartTime[startTime]) {
        eventsByStartTime[startTime] = [];
      }
      eventsByStartTime[startTime].push(event);
    });

    for (const startTime in eventsByStartTime) {
      const sameTimeEvents = eventsByStartTime[startTime];
      sameTimeEvents.forEach((event, index) => {
        // Aggiungiamo un 'offset' all'oggetto meta per posizionarlo leggermente a destra
        event.meta.overlapOffset = index * 15; // Prova con un offset di 15px
        positionedEvents.push(event);
      });
    }

    return positionedEvents;
  }
  calculateTopPosition(event: CalendarEvent): number {
    const startHour = getHours(event.start);
    const startMinute = getMinutes(event.start);
    const minutesFromMidnight = startHour * 60 + startMinute;
    console.log('Evento:', event.meta.nome, 'Inizio:', event.start, 'Top:', minutesFromMidnight); // <--- AGGIUNGI QUESTO
    return minutesFromMidnight;
  }

  calculateHeight(event: CalendarEvent): number {
    const end = event.end ?? event.start; // Usa event.start se event.end è null o undefined
    const durationMinutes = (end.getTime() - event.start.getTime()) / (1000 * 60);
    return Math.max(durationMinutes, 30); // Altezza minima di 30px
  }

  getTooltipText(event: CalendarEvent): string {
    return `${event.meta.nome} ${event.meta.cognome}
Posti: ${event.meta.posti}
${event.meta.menu?.length ? 'Menu: ' + event.meta.menu.join(', ') : ''}
${event.meta.note ? 'Note: ' + event.meta.note : ''}`;
  }
  // Removed duplicate openBlockConfirmation method

  isSameMonth(date1: Date, date2: Date): boolean {
    return isSameMonth(date1, date2);
  }

  isSameWeek(date1: Date, date2: Date): boolean {
    return isSameWeek(date1, date2, { weekStartsOn: 1 });
  }

  isToday(date: Date): boolean {
    return isToday(date);
  }
  private refreshView() {
    this.generateCalendar();
    this.loadPrenotazioni();
  }
}