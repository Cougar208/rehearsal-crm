export interface TimeSlot {
  id: string;          // Например, "10:00"
  timeLabel: string;   // Например, "10:00 - 12:00"
  isBooked: boolean;
  clientName?: string;
}

export interface Room {
  id: number;
  name: string;
  pricePerHour: number;
  area: number;
  equipment: string[];
  schedule: TimeSlot[];
}