import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking';
import { AdminBookingDTO, ModifyBookingDTO, AdminCancelBookingDTO } from '../../models/admin';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [BookingService],
  template: `
    <div class="container">
      <h2>Admin Dashboard</h2>

      <!-- Admin ID Input -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">Admin ID</label>
            <input type="number" class="form-control" [(ngModel)]="adminId" placeholder="Enter your admin ID">
          </div>
        </div>
      </div>

      <!-- View Bookings Section -->
      <div class="card mb-4">
        <div class="card-body">
          <h3>View Bookings by Date</h3>
          <div class="mb-3">
            <label class="form-label">Select Date</label>
            <input type="date" class="form-control" [(ngModel)]="selectedDate">
            <button class="btn btn-primary mt-2" (click)="loadBookings()">View Bookings</button>
          </div>

          <table class="table" *ngIf="bookings.length > 0">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Employee ID</th>
                <th>Seat Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let booking of bookings">
                <td>{{booking.bookingId}}</td>
                <td>{{booking.employeeId}}</td>
                <td>{{booking.seatId}}</td>
                <td>
                  <button class="btn btn-warning btn-sm me-2" (click)="showModifyForm(booking)">Modify</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteBooking(booking.bookingId)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p *ngIf="bookings.length === 0">No bookings found for this date.</p>
        </div>
      </div>

      <!-- Book for User Section -->
      <div class="card mb-4">
        <div class="card-body">
          <h3>Book for User</h3>
          <form (ngSubmit)="bookForUser()">
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

      <!-- Modify Booking Form -->
      <div class="card mb-4" *ngIf="showModify">
        <div class="card-body">
          <h3>Modify Booking</h3>
          <form (ngSubmit)="modifyBooking()">
            <div class="mb-3">
              <label class="form-label">Booking ID: {{modifyBookingData.bookingId}}</label>
            </div>
            <div class="mb-3">
              <label class="form-label">New Seat Number</label>
              <input type="number" class="form-control" [(ngModel)]="modifyBookingData.newSeatNumber" name="newSeatNumber">
            </div>
            <button type="submit" class="btn btn-primary me-2">Save Changes</button>
            <button type="button" class="btn btn-secondary" (click)="showModify = false">Cancel</button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent {
  adminId: number = 0;
  selectedDate: string = new Date().toISOString().split('T')[0];
  bookings: Booking[] = [];
  showModify: boolean = false;
  
  newBooking: AdminBookingDTO = {
    adminId: 0,
    employeeId: 0,
    bookingDate: new Date(),
    seatNumber: 0
  };

  modifyBookingData: ModifyBookingDTO = {
    adminId: 0,
    bookingDate: new Date(),
    bookingId: 0,
    newSeatNumber: 0
  };

  constructor(private bookingService: BookingService) { }

  loadBookings() {
    if (this.adminId && this.selectedDate) {
      this.bookingService.getBookingsOnDate(new Date(this.selectedDate), this.adminId)
        .subscribe({
          next: (data) => this.bookings = data,
          error: (error) => alert('Error loading bookings: ' + error.message)
        });
    } else {
      alert('Please enter Admin ID and select a date');
    }
  }

  bookForUser() {
    if (!this.adminId) {
      alert('Please enter Admin ID');
      return;
    }

    this.newBooking.adminId = this.adminId;
    this.bookingService.bookSeatForUser(this.newBooking)
      .subscribe({
        next: (bookingId) => {
          alert(`Booking successful! Booking ID: ${bookingId}`);
          this.loadBookings();
        },
        error: (error) => alert('Error booking seat: ' + error.message)
      });
  }

  showModifyForm(booking: Booking) {
    this.showModify = true;
    this.modifyBookingData = {
      adminId: this.adminId,
      bookingDate: new Date(this.selectedDate),
      bookingId: booking.bookingId,
      newSeatNumber: booking.seatId
    };
  }

  modifyBooking() {
    if (!this.adminId) {
      alert('Please enter Admin ID');
      return;
    }

    this.modifyBookingData.adminId = this.adminId;
    this.bookingService.modifyBooking(this.modifyBookingData)
      .subscribe({
        next: (newBookingId) => {
          alert(`Booking modified successfully! New Booking ID: ${newBookingId}`);
          this.showModify = false;
          this.loadBookings();
        },
        error: (error) => alert('Error modifying booking: ' + error.message)
      });
  }

  deleteBooking(bookingId: number) {
    if (!this.adminId) {
      alert('Please enter Admin ID');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this booking?');
    if (confirmDelete) {
      const deleteData: AdminCancelBookingDTO = {
        adminId: this.adminId,
        bookingId: bookingId
      };

      this.bookingService.deleteBooking(deleteData)
        .subscribe({
          next: (success) => {
            if (success) {
              alert('Booking deleted successfully');
              this.loadBookings();
            } else {
              alert('Failed to delete booking');
            }
          },
          error: (error) => alert('Error deleting booking: ' + error.message)
        });
    }
  }
}