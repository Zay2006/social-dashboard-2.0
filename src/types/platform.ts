export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  stats?: {
    followers: string;
    engagement: string;
  };
}

export type PlatformName = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'all';
