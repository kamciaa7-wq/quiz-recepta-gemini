import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    resend: process.env.RESEND_API_KEY || 'NIE MA',
    admin: process.env.ADMIN_PASSWORD || 'BRAK',
  });
}

