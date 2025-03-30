import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { 
  addDays, 
  addMonths,
  addWeeks,
  endOfMonth, 
  endOfWeek,
  format,
  getHours,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isToday,
  setHours, 
  startOfMonth, 
  startOfWeek 
} from 'date-fns';
import { MatIcon } from '@angular/material/icon';

type CustomCalendarView = CalendarView | 'timeline';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon,
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory }
  ],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  @ViewChild('datePicker') datePicker!: MatDatepicker<Date>;
  timelineHours = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);
  view: CustomCalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  selectedDate: Date = new Date();
  showDatePicker = false;
  weekRange: string = '';
  daysInMonth: Date[][] = [];
  daysInWeek: Date[] = [];
  currentDaySlots: { time: Date; label: string }[] = [];

  timeSlots = Array.from({ length: 13 }, (_, i) => ({
    hour: 8 + i,
    label: `${(8 + i).toString().padStart(2, '0')}:00`
  }));

  events: CalendarEvent[] = [
    {
      start: new Date(2025, 2, 29, 10, 0),
      end: new Date(2025, 2, 29, 12, 0),
      title: 'Riunione importante',
    },
    {
      start: new Date(2025, 2, 29, 14, 30),
      end: new Date(2025, 2, 29, 16, 0),
      title: 'Presentazione progetto',
    }
  ];

  ngOnInit(): void {
    this.generateCalendar();
    this.loadEvents();
  }

  setView(view: CustomCalendarView): void {
    this.view = view;
    this.generateCalendar();
    this.loadEvents();
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.selectedDate = new Date();
    this.generateCalendar();
    this.loadEvents();
  }

  onDateSelected(date: Date): void {
    this.viewDate = date;
    this.selectedDate = date;
    this.showDatePicker = false;
    this.datePicker.close();
    this.generateCalendar();
    this.loadEvents();
  }

  private loadEvents(): void {
    // Implementa il caricamento degli eventi
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
    this.loadEvents();
  }

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
      default:
        this.generateMonthView();
        break;
    }
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
    
    this.daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      this.daysInWeek.push(addDays(start, i));
    }
    
    this.weekRange = `${format(start, 'd MMM')} - ${format(end, 'd MMM y')}`;
  }

  private generateDayView(): void {
    this.currentDaySlots = Array.from({ length: 24 }, (_, i) => ({
      time: setHours(this.viewDate, i),
      label: format(setHours(this.viewDate, i), 'HH:mm')
    }));
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

  getEventsForDay(day: Date): CalendarEvent[] {
    return this.events.filter(event => isSameDay(event.start, day));
  }

  getEventsForHour(hour: number): CalendarEvent[] {
    return this.events.filter(event => 
      getHours(event.start) === hour && 
      isSameDay(event.start, this.viewDate)
    );
  }

  calculateEventTop(event: CalendarEvent): number {
    const start = new Date(event.start);
    const hours = start.getHours() - 8;
    const minutes = start.getMinutes();
    return (hours * 60 + minutes) * 1.2;
  }

  calculateEventHeight(event: CalendarEvent): number {
    const duration = (event.end!.getTime() - event.start.getTime()) / (1000 * 60);
    return duration * 1.2;
  }
}