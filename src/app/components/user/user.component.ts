import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Booking, CreateBookingDTO } from '../../models/booking';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [BookingService],
  template: `
    <div class="container">
      <h2>User Dashboard</h2>
      
      <!-- Booking Form -->
      <div class="card mb-4">
        <div class="card-body">
          <h3>Book a Seat</h3>
          <form (ngSubmit)="bookSeat()">
            <div class="mb-3">
              <label class="form-label">Employee ID</label>
              <input type="number" class="form-control" [(ngModel)]="newBooking.employeeId" name="employeeId">
            </div>
            <div class="mb-3">
              <label class="form-label">Date</label>
              <input type="date" class="form-control" [(ngModel)]="newBooking.bookingDate" name="bookingDate">
            </div>
            <div class="mb-3">
              <label class="form-label">Seat Number</label>
              <input type="number" class="form-control" [(ngModel)]="newBooking.seatNumber" name="seatNumber">
            </div>
            <button type="submit" class="btn btn-primary">Book Seat</button>
          </form>
        </div>
      </div>

      <!-- Current Bookings -->
      <div class="card">
        <div class="card-body">
          <h3>Your Bookings</h3>
          <div class="mb-3">
            <label class="form-label">Enter Employee ID to view bookings:</label>
            <div class="input-group">
              <input type="number" class="form-control" [(ngModel)]="searchEmployeeId">
              <button class="btn btn-primary" (click)="loadBookings()">Search</button>
            </div>
          </div>
          
          <table class="table" *ngIf="bookings.length > 0">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Date</th>
                <th>Seat Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let booking of bookings">
                <td>{{booking.bookingId}}</td>
                <td>{{booking.bookingDate | date}}</td>
                <td>{{booking.seatId}}</td>
                <td>
                  <button class="btn btn-danger btn-sm" (click)="cancelBooking(booking.bookingId)">
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p *ngIf="bookings.length === 0">No bookings found.</p>
        </div>
      </div>
    </div>
  `
})

export class UserComponent implements OnInit {
  bookings: Booking[] = [];
  searchEmployeeId: number = 0;
  newBooking: CreateBookingDTO = {
    employeeId: 0,
    bookingDate: new Date(),
    seatNumber: 0
  };

  constructor(private bookingService: BookingService) { }

  ngOnInit() { }

  loadBookings() {
    if (this.searchEmployeeId) {
      this.bookingService.getUserBookings(this.searchEmployeeId).subscribe({
        next: (data) => this.bookings = data,
        error: (error) => alert('Error loading bookings: ' + error.message)
      });
    }
  }

  bookSeat() {
    this.bookingService.addBooking(this.newBooking).subscribe({
      next: (response) => {
        alert(`Booking successful! Booking ID: ${response.bookingId}`);
        this.loadBookings();
      },
      error: (error) => alert('Error booking seat: ' + error.message)
    });
  }

  cancelBooking(bookingId: number) {
    const cancelDTO = {
      employeeId: this.searchEmployeeId,
      bookingId: bookingId
    };

    this.bookingService.cancelBooking(cancelDTO).subscribe({
      next: (success) => {
        if (success) {
          alert('Booking cancelled successfully');
          this.loadBookings();
        } else {
          alert('Failed to cancel booking');
        }
      },
      error: (error) => alert('Error cancelling booking: ' + error.message)
    });
  }
}