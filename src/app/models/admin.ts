export interface AdminBookingDTO {
    adminId: number;
    employeeId: number;
    bookingDate: Date;
    seatNumber: number;
  }
  
  export interface ModifyBookingDTO {
    adminId: number;
    bookingDate: Date;
    bookingId: number;
    newSeatNumber: number;
  }
  
  export interface AdminCancelBookingDTO {
    adminId: number;
    bookingId: number;
  }