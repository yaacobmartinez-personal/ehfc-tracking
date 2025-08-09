import { useEffect } from 'react';
import { getDeviceInfo } from '../utils/deviceUtils';
import { LocationData } from '../services/visitService';

export function useVisitLogger() {
  useEffect(() => {
    const logVisit = async () => {
      try {
        // Get user agent
        const userAgent = navigator.userAgent;
        const deviceInfo = getDeviceInfo(userAgent);

        // Get current page URL
        const pageUrl = window.location.href;
        const referrer = document.referrer || '';

        // Prepare visit data
        const locationData: LocationData = {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        };

        const visitData = {
          user_agent: userAgent,
          device_type: deviceInfo.device_type,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          page_url: pageUrl,
          referrer: referrer,
          location_data: locationData
        };

        // Log the visit using the API route
        const response = await fetch('/api/log-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        if (!response.ok) {
          throw new Error('Failed to log visit');
        }

        const result = await response.json();
        console.log('Visit logged successfully:', result);
      } catch (error) {
        console.error('Failed to log visit:', error);
      }
    };

    // Log visit when component mounts
    logVisit();
  }, []);
}
