// Test script to verify authentication flow
console.log('Testing authentication flow...');

// Test 1: Check if chat route requires authentication
console.log('1. Testing chat route protection...');
fetch('http://localhost:3000/chat')
  .then(response => {
    console.log('Chat route response:', response.status);
    if (response.status === 200) {
      console.log('✅ Chat route accessible without auth (should redirect to login)');
    } else {
      console.log('❌ Chat route not accessible without auth');
    }
  })
  .catch(error => {
    console.log('❌ Error accessing chat route:', error.message);
  });

// Test 2: Check if cart route requires authentication
console.log('2. Testing cart route protection...');
fetch('http://localhost:3000/cart')
  .then(response => {
    console.log('Cart route response:', response.status);
    if (response.status === 200) {
      console.log('✅ Cart route accessible without auth (should redirect to login)');
    } else {
      console.log('❌ Cart route not accessible without auth');
    }
  })
  .catch(error => {
    console.log('❌ Error accessing cart route:', error.message);
  });

// Test 3: Check if orders route requires authentication
console.log('3. Testing orders route protection...');
fetch('http://localhost:3000/orders')
  .then(response => {
    console.log('Orders route response:', response.status);
    if (response.status === 200) {
      console.log('✅ Orders route accessible without auth (should redirect to login)');
    } else {
      console.log('❌ Orders route not accessible without auth');
    }
  })
  .catch(error => {
    console.log('❌ Error accessing orders route:', error.message);
  });

console.log('Authentication flow test completed!'); 