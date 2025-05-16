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
        console.log('Fetching platform stats for:', platform); // Debug log
        const statsResponse = await fetch(`/api/stats/platform?platform=${platform}`, {
          credentials: 'include' // Include cookies in the request
        });
        
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json().catch(() => ({}));
          console.error('Platform stats error response:', {
            status: statsResponse.status,
            statusText: statsResponse.statusText,
            error: errorData
          });
          throw new Error(errorData.message || 'Failed to fetch platform stats');
        }

        const statsData = await statsResponse.json();
        console.log('Received platform stats:', statsData); // Debug log
        setPlatformStats(statsData);

        // Fetch engagement data if dates are provided
        if (startDate && endDate) {
          const formattedStartDate = format(startDate, 'yyyy-MM-dd');
          const formattedEndDate = format(endDate, 'yyyy-MM-dd');
          
          console.log('Fetching engagement data:', { platform, formattedStartDate, formattedEndDate }); // Debug log
          const engagementResponse = await fetch(
            `/api/stats/engagement?platform=${platform}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            {
              credentials: 'include' // Include cookies in the request
            }
          );
          
          if (!engagementResponse.ok) {
            const errorData = await engagementResponse.json().catch(() => ({}));
            console.error('Engagement data error response:', {
              status: engagementResponse.status,
              statusText: engagementResponse.statusText,
              error: errorData
            });
            throw new Error(errorData.message || 'Failed to fetch engagement data');
          }

          const engagementData = await engagementResponse.json();
          console.log('Received engagement data:', engagementData); // Debug log
          setEngagementData(engagementData);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err); // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPlatformStats([]); // Reset stats on error
        setEngagementData([]); // Reset engagement data on error
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
