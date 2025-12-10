export async function getDoctors(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL}/doctors`);
    return res.json();
}
export async function getBookings(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}/bookings`);
    return res.json();
}