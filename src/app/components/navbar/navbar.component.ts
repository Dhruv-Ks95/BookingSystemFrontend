import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Seat Booking System</a>
        <div class="navbar-nav">
          <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a class="nav-link" routerLink="/user" routerLinkActive="active">User Dashboard</a>
          <a class="nav-link" routerLink="/admin" routerLinkActive="active">Admin Dashboard</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { margin-bottom: 20px; }
    .active { font-weight: bold; }
  `]
})
export class NavbarComponent { }
