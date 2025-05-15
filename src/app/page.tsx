"use client"

import { useState } from 'react';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { DateRangePicker } from '@/components/date-range-picker';
import { PlatformSelect } from '@/components/platform-select';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';



export default function Home() {
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { platformStats, engagementData } = useDashboardData(
    platform,
    dateRange?.from,
    dateRange?.to
  );

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:gap-6 lg:gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <PlatformSelect 
              value={platform} 
              onValueChange={setPlatform} 
            />
            <DateRangePicker 
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
        </div>
        
        {/* Platform Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {platformStats.map((stats) => (
            <div 
              key={stats.platform}
              className={`p-4 rounded-lg border bg-card text-card-foreground shadow-sm ${
                platform !== 'all' && platform !== stats.platform ? 'opacity-50' : ''
              }`}
            >
              <h3 className="font-medium capitalize">{stats.platform}</h3>
              <div className="mt-2 text-2xl font-bold">{stats.followers}</div>
              <p className="text-sm text-muted-foreground">
                Followers • {stats.engagement} Engagement
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <AreaChart 
            title={`${platform === 'all' ? 'Overall' : platform.charAt(0).toUpperCase() + platform.slice(1)} Engagement`}
            data={engagementData}
            color="#0ea5e9"
          />
          <BarChart
            title="Platform Comparison"
            data={platformStats.map(stats => ({
              name: stats.platform,
              value: parseInt(stats.followers.replace(/[^0-9]/g, ''))
            }))}
            color="#0ea5e9"
          />
        </div>
        
        <div className="grid gap-4">
          <AreaChart 
            title="Growth Trend"
            data={engagementData.map((item, i) => ({
              name: item.name,
              value: Math.floor(item.value * (1 + i * 0.1))
            }))}
            color="#10b981"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
