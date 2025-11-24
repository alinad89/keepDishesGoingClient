import { EFFECTIVE_API_URL, USE_MOCK_API, buildUrl, DEVELOPER_ENDPOINTS } from './config';

/**
 * Debug utility to verify API configuration
 * Call this from the browser console: window.debugAPI()
 */
export function debugAPI() {
  console.group('API Configuration Debug');

  console.log('Environment Variables:');
  console.log('  VITE_USE_MOCK_API:', import.meta.env.VITE_USE_MOCK_API);
  console.log('  VITE_MOCK_API_URL:', import.meta.env.VITE_MOCK_API_URL);
  console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL);

  console.log('\nComputed Values:');
  console.log('  USE_MOCK_API:', USE_MOCK_API);
  console.log('  EFFECTIVE_API_URL:', EFFECTIVE_API_URL);

  console.log('\nEndpoint Examples:');
  console.log('  Games endpoint:', DEVELOPER_ENDPOINTS.games);
  console.log('  Full games URL:', buildUrl(DEVELOPER_ENDPOINTS.games));
  console.log('  Achievement (game-001):', buildUrl(DEVELOPER_ENDPOINTS.gameAchievements('game-001')));

  console.log('\nTest Fetch:');
  const gamesUrl = buildUrl(DEVELOPER_ENDPOINTS.games);
  fetch(gamesUrl)
    .then(res => {
      console.log('  ✅ Status:', res.status, res.statusText);
      return res.json();
    })
    .then(data => {
      console.log(`  ✅ Received ${data.length} games:`, data);
    })
    .catch(err => {
      console.error('  ❌ Fetch failed:', err.message);
    });

  console.groupEnd();
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAPI = debugAPI;
}
