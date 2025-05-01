"use client"

import { useState } from 'react';
import { addDays, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { DateRangePicker } from '@/components/date-range-picker';
import { PlatformSelect } from '@/components/platform-select';

// Sample data generator based on platform and date range
const generateData = (platform: string, startDate: Date, endDate: Date) => {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(startDate, i);
    const multiplier = platform === 'all' ? 1 : platform === 'instagram' ? 1.5 : 0.8;
    return {
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: Math.floor(Math.random() * 10000 * multiplier),
    };
  });
};

const platformStats = {
  twitter: { followers: '2.4K', engagement: '12.5%' },
  instagram: { followers: '15.2K', engagement: '18.7%' },
  linkedin: { followers: '8.1K', engagement: '9.3%' },
  facebook: { followers: '32.5K', engagement: '15.1%' },
};

export default function Home() {
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Generate data based on selected platform and date range
  const engagementData = dateRange?.from && dateRange.to
    ? generateData(platform, dateRange.from, dateRange.to)
    : [];

  const platformComparison = [
    { name: 'Twitter', value: 2400 },
    { name: 'Instagram', value: 15200 },
    { name: 'LinkedIn', value: 8100 },
    { name: 'Facebook', value: 32500 },
  ].filter(item => platform === 'all' || item.name.toLowerCase() === platform);

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
          {Object.entries(platformStats).map(([name, stats]) => (
            <div 
              key={name}
              className={`p-4 rounded-lg border bg-card text-card-foreground shadow-sm ${
                platform !== 'all' && platform !== name ? 'opacity-50' : ''
              }`}
            >
              <h3 className="font-medium capitalize">{name}</h3>
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
            data={platformComparison}
            color="#8b5cf6"
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
