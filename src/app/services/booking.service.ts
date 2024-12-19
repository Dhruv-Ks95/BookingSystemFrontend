import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminBookingDTO, ModifyBookingDTO, AdminCancelBookingDTO } from '../models/admin';
import { Observable } from 'rxjs';
import { Booking, CreateBookingDTO, CancelBookingDTO } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'https://localhost:7133/api/Booking';

  constructor(private http: HttpClient) { }

  getUserBookings(employeeId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/getBookings/${employeeId}`);
  }

  addBooking(booking: CreateBookingDTO): Observable<{bookingId: number}> {
    return this.http.post<{bookingId: number}>(`${this.baseUrl}/addBooking`, booking);
  }

  cancelBooking(cancelBooking: CancelBookingDTO): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/cancelBooking`, { body: cancelBooking });
  }

  getBookingsOnDate(date: Date, adminId: number): Observable<Booking[]> {
    const formattedDate = date.toISOString();
    return this.http.get<Booking[]>(`${this.baseUrl}/admin/allBookingsOnDate/${formattedDate}?adminId=${adminId}`);
  }

  bookSeatForUser(adminBooking: AdminBookingDTO): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/admin/bookForUser`, adminBooking);
  }

  modifyBooking(modifyBooking: ModifyBookingDTO): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/admin/modifyBooking`, modifyBooking);
  }

  deleteBooking(adminCancelBooking: AdminCancelBookingDTO): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/admin/deleteBooking`, { body: adminCancelBooking });
  }

}
