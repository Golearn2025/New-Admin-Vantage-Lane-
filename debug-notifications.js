// Quick debug script pentru notifications
console.log('🔍 DEBUGGING NOTIFICATIONS...');

// Test in browser console:
// 1. Click pe clopotel
// 2. Click pe delete button
// 3. Uita-te la console logs
// 4. Should see: "🗑️ PROVIDER DELETE CALLED: [id]"

console.log('Attach this to window for debugging:');
window.debugNotifications = {
  testDelete: (id) => {
    console.log('🧪 TEST DELETE:', id);
    // This will help debug if the callbacks are working
  },
  showNotifications: () => {
    console.log('📋 Current notifications:', window.notificationsProvider?.notifications);
  }
};

console.log('Use: window.debugNotifications.testDelete("some-id")');
