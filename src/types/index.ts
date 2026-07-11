export interface Property {
  _id: string;
  title: string;
  monthlyRent: number;
  location: string;
  propertyType: string;
  bedroom: number;
  bathroom: number;
  propertySize: number;
  imageUrl?: string;
  ownerEmail?: string;
  status?: string;
  [key: string]: any;
}

export interface User {
  _id: string;
  email: string;
  role?: string;
  name?: string;
  [key: string]: any;
}

export interface Booking {
  _id: string;
  propertyId: string;
  userId?: string;
  email?: string;
  userName?: string;
  status: string;
  paymentStatus?: string;
  transactionId?: string;
  createdAt: string;
  monthlyRent?: number;
  [key: string]: any;
}

export interface Review {
  _id: string;
  propertyId: string;
  userId?: string;
  email?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
