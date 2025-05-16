"use client"

import { useState } from 'react';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/charts/bar-chart";
import { useDashboardData, type PlatformStats } from '@/lib/hooks/use-dashboard-data';
import { PlatformName, PLATFORM_DISPLAY_NAMES } from '@/types/platform';
import { DateRangePicker } from '@/components/date-range-picker';
import { PlatformSelect } from '@/components/platform-select';
import { chartColors } from '@/lib/colors';

export default function DashboardPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { platformStats } = useDashboardData(
    selectedPlatform,
    dateRange?.from,
    dateRange?.to
  );

  // Transform platform stats for the comparison chart
  const platformComparison = platformStats && platformStats.length > 0 ? 
    platformStats.map((stat: PlatformStats) => ({
      name: PLATFORM_DISPLAY_NAMES[(stat.platform.toLowerCase() as unknown) as keyof typeof PLATFORM_DISPLAY_NAMES] || stat.platform,
      value: parseInt(stat.followers),
      color: chartColors[stat.platform.toLowerCase() as keyof typeof chartColors] || '#6366f1'
    })) : [];

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
            <PlatformSelect
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Platform Comparison</CardTitle>
                <CardDescription>
                  Compare follower counts across different platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart 
                  data={platformComparison}
                  title="Platform Comparison"
                  color="#8b5cf6"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Key Insights
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  AI-powered analysis of your social media performance
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <svg
                        className="h-4 w-4 text-blue-600 dark:text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Top Performer: {platformStats && platformStats.length > 0 ? 
                          platformStats.reduce((a: PlatformStats, b: PlatformStats) => 
                            parseFloat(a.engagement) > parseFloat(b.engagement) ? a : b
                          ).platform : 'No data available'
                        }
                      </h4>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        {platformStats && platformStats.length > 0 ? (
                          <>Highest engagement rate at {Math.max(...platformStats.map(s => parseFloat(s.engagement))).toFixed(1)}%.
                          Focus on creating more visual content to maintain momentum.</>
                        ) : 'No engagement data available'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                      <svg
                        className="h-4 w-4 text-purple-600 dark:text-purple-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900 dark:text-purple-100">Growth Opportunity</h4>
                      <div className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                        {platformStats && platformStats.length > 0 ? (
                          <>
                            {platformStats
                              .sort((a: PlatformStats, b: PlatformStats) => parseFloat(b.engagement) - parseFloat(a.engagement))
                              .slice(-1)[0].platform} shows room for improvement.
                            Increase posting frequency and engage with trending topics.
                          </>
                        ) : 'No platform data available'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
