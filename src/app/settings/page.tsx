"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/lib/contexts/auth-context';

interface Platform {
  id: number;
  platform_name: string;
  followers_count: number;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [newPlatform, setNewPlatform] = useState({ name: '', followersCount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const addPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform_name: newPlatform.name,
          followersCount: parseInt(newPlatform.followersCount)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add platform');
      }

      // Refresh platforms list
      fetchPlatforms();
      setNewPlatform({ name: '', followersCount: '' });
    } catch {
      setError('Failed to add platform');
    } finally {
      setLoading(false);
    }
  };

  const removePlatform = async (platformId: number) => {
    try {
      const response = await fetch(`/api/platforms/${platformId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove platform');
      }

      // Refresh platforms list
      fetchPlatforms();
    } catch {
      setError('Failed to remove platform');
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms');
      if (!response.ok) throw new Error('Failed to fetch platforms');
      const data = await response.json();
      setPlatforms(data);
    } catch {
      setError('Failed to load platforms');
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="grid gap-8">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label>Theme Mode</Label>
                <ModeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Platform Management */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Management</CardTitle>
              <CardDescription>Add or remove social media platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addPlatform} className="space-y-4 mb-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      placeholder="e.g., Instagram"
                      value={newPlatform.name}
                      onChange={(e) => setNewPlatform(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followers-count">Followers Count</Label>
                    <Input
                      id="followers-count"
                      type="number"
                      placeholder="e.g., 1000"
                      value={newPlatform.followersCount}
                      onChange={(e) => setNewPlatform(prev => ({ ...prev, followersCount: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Platform'}
                </Button>
              </form>

              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{platform.platform_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {platform.followers_count.toLocaleString()} followers
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePlatform(platform.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Settings */}
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <Label>Username</Label>
                  <p className="text-muted-foreground">{user?.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
