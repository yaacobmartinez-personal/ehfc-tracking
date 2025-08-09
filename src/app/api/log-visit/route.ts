import { NextRequest, NextResponse } from 'next/server';
import { visitService, VisitData } from '../../../services/visitService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_agent, device_type, browser, os, page_url, referrer, location_data } = body;

    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIp || 'unknown';

    // Get location data from IP (you can integrate with a geolocation service here)
    const locationData = {
      ...location_data,
      ip_address: ip
    };

    const visitData: VisitData = {
      ip_address: ip,
      user_agent,
      device_type,
      browser,
      os,
      location_data: locationData,
      page_url,
      referrer
    };

    const result = await visitService.logVisit(visitData);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error logging visit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to log visit' },
      { status: 500 }
    );
  }
}
