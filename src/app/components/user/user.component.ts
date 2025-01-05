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
  templateUrl: "./user.component.html"
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