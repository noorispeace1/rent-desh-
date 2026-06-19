import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(request) {
  try {
    const body = await request.json();
    const { propertyId, propertyTitle, monthlyRent, userName, email, phone, bookingDate, additionalNotes } = body;
    
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions dynamically based on the booking details
      const isSubscription = propertyId && propertyId.startsWith('sub_');
      const existingBookingId = body.existingBookingId || '';
      const success_url = isSubscription 
        ? `${origin}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}&propertyId=${propertyId}`
        : `${origin}/dashboard/success?success=true&session_id={CHECKOUT_SESSION_ID}&propertyId=${propertyId}&propertyTitle=${encodeURIComponent(propertyTitle)}&monthlyRent=${monthlyRent}&userName=${encodeURIComponent(userName)}&email=${encodeURIComponent(email)}&phone=${phone}&bookingDate=${bookingDate}&additionalNotes=${encodeURIComponent(additionalNotes || '')}&existingBookingId=${existingBookingId}`;
      const cancel_url = isSubscription
        ? `${origin}/dashboard/subscription?payment_cancelled=true`
        : `${origin}/dashboard/tenant/my-bookings?payment_cancelled=true`;
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'bdt',
              product_data: {
                name: propertyTitle || 'RentDesh Service',
                description: isSubscription ? 'Owner Subscription Plan' : `Booking for ${propertyTitle || 'Property'}`,
              },
              unit_amount: Number(monthlyRent) * 100,
            },
            quantity: 1,
          },
        ],
        metadata: {
          propertyId: propertyId || '',
          userName: userName || '',
          phone: phone || '',
          bookingDate: bookingDate || '',
        },
        mode: 'payment',
        success_url,
        cancel_url,
      });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Creation Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}