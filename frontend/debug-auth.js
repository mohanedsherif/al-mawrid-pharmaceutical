// Debug Authentication Script
// Run this in the browser console to check authentication status

console.log('=== Authentication Debug Info ===\n');

// 1. Check tokens in localStorage
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

console.log('1. Token Storage:');
console.log('   Access Token:', accessToken ? '✓ Present' : '✗ Missing');
console.log('   Refresh Token:', refreshToken ? '✓ Present' : '✗ Missing');

if (accessToken) {
  // 2. Decode JWT token
  try {
    const parts = accessToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('\n2. Token Payload:');
      console.log('   Subject (email):', payload.sub);
      console.log('   Role:', payload.role || 'Not found');
      console.log('   Authorities:', payload.authorities || 'Not found');
      console.log('   Expires:', new Date(payload.exp * 1000).toLocaleString());
      console.log('   Is Expired:', new Date(payload.exp * 1000) < new Date() ? '✗ YES' : '✓ NO');
      
      // Check if admin
      const isAdmin = payload.role === 'ADMIN' || 
                     (payload.authorities && payload.authorities.some(auth => auth.includes('ADMIN')));
      console.log('   Is Admin:', isAdmin ? '✓ YES' : '✗ NO');
    }
  } catch (e) {
    console.error('   Error decoding token:', e);
  }
}

// 3. Check Redux state (if available)
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log('\n3. Redux State:');
  console.log('   Redux DevTools available - check Redux tab for auth state');
}

// 4. Test API call
console.log('\n4. Testing API Call:');
fetch('http://localhost:8080/api/admin/dashboard/stats', {
  method: 'GET',
  headers: {
    'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('   Status:', response.status, response.statusText);
  if (response.status === 403) {
    console.log('   ✗ 403 Forbidden - Authentication/Authorization failed');
    console.log('   → Solution: Log in as admin (admin@admin.com / Admin123!)');
  } else if (response.status === 200) {
    console.log('   ✓ Success - You are authenticated as admin!');
  }
  return response.json();
})
.then(data => {
  if (data) {
    console.log('   Response:', data);
  }
})
.catch(error => {
  console.error('   Error:', error);
});

console.log('\n=== End Debug Info ===');


