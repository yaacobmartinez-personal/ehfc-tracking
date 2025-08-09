'use client';

import { useVisitLogger } from '../hooks/useVisitLogger';

export default function VisitLogger() {
  useVisitLogger();
  
  // This component doesn't render anything, it just logs visits
  return null;
}
