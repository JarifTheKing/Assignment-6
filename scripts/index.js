// console.log("Welcome to my world")



// Cart and D O M elements
let cart = [];
const plantsContainer = document.getElementById("plants-container");
const cartContainer = document.getElementById("cart-container");
const totalPriceEl = document.getElementById("total-price");



// show loading spinner
function showSpinner() {
  plantsContainer.innerHTML = `
    <div class="flex justify-center items-center p-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
    </div>
  `;
}



// load categories from API
function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then(res => res.json())
    .then(data => {
      displayCategories(data.categories);
    })
    .catch(err => console.error("Categories load error:", err));
}



// display category buttons
function displayCategories(categories) {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "block w-full text-left px-4 py-2 my-1 rounded hover:bg-green-200";
    btn.textContent = cat.category_name;

    btn.addEventListener("click", () => {
      // highlight active
      container.querySelectorAll("button").forEach(b => b.classList.remove("bg-green-700", "text-white"));
      btn.classList.add("bg-green-700", "text-white");

      loadTreesByCategory(cat.id);
    });

    container.appendChild(btn);
  });
}



// load trees by category
function loadTreesByCategory(categoryId) {
  showSpinner();

  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then(res => res.json())
    .then(data => {
      const trees = data.data || data.plants || [];
      displayTrees(trees);
    })
    .catch(err => {
      plantsContainer.innerHTML = `<p class="text-center text-red-600 py-10">Failed to load trees.</p>`;
      console.error(err);
    });
}




// display tree cards
function displayTrees(trees) {
  plantsContainer.innerHTML = "";
  const seen = new Set();

  trees.forEach(tree => {
    const name = tree.name || tree.plant_name || "Unknown Tree";
    if (seen.has(name)) return;
    seen.add(name);

    const image = tree.image || "./assets/default-tree.png";
    const category = tree.category || tree.plant_category || "Unknown";
    const price = tree.price || 0;
    const desc = tree.description || "";

    const card = document.createElement("div");
    card.className = "card bg-base-100 shadow-sm w-full";
    card.innerHTML = `
      <figure><img src="${image}" alt="${name}" class="w-full h-64 object-cover rounded-t-lg"></figure>
      <div class="card-body p-4">
        <h2 class="card-title cursor-pointer text-green-700 hover:underline">${name}</h2>
        <p>${desc.slice(0, 80)}...</p>
        <div class="card-actions justify-between mt-4">
          <div class="badge font-bold text-[#15803cee] bg-[#15803c1e]">${category}</div>
          <div class="badge font-bold">৳${price}</div>
        </div>
        <button class="btn w-full bg-[#15803D] text-white border-[#f1d800] rounded-full mt-4">Add to Cart</button>
      </div>
    `;

    plantsContainer.appendChild(card);

    card.querySelector("h2").addEventListener("click", () => openModal({ name, image, category, price, description: desc }));
    card.querySelector("button").addEventListener("click", () => addToCart({ name, price }));
  });
}




// cart functions
function addToCart(item) {
  cart.push(item);
  updateCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCart();
}

function updateCart() {
  if (!cartContainer || !totalPriceEl) return;

  cartContainer.innerHTML = "";

  cart.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b py-2";
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="flex items-center gap-2">
        <span>৳${item.price}</span>
        <button class="text-red-600 font-bold">❌</button>
      </div>
    `;
    div.querySelector("button").addEventListener("click", () => removeFromCart(idx));
    cartContainer.appendChild(div);
  });

  const total = cart.reduce((sum, t) => sum + t.price, 0);
  totalPriceEl.textContent = total;
}





// modal
function openModal(tree) {
  const modal = document.getElementById("tree-modal");
  modal.querySelector(".modal-title").textContent = tree.name;
  modal.querySelector(".modal-image").src = tree.image;
  modal.querySelector(".modal-image").alt = tree.name;
  modal.querySelector(".modal-category").textContent = tree.category;
  modal.querySelector(".modal-price").textContent = tree.price;
  modal.querySelector(".modal-description").textContent = tree.description;

  modal.classList.remove("hidden");
}



document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("tree-modal").classList.add("hidden");
});





loadCategories();

function loadPlants() {
  showSpinner();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => displayTrees(data.plants.slice(0, 6)))
    .catch(err => console.error("Plants load error:", err));
}






loadPlants();
