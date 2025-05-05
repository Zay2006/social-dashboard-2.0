"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { fadeIn, slideUp } from '@/lib/animations';
import { trendColors } from '@/lib/colors';

interface PlatformStatsCardProps {
  platform: string;
  followers: number;
  engagement: number;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}

export function PlatformStatsCard({ platform, followers, engagement, trend, className }: PlatformStatsCardProps) {
  const trendColor = trend === 'up' ? trendColors.green : trend === 'down' ? trendColors.red : trendColors.neutral;
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <Card className={cn('w-full', fadeIn, slideUp, className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold capitalize">{platform}</CardTitle>
        <CardDescription>Platform Statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Followers</p>
            <h3 className="text-2xl font-bold">{followers.toLocaleString()}</h3>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
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
