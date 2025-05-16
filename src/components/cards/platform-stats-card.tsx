"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { trendColors } from '@/lib/colors';

import { Platform, PLATFORM_DISPLAY_NAMES } from '@/types/platform';

interface PlatformStatsCardProps {
  platform: Platform;
  followers: number;
  engagement: number;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}

export function PlatformStatsCard({ platform, followers, engagement, trend, className }: PlatformStatsCardProps) {


  const trendColor = trend === 'up' ? trendColors.green : trend === 'down' ? trendColors.red : trendColors.neutral;
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {PLATFORM_DISPLAY_NAMES[(platform as unknown as string).toLowerCase() as keyof typeof PLATFORM_DISPLAY_NAMES] || String(platform)}
        </CardTitle>
        <CardDescription>Platform Statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Followers</p>
            <div className="text-3xl font-bold">{followers.toLocaleString()}</div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{engagement.toFixed(1)}% Engagement</p>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {engagement.toFixed(2)}%
              <span className={cn('text-sm', trendColor)}>{trendIcon}</span>
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
