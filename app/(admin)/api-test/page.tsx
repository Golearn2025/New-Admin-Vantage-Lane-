/**
 * API Test Page
 * 
 * Test both OLD and NEW notification methods
 * Compare security, logging, and functionality
 */

'use client';

import { useState } from 'react';
import { Button, Card, Input, Badge } from '@vantage-lane/ui-core';
import { sendNotificationToDriver } from '@entities/notification';
import { sendNotificationToDriverClient } from '@entities/notification';
import styles from './page.module.css';

export default function APITestPage() {
  const [driverId, setDriverId] = useState('');
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test message from API');
  
  const [oldLoading, setOldLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  
  const [oldResult, setOldResult] = useState<string | null>(null);
  const [newResult, setNewResult] = useState<string | null>(null);
  
  const [oldError, setOldError] = useState<string | null>(null);
  const [newError, setNewError] = useState<string | null>(null);

  // Test OLD method (direct function call - INSECURE!)
  const testOldMethod = async () => {
    setOldLoading(true);
    setOldResult(null);
    setOldError(null);
    
    try {
      const result = await sendNotificationToDriver(driverId, title, message);
      setOldResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setOldError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setOldLoading(false);
    }
  };

  // Test NEW method (API route - SECURE!)
  const testNewMethod = async () => {
    setNewLoading(true);
    setNewResult(null);
    setNewError(null);
    
    try {
      const result = await sendNotificationToDriverClient(driverId, title, message);
      setNewResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setNewError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setNewLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🧪 API Test Page</h1>
        <p>Compare OLD vs NEW notification methods</p>
      </div>

      {/* Input Form */}
      <Card className={styles.inputCard || ''}>
        <h2>Test Parameters</h2>
        
        <div className={styles.formGroup}>
          <label>Driver ID (UUID):</label>
          <Input
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
          />
          <small>Get driver ID from drivers table in Supabase</small>
        </div>

        <div className={styles.formGroup}>
          <label>Notification Title:</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Message:</label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />
        </div>
      </Card>

      {/* Test Buttons */}
      <div className={styles.testButtons}>
        <Card className={styles.testCard || ''}>
          <div className={styles.testHeader}>
            <h3>❌ OLD Method (INSECURE)</h3>
            <Badge color="danger">Direct Function Call</Badge>
          </div>
          
          <p>
            Uses: <code>sendNotificationToDriver()</code>
            <br />
            Security: ⚠️ No auth check, no audit log, vulnerable
          </p>
          
          <Button 
            onClick={testOldMethod}
            disabled={!driverId || oldLoading}
            variant="secondary"
          >
            {oldLoading ? 'Sending...' : 'Test OLD Method'}
          </Button>

          {oldResult && (
            <div className={styles.result}>
              <h4>✅ Success:</h4>
              <pre>{oldResult}</pre>
            </div>
          )}

          {oldError && (
            <div className={styles.error}>
              <h4>❌ Error:</h4>
              <pre>{oldError}</pre>
            </div>
          )}
        </Card>

        <Card className={styles.testCard || ''}>
          <div className={styles.testHeader}>
            <h3>✅ NEW Method (SECURE)</h3>
            <Badge color="success">API Route</Badge>
          </div>
          
          <p>
            Uses: <code>POST /api/v1/notifications/send-to-driver</code>
            <br />
            Security: ✅ Auth + Authorization + Validation + Audit
          </p>
          
          <Button 
            onClick={testNewMethod}
            disabled={!driverId || newLoading}
            variant="primary"
          >
            {newLoading ? 'Sending...' : 'Test NEW Method (SECURE)'}
          </Button>

          {newResult && (
            <div className={styles.result}>
              <h4>✅ Success:</h4>
              <pre>{newResult}</pre>
            </div>
          )}

          {newError && (
            <div className={styles.error}>
              <h4>❌ Error:</h4>
              <pre>{newError}</pre>
            </div>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <Card className={styles.instructions || ''}>
        <h3>📋 Test Instructions:</h3>
        <ol>
          <li>
            <strong>Get Driver ID:</strong>
            <br />
            Open Supabase Dashboard → Table Editor → drivers table
            <br />
            Copy a driver ID (UUID format)
          </li>
          <li>
            <strong>Test OLD method:</strong>
            <br />
            Click &ldquo;Test OLD Method&rdquo; - should work but NO security
          </li>
          <li>
            <strong>Test NEW method:</strong>
            <br />
            Click &ldquo;Test NEW Method (SECURE)&rdquo; - should work WITH security
          </li>
          <li>
            <strong>Verify in Driver account:</strong>
            <br />
            Login as driver (van.aron@vantagelane.com)
            <br />
            Check notifications - should see 2 notifications (from both tests)
          </li>
          <li>
            <strong>Check audit_logs:</strong>
            <br />
            Supabase → audit_logs table
            <br />
            Should see entry ONLY for NEW method (not OLD)
          </li>
        </ol>
      </Card>

      {/* Current User Info */}
      <Card className={styles.userInfo || ''}>
        <h3>👤 Current Test User:</h3>
        <p>
          <strong>Admin:</strong> catalin.aron@vantagelane.com
          <br />
          <strong>Driver:</strong> van.aron@vantagelane.com
        </p>
      </Card>
    </div>
  );
}
