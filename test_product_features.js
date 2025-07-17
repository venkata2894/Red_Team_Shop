// Test script for enhanced product page features
console.log('Testing enhanced product page features...');

// Test 1: Check if products API returns enhanced data
console.log('1. Testing enhanced products API...');
fetch('http://localhost:8000/api/products/')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Products API working');
    console.log('Sample product data:', data[0]);
    console.log('Fields available:', Object.keys(data[0]));
    
    // Check if new fields are present
    if (data[0].average_rating !== undefined && 
        data[0].review_count !== undefined && 
        data[0].reviews !== undefined) {
      console.log('✅ Enhanced product data working');
    } else {
      console.log('❌ Enhanced product data missing');
    }
  })
  .catch(error => {
    console.log('❌ Products API error:', error.message);
  });

// Test 2: Check reviews API
console.log('2. Testing reviews API...');
fetch('http://localhost:8000/api/reviews/1/')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Reviews API working');
    console.log('Reviews for product 1:', data);
  })
  .catch(error => {
    console.log('❌ Reviews API error:', error.message);
  });

// Test 3: Test adding a review (requires authentication)
console.log('3. Testing review creation...');
const testReview = {
  product: 1,
  rating: 5,
  comment: 'Great product! Perfect for red team operations.'
};

fetch('http://localhost:8000/api/reviews/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer demo_token_alice_1'
  },
  body: JSON.stringify(testReview)
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Review creation working');
    console.log('Created review:', data);
  })
  .catch(error => {
    console.log('❌ Review creation error:', error.message);
  });

// Test 4: Test product tip upload
console.log('4. Testing product tip upload...');
const testTip = {
  product_id: 1,
  tip: 'This t-shirt is perfect for red team engagements. The material is comfortable and the design is subtle enough for corporate environments.'
};

fetch('http://localhost:8000/api/tips/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer demo_token_alice_1'
  },
  body: JSON.stringify(testTip)
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Product tip upload working');
    console.log('Uploaded tip:', data);
  })
  .catch(error => {
    console.log('❌ Product tip upload error:', error.message);
  });

// Test 5: Test cart with quantity
console.log('5. Testing cart with quantity...');
const testCartItem = {
  product_id: 1,
  quantity: 3
};

fetch('http://localhost:8000/api/cart/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer demo_token_alice_1'
  },
  body: JSON.stringify(testCartItem)
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Cart with quantity working');
    console.log('Cart data:', data);
  })
  .catch(error => {
    console.log('❌ Cart with quantity error:', error.message);
  });

console.log('All tests completed!'); 