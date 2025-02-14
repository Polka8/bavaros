import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="sidebar">
        <ul>
          <li><a routerLink="/dashboard/home">Home</a></li>
          <li><a routerLink="/dashboard/analytics">Analytics</a></li>
          <li><a routerLink="/dashboard/settings">Settings</a></li>
        </ul>
      </nav>
      
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 250px;
      background: #f0f0f0;
      padding: 20px;
    }
    .main-content {
      flex: 1;
      padding: 20px;
    }
  `]
})
export class DashboardComponent {}