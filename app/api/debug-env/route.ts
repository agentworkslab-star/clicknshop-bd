// Removed debug route — use Settings page instead
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ removed: true });
}