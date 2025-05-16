'use client';

import { useState, useEffect } from 'react';

interface Platform {
  id: number;
  platform_name: string;
  followers_count: number;
}

export default function PlatformManager() {

  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followersCount, setFollowersCount] = useState('');

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms');
      if (!response.ok) {
        throw new Error('Failed to fetch platforms');
      }
      const data = await response.json();
      setPlatforms(data);
    } catch {
      setError('Failed to load platforms');
    } finally {
      setLoading(false);
    }
  };

  const addPlatform = async (platformId: number) => {
    try {
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId,
          followersCount: parseInt(followersCount) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add platform');
      }

      fetchPlatforms();
      setFollowersCount('');
    } catch {
      setError('Failed to add platform');
    }
  };

  const removePlatform = async (platformId: number) => {
    try {
      const response = await fetch('/api/platforms', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platformId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove platform');
      }

      fetchPlatforms();
    } catch {
      setError('Failed to remove platform');
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Manage Platforms</h2>
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between bg-gray-700 p-4 rounded"
          >
            <div>
              <span className="text-white font-medium">{platform.platform_name}</span>
              {platform.followers_count !== null && (
                <span className="ml-2 text-gray-400">
                  {platform.followers_count.toLocaleString()} followers
                </span>
              )}
            </div>
            {platform.followers_count === null ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Followers count"
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                />
                <button
                  onClick={() => addPlatform(platform.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                onClick={() => removePlatform(platform.id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
