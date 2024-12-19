export interface Booking {
    bookingId: number;
    employeeId: number;
    bookingDate: Date;
    seatId: number;
  }
  
  export interface CreateBookingDTO {
    employeeId: number;
    bookingDate: Date;
    seatNumber: number;
  }
  
  export interface CancelBookingDTO {
    employeeId: number;
    bookingId: number;
  }