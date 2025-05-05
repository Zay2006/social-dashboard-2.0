"use client"

import { useState } from 'react';
import { addDays, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AreaChart } from "@/components/charts/area-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlatformStatsCard } from "@/components/platform-stats-card"
import { cn } from "@/lib/utils"
import { fadeIn, slideUp } from "@/lib/animations"
import { chartColors, statColors } from "@/lib/colors"
import { DateRangePicker } from '@/components/date-range-picker';
import { PlatformSelect } from '@/components/platform-select';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';
import type { ReactNode } from 'react';

export default function DashboardPage() {
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { platformStats, engagementData, isLoading, error } = useDashboardData(
    platform,
    dateRange?.from,
    dateRange?.to
  );

  // Transform platform stats for comparison chart
  const platformComparison = platformStats.map(stat => ({
    name: stat.platform,
    value: parseInt(stat.followers.replace(/[^0-9]/g, ''), 10)
  }));

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
          {isLoading ? (
            <div className="col-span-4 text-center">Loading platform stats...</div>
          ) : error ? (
            <div className="col-span-4 text-center text-red-500">{error}</div>
          ) : (
            platformStats.map((stats: any) => {
              const platformIcons: Record<string, ReactNode> = {
                Twitter: (
                  <svg key="twitter" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
                Instagram: (
                  <svg key="instagram" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                ),
                LinkedIn: (
                  <svg key="linkedin" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                ),
                TikTok: (
                  <svg key="tiktok" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                ),
                YouTube: (
                  <svg key="youtube" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                ),
                Pinterest: (
                  <svg key="pinterest" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                ),
              };

              return (
                <div 
                  key={stats.platform}
                  className={`p-4 rounded-lg border bg-card text-card-foreground shadow-sm ${
                    platform !== 'all' && platform !== stats.platform.toLowerCase() ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {platformIcons[stats.platform] || null}
                    <h3 className="font-medium">{stats.platform}</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="text-3xl font-bold">{stats.followers}</div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Followers
                      </p>
                      <p className="text-sm font-medium">
                        {stats.engagement} Engagement
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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

        {/* Insights Section */}
        <div className={cn("mt-8", fadeIn(400))}>
          <h2 className="mb-4 text-2xl font-bold">Performance Insights</h2>
          <div className={cn("grid gap-4 md:grid-cols-2", slideUp(400))}>
            <LineChart
              title="Growth Comparison"
              description="Current period vs previous period performance"
              data={engagementData.map(item => ({
                name: item.name,
                current: item.value,
                previous: Math.floor(item.value * 0.85)
              }))}
              colors={[chartColors.line.current, chartColors.line.previous]}
            />
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-powered analysis of your social media performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn("grid gap-4 md:grid-cols-2", fadeIn())}>
                  <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", slideUp(200))}>
                    <PlatformStatsCard
                      title="Total Followers"
                      value="45,231"
                      trend={20.1}
                      icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      }
                      color="#0ea5e9"
                    />
                    <PlatformStatsCard
                      title="Engagement Rate"
                      value="15.2%"
                      trend={7.2}
                      icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20V10" />
                          <path d="M18 20V4" />
                          <path d="M6 20v-4" />
                        </svg>
                      }
                      color="#10b981"
                    />
                    <PlatformStatsCard
                      title="Total Posts"
                      value="342"
                      trend={3.5}
                      icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      }
                      color="#8b5cf6"
                    />
                    <PlatformStatsCard
                      title="Active Platforms"
                      value="4"
                      trend={33.3}
                      icon={
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 11a9 9 0 0 1 9 9" />
                          <path d="M4 4a16 16 0 0 1 16 16" />
                          <circle cx="5" cy="19" r="1" />
                        </svg>
                      }
                      color={statColors.platforms.primary}
                    />
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-500/20">
                      <svg
                        className="h-4 w-4 text-green-500"
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
                      <h4 className="font-medium">Growth Trend</h4>
                      <p className="text-sm text-muted-foreground">
                        Your follower growth rate is 15% higher than the previous period,
                        indicating strong audience expansion.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-500/20">
                      <svg
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 1 2 2h2a2 2 0 0 1 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Engagement Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Instagram shows the highest engagement rate at 18.7%. Consider
                        focusing more content efforts on this platform.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-500/20">
                      <svg
                        className="h-4 w-4 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Content Performance</h4>
                      <p className="text-sm text-muted-foreground">
                        Your most successful content types are infographics and video
                        content, averaging 25% higher engagement.
                      </p>
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
