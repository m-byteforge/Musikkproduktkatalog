// Fetch products from the server and dynamically add product cards
const queryParams = new URLSearchParams(window.location.search);
const category = queryParams.get('category');
let sortBy = queryParams.get('sortBy');

const productsUrl = `/products?category=${category}&sortBy=${sortBy}`;

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

// Function to create a product card
function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('product-card');

  const price = typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2);

  card.innerHTML = `
    <img src="/images/${product.images_name}.png" alt="${product.name}" class="product-image">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p class="product-price">Price: $${price}</p>
  `;

  return card;
}

// Handle sort change
document.getElementById('applySort').addEventListener('click', () => {
  const sortSelect = document.getElementById('sortSelect');
  sortBy = sortSelect.value;

  // Update the URL with the new sort parameter
  const newUrl = `/products?category=${category}&sortBy=${sortBy}`;
  window.location.href = newUrl;
});

// Function to open a sidebar and load content dynamically
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

// Function to close a sidebar
function closeSidebar(sidebarId) {
  const sidebar = document.getElementById(sidebarId);
  sidebar.style.width = '0';
}
