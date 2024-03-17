window.onload = async function () {
  try {
    // Fetch products from the server
    const products = await fetchData("/products");
    const productsContainer = document.getElementById("products");
    renderProducts(products, productsContainer);

    // Fetch user information and update navigation bar
    const user = await fetchData("/user");
    updateUserNavbar(user);

    // Load cart items if user is logged in
    if (user) {
      document.getElementById("new-product-card").style.display = "block"; // Display "Add New Product" card
      await loadCartItems(user.id);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Function to fetch data from the server
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

// Function to render product cards
function renderProducts(products, container) {
  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Function to create a product card
function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  // Product image
  const img = document.createElement("img");
  img.src = `/images/${product.images_name}.png`;
  img.alt = product.name;
  productCard.appendChild(img);

  // Product name
  const productName = document.createElement("h3");
  productName.textContent = product.name;
  productCard.appendChild(productName);

  // Product description
  const productDescription = document.createElement("p");
  productDescription.textContent = product.description;
  productCard.appendChild(productDescription);

  // Product price
  const productPrice = document.createElement("p");
  productPrice.textContent = `Price: $${product.price}`;
  productCard.appendChild(productPrice);

  // Download PDF button
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download PDF";
  downloadButton.addEventListener("click", async () => {
    try {
      const pdfBlob = await fetch(`/products/${product.id}/pdf`).then((res) =>
        res.blob()
      );
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  });
  productCard.appendChild(downloadButton);

  // Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    // Handle edit functionality
    // You can open a modal or navigate to an edit page
  });
  productCard.appendChild(editButton);

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
      );
      if (confirmDelete) {
        await deleteProduct(product.id);
        productCard.remove();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });
  productCard.appendChild(deleteButton);

  return productCard;
}

// Function to update navigation bar based on user authentication status
function updateUserNavbar(user) {
  const userNameContainer = document.getElementById("user-name-container");
  const logoutButton = document.getElementById("logout-button");

  if (user) {
    const welcomeMessage = document.createElement("p");
    welcomeMessage.textContent = `Welcome, ${user.username}`;
    userNameContainer.appendChild(welcomeMessage);
    logoutButton.style.display = "block";
  } else {
    const loginLink = createNavbarLink("/login", "Login");
    const registerLink = createNavbarLink("/register", "Register");
    const navBar = document.querySelector("nav ul");
    navBar.appendChild(loginLink);
    navBar.appendChild(registerLink);
    logoutButton.style.display = "none";
  }
}

// Function to create navigation bar link
function createNavbarLink(href, text) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  return link;
}

// Function to load cart items for a user
async function loadCartItems(userId) {
  try {
    const cartItems = await fetchData(`/users/${userId}/cart`);
    const shoppingCartSection = document.getElementById("shopping-cart");
    const cartItemsContainer = document.createElement("div");

    cartItems.forEach((item) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.textContent = `Product: ${item.product}, Quantity: ${item.quantity}`;
      cartItemsContainer.appendChild(cartItemElement);
    });

    shoppingCartSection.appendChild(cartItemsContainer);
  } catch (error) {
    console.error("Error loading cart items:", error);
  }
}

// Function to log out the user
function logout() {
  fetch("/logout", { method: "POST" })
    .then(() => (window.location.href = "/"))
    .catch((error) => console.error("Error logging out:", error));
}

// Function to add a new product
async function addNewProduct() {
  const newProduct = {
    name: document.getElementById("new-product-name").value,
    description: document.getElementById("new-product-description").value,
    images_name: document.getElementById("new-product-image-name").value,
    price: parseFloat(document.getElementById("new-product-price").value),
  };

  try {
    const response = await fetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      const product = await response.json();
      const productsContainer = document.getElementById("products");
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
      // Clear input fields after adding product
      document.getElementById("new-product-name").value = "";
      document.getElementById("new-product-description").value = "";
      document.getElementById("new-product-image-name").value = "";
      document.getElementById("new-product-price").value = "";
    } else {
      console.error("Failed to add product:", response.statusText);
      const errorMessage = await response.text();
      console.error("Error message:", errorMessage);
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

// Function to delete a product
async function deleteProduct(productId) {
  try {
    const response = await fetch(`/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Send the access token with the request
      },
    });

    if (response.ok) {
      // Handle success
      const result = await response.json();
      console.log(result.message); // Log the success message
    } else {
      console.error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
