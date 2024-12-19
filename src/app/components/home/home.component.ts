import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <div class="jumbotron">
        <h1>Welcome to Seat Booking System</h1>
        <p class="lead">
          Easily manage your seat bookings through our user-friendly interface.
        </p>
        <hr class="my-4">
        <p>Click below to access your dashboard:</p>
        <a class="btn btn-primary btn-lg" routerLink="/user">User Dashboard</a>
      </div>
    </div>
  `
})
export class HomeComponent { }
