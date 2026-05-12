export interface TimeSlot {
  id: string;
  timeLabel: string;
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
  imageUrl?: string;
  description?: string; // НОВОЕ: Описание зала
  gallery?: string[];   // НОВОЕ: Дополнительные фото
}