import { useState, useEffect } from 'react';
import { format } from 'date-fns';

import { PlatformName } from '@/types/platform';

export type PlatformStats = {
  id: number;
  platform: PlatformName;
  followers: string;
  engagement: string;
};

export type EngagementData = {
  name: string;
  value: number;
};

export function useDashboardData(platform: PlatformName, startDate?: Date, endDate?: Date) {
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch platform stats
        const statsResponse = await fetch(`/api/stats/platform?platform=${platform}`);
        if (!statsResponse.ok) throw new Error('Failed to fetch platform stats');
        const statsData = await statsResponse.json();
        setPlatformStats(statsData);

        // Fetch engagement data if dates are provided
        if (startDate && endDate) {
          const formattedStartDate = format(startDate, 'yyyy-MM-dd');
          const formattedEndDate = format(endDate, 'yyyy-MM-dd');
          
          const engagementResponse = await fetch(
            `/api/stats/engagement?platform=${platform}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
          );
          
          if (!engagementResponse.ok) throw new Error('Failed to fetch engagement data');
          const engagementData = await engagementResponse.json();
          setEngagementData(engagementData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [platform, startDate, endDate]);

  return {
    platformStats,
    engagementData,
    isLoading,
    error
  };
}
