import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface RecentConversation {
  id: string;
  user_id: string | null;
  title: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    conversations: 0,
    stacks: 0,
    recentConversations: [] as RecentConversation[],
    loading: true,
    error: null as string | null,
  });

  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users from 'profiles'
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (userError) throw userError;

        // Fetch total conversations
        const { count: convCount, error: convError } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true });
        if (convError) throw convError;

        // Fetch total stacks
        const { count: stackCount, error: stackError } = await supabase
          .from('saved_stacks')
          .select('*', { count: 'exact', head: true });
        if (stackError) throw stackError;

        // Fetch recent conversations (use title instead of summary)
        const { data: recentConvs, error: recentError } = await supabase
          .from('conversations')
          .select('id, user_id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        if (recentError) throw recentError;

        // Fetch users list (first 10)
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(10);
        if (usersError) throw usersError;
        setUsers(usersData || []);

        setStats({
          users: userCount || 0,
          conversations: convCount || 0,
          stacks: stackCount || 0,
          recentConversations: recentConvs || [],
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setStats((prev) => ({ ...prev, loading: false, error: err.message || String(err) }));
      }
    };
    fetchStats();
  }, []);

  if (stats.loading) return <div className="p-8">Loading...</div>;
  if (stats.error) return <div className="p-8 text-red-500">Error: {stats.error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.users}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Conversations</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.conversations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Stacks Created</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.stacks}</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Recent Conversations</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {stats.recentConversations.map((conv) => (
                <li key={conv.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="font-medium">{conv.user_id || 'N/A'}</span>
                  <span className="text-muted-foreground text-sm">{conv.title}</span>
                  <span className="text-xs text-muted-foreground">{conv.created_at}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">All systems operational.</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end">
        <Button variant="outline">Export Data</Button>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Users (latest 10)</h2>
        {stats.loading ? (
          <div>Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.email || 'N/A'}</td>
                    <td className="px-4 py-2">{user.full_name || 'N/A'}</td>
                    <td className="px-4 py-2">{user.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 