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
  templateUrl: "./admin.component.html" 
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