export interface Platform {
  id: number;
  platform_name: string;
  followers_count: number;
  engagement_count?: number;
  follower_growth?: number;
}

export type PlatformName = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'pinterest' | 'tiktok' | 'all';

export const PLATFORM_ICONS: Record<string, string> = {
  twitter: 'twitter',
  instagram: 'instagram',
  linkedin: 'linkedin',
  facebook: 'facebook',
  youtube: 'youtube',
  pinterest: 'pinterest',
  tiktok: 'tiktok'
};

export const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
  twitter: 'Twitter',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
  tiktok: 'TikTok'
};
