/**
 * Debug Profile Page
 * 
 * Debug page pentru a vedea ce date primește useCurrentUser și useProfileData
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import { useProfileData } from '@features/shared/settings-profile';
import { Card } from '@vantage-lane/ui-core';
import { createClient } from '@/lib/supabase/client';

export default function DebugProfilePage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const { profile, loading: profileLoading, error: profileError } = useProfileData(user?.auth_user_id);
  const [authUser, setAuthUser] = useState<unknown>(null);
  const [organizationsData, setOrganizationsData] = useState<unknown>(null);

  useEffect(() => {
    const getAuthUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setAuthUser(session?.user || null);
      
      // Also check organizations table for operators
      if (session?.user?.id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .eq('org_type', 'operator');
        
        setOrganizationsData({ data: orgData, error: orgError });
      }
    };
    getAuthUser();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🔍 Profile Debug Page</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Auth Session Info */}
        <Card>
          <h2>🔐 Supabase Auth Session</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {JSON.stringify(authUser, null, 2)}
          </pre>
        </Card>

        {/* useCurrentUser Info */}
        <Card>
          <h2>👤 useCurrentUser Result</h2>
          <p><strong>Loading:</strong> {userLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {userError?.message || 'None'}</p>
          <h3>User Data:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </Card>

        {/* useProfileData Info */}
        <Card>
          <h2>📄 useProfileData Result</h2>
          <p><strong>UserID passed:</strong> {user?.auth_user_id || 'undefined'}</p>
          <p><strong>Loading:</strong> {profileLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {profileError || 'None'}</p>
          <h3>Profile Data:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {JSON.stringify(profile, null, 2)}
          </pre>
        </Card>

        {/* Organizations Data */}
        <Card>
          <h2>🏢 Organizations Table Query</h2>
          <p><strong>Query:</strong> organizations WHERE auth_user_id = {(authUser as { id?: string })?.id} AND org_type = &apos;operator&apos;</p>
          <h3>Organizations Data:</h3>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
            {JSON.stringify(organizationsData, null, 2)}
          </pre>
        </Card>

        {/* Console Logs Instruction */}
        <Card>
          <h2>📝 Console Logs</h2>
          <p>Verifică și <strong>Console</strong> (F12) pentru debug logs:</p>
          <ul>
            <li>🔍 USER DEBUG: Setting user info for role: [role] [userInfo]</li>
            <li>🔍 PROFILE DEBUG: Fetching profile for userId: [userId]</li>
            <li>🔍 PROFILE DEBUG: Query result: [result]</li>
          </ul>
        </Card>

      </div>
    </div>
  );
}
