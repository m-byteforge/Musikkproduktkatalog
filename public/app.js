const queryParams = new URLSearchParams(window.location.search);
const category = queryParams.get('category');
let sortBy = queryParams.get('sortBy');
const priceRange = document.getElementById('priceRange');
const minPriceOutput = document.getElementById('minPriceOutput');
const maxPriceOutput = document.getElementById('maxPriceOutput');
const searchInput = document.getElementById('search');
const cartItemsKey = 'shoppingCart';

function goBack() {
  window.history.back();
}

function updateCartButton() {
  const cartButton = document.getElementById('cartButton');
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
  const totalQuantity = existingCart.reduce((total, item) => total + item.quantity, 0);

  cartButton.innerText = totalQuantity > 0 ? `🛒 Cart (${totalQuantity})` : '🛒 Cart';
}

function updateCartQuantity() {
  const cartQuantity = document.getElementById('cartQuantity');
  if (cartQuantity) {
    const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
    const totalQuantity = existingCart.reduce((total, item) => total + item.quantity, 0);
    cartQuantity.innerText = totalQuantity;
  }
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

  const price = formatPrice(product.price);

  card.innerHTML = `
    <img src="/images/${product.images_name}.png" alt="${product.name}" class="product-image">
  
    <h5>${product.name}</h5>
    <p>${product.description}</p>
    <p class="product-price">Price: ${price}</p>
    <button onclick="viewProductDetails('${product.id}')">View Details</button>
    <button onclick="addToCart('${product.id}')">Buy</button>
    
  `;

  return card;
}

function formatPrice(price) {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : `$${parseFloat(price).toFixed(2)}`;
}

function handleSearch() {
  const searchValue = searchInput.value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const productName = card.querySelector('h5').innerText.toLowerCase();
    card.style.display = productName.includes(searchValue) ? 'block' : 'none';
  });
}

function handlePriceRangeChange() {
  updatePriceOutputs();
  sessionStorage.setItem('minPrice', priceRange.value);
  filterProductsByPrice(parseInt(priceRange.value));
}

function handleRangeMouseUp() {
  if (priceRange.value === '100') {
    showAllProducts();
  }
}

function showAllProducts() {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => (card.style.display = 'block'));
}

function updatePriceOutputs() {
  minPriceOutput.innerText = `$${priceRange.value}`;
  maxPriceOutput.innerText = `$1000`;
}

function filterProductsByPrice(minPrice) {
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const productPrice = parseFloat(card.querySelector('.product-price').innerText.replace('Price: $', ''));

    card.style.display = productPrice >= minPrice && productPrice <= 1000 ? 'block' : 'none';
  });
}

function openSidebar(sidebarId, pageUrl) {
  const sidebar = document.getElementById(sidebarId);

  if (sidebarId === 'loginSidebar' || sidebarId === 'registerSidebar') {
    window.location.href = pageUrl;
  } else {
    const sidebarContent = sidebar.querySelector('.sidebar-content');

    fetch(pageUrl)
      .then(response => response.text())
      .then(html => {
        sidebarContent.innerHTML = html;
        sidebar.style.width = '250px';
      })
      .catch(error => console.error('Error fetching content:', error));
  }
}

function closeSidebar(sidebarId) {
  const sidebar = document.getElementById(sidebarId);
  sidebar.style.width = '0';
}

function viewProductDetails(productId) {
  if (productId) {
    const productDetailsUrl = `/product/details/${productId}`;
    window.location.href = productDetailsUrl;
  } else {
    console.error('Invalid productId:', productId);
  }
}

function addToCart(productId) {
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
  const product = findProductById(productId);

  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

  const existingItem = existingCart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    existingCart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem(cartItemsKey, JSON.stringify(existingCart));

  updateCartButton();
  updateCartQuantity();
  updateCartUI();

  openNotification(product);
}

function openNotification(product) {
  const notification = document.createElement('div');
  notification.classList.add('notification', 'product-added-notification');
  notification.innerHTML = `
    <p>${product.name} has been added to your cart!</p>
    <button onclick="goToShoppingCart()">Go to Cart</button>
    
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);

  notification.style.display = 'block';
}

function findProductById(productId) {
  const foundProduct = products.find(product => product.id === parseInt(productId));
  return foundProduct || null;
}

function updateCartUI() {
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

  let total = 0;

  for (const item of existingCart) {
    total += item.quantity * item.price;
  }

  const totalElement = document.getElementById('total-price');
  totalElement.textContent = total.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  const savedMinPrice = sessionStorage.getItem('minPrice');
  const savedMaxPrice = sessionStorage.getItem('maxPrice');

  if (savedMinPrice !== null && savedMaxPrice !== null) {
    priceRange.value = savedMinPrice;
    updateCartUI();
    updatePriceOutputs();
    updateCartButton();
    loadShoppingCart();

    filterProductsByPrice(parseInt(savedMinPrice));
  }

  document.getElementById('searchButton').addEventListener('click', handleSearch);
  document.getElementById('backButton').addEventListener('click', goBack);
  priceRange.addEventListener('input', handlePriceRangeChange);
  priceRange.addEventListener('mouseup', handleRangeMouseUp);

  updateCartQuantity();
  updateCartButton();
  fetchProducts();
});

const productsUrl = '/products';
let products = [];

function fetchProducts() {
  fetch(productsUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      products = data;
      const productContainer = document.getElementById('product-container');
      products.forEach(product => {
        const card = createProductCard(product);
        productContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching products:', error));

  updateCartQuantity();
}

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsKey = 'shoppingCart';

  const emptyCartButton = document.getElementById('empty-cart-button');
  const checkoutButton = document.getElementById('checkout-button');

  emptyCartButton.addEventListener('click', emptyShoppingCart);
  checkoutButton.addEventListener('click', proceedToCheckout);

  updateShoppingCartUI();
});

function updateShoppingCartUI() {
  const cartItemsElement = document.getElementById('cart-items');
  const totalElement = document.getElementById('total-price');

  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  cartItemsElement.innerHTML = '';

  let total = 0;

  for (const item of shoppingCart) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <p>ID: ${item.id}</p>
      <p>Name: ${item.name}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Price per product: $${item.price}</p>
      <button class="delete-button" data-id="${item.id}">Delete</button>
    `;

    cartItemsElement.appendChild(cartItem);

    total += item.quantity * item.price;
  }

  totalElement.textContent = total.toFixed(2);

  const deleteButtons = document.querySelectorAll('.delete-button');
  for (const button of deleteButtons) {
    button.addEventListener('click', removeFromCart);
  }
}





searchInput.addEventListener('input', handleSearch);

function changeQuantity(productId, action) {
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
  const existingItem = existingCart.find(item => item.id === productId);

  if (existingItem) {
    if (action === 'increase') {
      existingItem.quantity += 1;
    } else if (action === 'decrease') {
      existingItem.quantity = Math.max(1, existingItem.quantity - 1);
    }

    localStorage.setItem(cartItemsKey, JSON.stringify(existingCart));
    alert('Quantity updated!');
    updateCartQuantity();
  } else {
    console.error('Product not found in the cart:', productId);
  }
}

function emptyShoppingCart() {
  localStorage.removeItem(cartItemsKey);
  sessionStorage.removeItem('cartQuantity');
  updateCartUI();
  updateCartButton();
  updateCartQuantity();
  location.reload();
}

function emptyShoppingCart() {
  localStorage.removeItem(cartItemsKey);
  sessionStorage.removeItem('cartQuantity');
  updateCartUI();
  updateCartButton();
}


function emptyShoppingCart() {
  localStorage.removeItem(cartItemsKey);
  updateCartUI();
  updateCartButton();
}


function emptyShoppingCart() {
  localStorage.removeItem(cartItemsKey);
  sessionStorage.removeItem('cartQuantity');
  updateCartUI();
  updateCartButton();
  updateCartQuantity();
}

function emptyShoppingCart() {
  const cartItemsKey = 'shoppingCart';
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

  if (existingCart.length > 0) {
    localStorage.removeItem(cartItemsKey);

    const cartItemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');

    cartItemsElement.innerHTML = '';
    totalElement.textContent = '0.00';

    showEmptyCartNotification();

    updateCartButton();
  }
}

function showEmptyCartNotification() {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerHTML = `
    <p>Your cart has been emptied!</p>

  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);

  notification.style.display = 'block';
}

function proceedToCheckout() {
  window.location.href = '/details';
}
function goHome() {
  window.location.href = '/';
}

var cartButton = document.getElementById('cart-button');

function updateCartButton(cartQuantity) {
  console.log('Updating cart button. Cart quantity:', cartQuantity);

  var cartButton = document.getElementById('cart-button');
  if (cartButton) {
    // Rest of the code...
  } else {
    console.error('Cart button element not found.');
  }
}


updateCartButton(0);


document.addEventListener('DOMContentLoaded', () => {
  updateShoppingCartUI();
});

function changeCartItemQuantity(productId, action) {
  console.log(`Changing quantity for product ${productId}. Action: ${action}`);
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
  const existingItem = existingCart.find(item => item.id === productId);

  if (existingItem) {
    if (action === 'increase') {
      existingItem.quantity += 1;
    } else if (action === 'decrease') {
      existingItem.quantity = Math.max(1, existingItem.quantity - 1);
    }

    localStorage.setItem(cartItemsKey, JSON.stringify(existingCart));
    updateShoppingCartUI();
    alert('Quantity updated!');
  } else {
    console.error('Product not found in the cart:', productId);
  }
}

function updateShoppingCartUI() {
  const cartItemsElement = document.getElementById('cart-items');
  const totalElement = document.getElementById('total-price');

  const shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

  cartItemsElement.innerHTML = '';

  let total = 0;

  for (const item of shoppingCart) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <p>ID: ${item.id}</p>
      <p>Name: ${item.name}</p>
      <p>Quantity: 
        <button onclick="changeCartItemQuantity(${item.id}, 'decrease')">-</button>
        <button onclick="changeCartItemQuantity(${item.id}, 'increase')">+</button>
      </p>
      <p>Price per product: $${item.price}</p>
      <button class="delete-button" data-id="${item.id}" onclick="removeFromCart(${item.id})">Delete</button>
    `;


    cartItemsElement.appendChild(cartItem);

    total += item.quantity * item.price;
  }

  totalElement.textContent = total.toFixed(2);

  const deleteButtons = document.querySelectorAll('.delete-button');
  for (const button of deleteButtons) {
    button.addEventListener('click', removeFromCart);
  }
}

function changeCartItemQuantity(productId, action) {
  console.log(`Changing quantity for product ${productId}. Action: ${action}`);
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
  const existingItem = existingCart.find(item => item.id === productId);

  if (existingItem) {
    if (action === 'increase') {
      existingItem.quantity += 1;
    } else if (action === 'decrease') {
      existingItem.quantity = Math.max(1, existingItem.quantity - 1);
    }

    localStorage.setItem(cartItemsKey, JSON.stringify(existingCart));
    updateShoppingCartUI();
    displayNotification('Quantity updated!');
  } else {
    console.error('Product not found in the cart:', productId);
  }
}
function displayNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerHTML = `<p>${message}</p>`;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);

  notification.style.display = 'block';
}
function removeFromCart(productId) {
  console.log(`Removing product ${productId} from the cart`);
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];
  const updatedCart = existingCart.filter(item => item.id !== productId);
  localStorage.setItem(cartItemsKey, JSON.stringify(updatedCart));
  
  // Update UI after removing item
  updateCartButton();
  updateCartQuantity();
  updateShoppingCartUI();
}


function proceedToCheckout() {
  window.location.href = '/checkout';
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();
  updateCartButton();
  fetchProducts();
  fetchUserData(); // Fetch user data when the page loads
});

// Fetch user data
async function fetchUserData() {
  try {
    const response = await fetch('/get-user-data'); // Assuming you have a route to get user data
    const userData = await response.json();

    // Update user information in the checkout page
    const customerNameSpan = document.getElementById('customerName');
    const customerEmailSpan = document.getElementById('customerEmail');

    if (customerNameSpan && customerEmailSpan) {
      customerNameSpan.innerText = userData.name || '';
      customerEmailSpan.innerText = userData.email || '';
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();
  updateCartButton();
  fetchProducts();
  fetchUserData();
  fetchShippingMethods(); // Fetch shipping methods when the page loads
});

// Fetch shipping methods
async function fetchShippingMethods() {
  try {
    const response = await fetch('/get-shipping-methods');
    const shippingMethods = await response.json();

    // Update the UI with shipping methods
    updateShippingMethodsUI(shippingMethods);
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
  }
}

function updateShippingMethodsUI(shippingMethods) {
  const shippingMethodsContainer = document.getElementById('shippingMethods');

  if (shippingMethodsContainer) {
    shippingMethodsContainer.innerHTML = '';

    shippingMethods.forEach(method => {
      const shippingMethodElement = document.createElement('div');
      shippingMethodElement.className = 'shipping-method';
      shippingMethodElement.innerHTML = `
        <input type="radio" name="shippingMethod" value="${method.id}">
        <label>${method.name} - $${method.price.toFixed(2)}</label>
      `;
      shippingMethodsContainer.appendChild(shippingMethodElement);
    });
  }
}

app.get('/get-shipping-methods', (req, res) => {
  try {
    // Retrieve shipping methods and prices from the database or another source
    const shippingMethods = [
      { name: 'Standard Shipping', price: 5.99 },
      { name: 'Express Shipping', price: 12.99 },
      // Add more shipping methods as needed
    ];

    res.json(shippingMethods);
  } catch (error) {
    console.error('Error retrieving shipping methods:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//----------------------------------------------------------------------------------------



function emptyShoppingCart() {
  const cartItemsKey = 'shoppingCart';
  const existingCart = JSON.parse(localStorage.getItem(cartItemsKey)) || [];

  if (existingCart.length > 0) {
    localStorage.removeItem(cartItemsKey);

    // Optionally, you can update the UI or provide a notification here
    alert('Shopping Cart has been emptied!');

    // Redirect to the home page or any other desired page
    window.location.href = '/';
  } 
}




