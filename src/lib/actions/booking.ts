"use server";

import { revalidatePath } from 'next/cache';

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

// Fetch all bookings for a user
export const fetchUserBookings = async (email) => {
  try {
    const res = await fetch(`${baseUrl}/bookings/${email}`, { cache: 'no-store' });
    revalidatePath('/dashboard/tenant/my-bookings');
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

// Fetch payment history (PAID bookings) for a user
export const fetchPaymentHistory = async (email) => {
  try {
    const res = await fetch(`${baseUrl}/payment-history/${email}`, { cache: 'no-store' });
    revalidatePath('/dashboard/tenant/my-bookings');
    if (!res.ok) {
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
};

// Process a payment for a booking
export const processPaymentAction = async (bookingId) => {
  try {
    const res = await fetch(`${baseUrl}/bookings/${bookingId}/pay`, {
      method: 'PATCH',
    });
    
    revalidatePath('/dashboard/tenant/my-bookings');
    return res.ok;
  } catch (error) {
    console.error("Error processing payment:", error);
    return false;
  }
};
