/**
 * Global Teardown for Playwright Tests
 * Cleanup after all tests are completed
 */
async function globalTeardown() {
  console.log('🧹 Starting global teardown...');
  
  // Cleanup auth files
  const fs = await import('fs');
  const authFiles = [
    'e2e/.auth/admin.json',
    'e2e/.auth/operator.json'
  ];
  
  for (const authFile of authFiles) {
    try {
      if (fs.existsSync(authFile)) {
        fs.unlinkSync(authFile);
        console.log(`🗑️ Cleaned up ${authFile}`);
      }
    } catch (error) {
      console.warn(`⚠️ Could not cleanup ${authFile}:`, error);
    }
  }
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
