// app.js

const queryParams = new URLSearchParams(window.location.search);
const category = queryParams.get('category');
let sortBy = queryParams.get('sortBy');
const priceRange = document.getElementById('priceRange');
const minPriceOutput = document.getElementById('minPriceOutput');
const maxPriceOutput = document.getElementById('maxPriceOutput');
const searchInput = document.getElementById('search');

document.addEventListener('DOMContentLoaded', () => {

  const savedMinPrice = sessionStorage.getItem('minPrice');
  const savedMaxPrice = sessionStorage.getItem('maxPrice');

  if (savedMinPrice !== null && savedMaxPrice !== null) {
    priceRange.value = savedMinPrice;
    updatePriceOutputs();
    filterProductsByPrice(parseInt(savedMinPrice));
  }
});
const productsUrl = '/products';  // Simplify the URL since it's already handled on the server side

fetch(productsUrl)
  .then(response => response.json())
  .then(products => {
    const productContainer = document.getElementById('product-container');
    products.forEach(product => {
      const card = createProductCard(product);
      productContainer.appendChild(card);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

// ... (previous code)
function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

  const price = formatPrice(product.price);

  card.innerHTML = `
    <img src="/images/${product.images_name}.png" alt="${product.name}" class="product-image">
    <h5>${product.name}</h5>
 
    <p class="product-price">Price: ${price}</p>
    <button onclick="viewProductDetails('${product._id}')">View Details</button>
  `;

  return card;
}




function formatPrice(price) {
  return typeof price === 'number' ? `$${price.toFixed(2)}` : `$${parseFloat(price).toFixed(2)}`;
}

document.getElementById('searchButton').addEventListener('click', handleSearch);
searchInput.addEventListener('input', handleSearch);

function handleSearch() {
  const searchValue = searchInput.value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const productName = card.querySelector('h5').innerText.toLowerCase();

    if (productName.includes(searchValue)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

priceRange.addEventListener('input', handlePriceRangeChange);
priceRange.addEventListener('mouseup', handleRangeMouseUp);

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
  productCards.forEach(card => {
    card.style.display = 'block';
  });
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
  const sidebarContent = sidebar.querySelector('.sidebar-content');

  fetch(pageUrl)
    .then(response => response.text())
    .then(html => {
      sidebarContent.innerHTML = html;
      sidebar.style.width = '250px';
    })
    .catch(error => console.error('Error fetching content:', error));
}

function closeSidebar(sidebarId) {
  const sidebar = document.getElementById(sidebarId);
  sidebar.style.width = '0';
}


function viewProductDetails(productId) {
  if (productId) {
    const productDetailsUrl = `/product/detail/${productId}`;
    window.location.href = productDetailsUrl;
  } else {
    console.error('Invalid productId:', productId);
  }
}

