// -------------------- Global Variables --------------------
let cart = [];
const plantsContainer = document.getElementById("plants-container");
const cartContainer = document.getElementById("cart-container"); // You need a div in HTML for cart
const totalPriceEl = document.getElementById("total-price"); // Add an element to show total

// -------------------- Show Spinner --------------------
const showSpinner = () => {
    plantsContainer.innerHTML = `<div class="flex justify-center items-center p-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
    </div>`;
};

// -------------------- Load Categories --------------------
const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then(res => res.json())
        .then(json => displayCategories(json.categories));
};

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("categories-container");
    categoriesContainer.innerHTML = "";

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "block w-full text-left px-4 py-2 my-1 rounded hover:bg-green-200";
        btn.innerHTML = `<h3 class="font-medium">${category.category_name}</h3>`;

        btn.addEventListener("click", () => {
            // Active button highlight
            document.querySelectorAll("#categories-container button").forEach(b => {
                b.classList.remove("bg-green-700", "text-white");
            });
            btn.classList.add("bg-green-700", "text-white");

            loadTreesByCategory(category.id);
        });

        categoriesContainer.appendChild(btn);
    });
};

// -------------------- Load Trees by Category --------------------
const loadTreesByCategory = (categoryId) => {
    showSpinner();

    fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
        .then(res => res.json())
        .then(json => {
            // Some categories might return data differently
            const trees = json?.data || json?.plants || [];
            displayTrees(trees);
        })
        .catch(err => {
            plantsContainer.innerHTML = `<p class="text-center text-red-600 py-10">Failed to load trees.</p>`;
            console.error(err);
        });
};
















// -------------------- Display Tree Cards --------------------
const displayTrees = (trees) => {
    plantsContainer.innerHTML = "";
    const seenNames = new Set();

    trees.forEach(tree => {
        const name = tree?.name || tree?.plant_name || "Unknown Tree";
        if (seenNames.has(name)) return;
        seenNames.add(name);

        const image = tree?.image || "./assets/default-tree.png";
        const category = tree?.category || tree?.plant_category || "Unknown Category";
        const price = tree?.price || 0;
        const description = tree?.description || "";

        const card = document.createElement("div");
        card.className = "card bg-base-100 shadow-sm w-full";

        card.innerHTML = `
            <figure>
                <img src="${image}" alt="${name}" class="w-full h-64 object-cover rounded-t-lg"/>
            </figure>
            <div class="card-body p-4">
                <h2 class="card-title cursor-pointer text-green-700 hover:underline">${name}</h2>
                <p>${description.slice(0, 80)}...</p>
                <div class="card-actions justify-between mt-4">
                    <div class="badge font-bold text-[#15803cee] bg-[#15803c1e]">${category}</div>
                    <div class="badge font-bold">৳${price}</div>
                </div>
                <button class="btn w-full bg-[#15803D] text-white border-[#f1d800] rounded-full mt-4">Add to Cart</button>
            </div>
        `;

        plantsContainer.appendChild(card);

        // Click on tree name opens modal
        card.querySelector("h2").addEventListener("click", () => openModal({
            name,
            image,
            category,
            price,
            description
        }));

        // Add to Cart functionality
        card.querySelector("button").addEventListener("click", () => addToCart({name, price}));
    });
};

// -------------------- Cart Functions --------------------
const addToCart = (tree) => {
    cart.push(tree);
    updateCart();
};

const removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCart();
};

const updateCart = () => {
    if (!cartContainer || !totalPriceEl) return;

    cartContainer.innerHTML = "";
    cart.forEach((tree, index) => {
        const item = document.createElement("div");
        item.className = "flex justify-between items-center border-b py-2";
        item.innerHTML = `
            <span>${tree.name}</span>
            <div class="flex items-center gap-2">
                <span>৳${tree.price}</span>
                <button class="text-red-600 font-bold">❌</button>
            </div>
        `;
        cartContainer.appendChild(item);

        item.querySelector("button").addEventListener("click", () => removeFromCart(index));
    });

    const total = cart.reduce((sum, t) => sum + t.price, 0);
    totalPriceEl.textContent = total;
};

// -------------------- Modal Functions --------------------
const openModal = (tree) => {
    const modal = document.getElementById("tree-modal");
    modal.querySelector(".modal-title").textContent = tree.name;
    modal.querySelector(".modal-image").src = tree.image;
    modal.querySelector(".modal-image").alt = tree.name;
    modal.querySelector(".modal-category").textContent = tree.category;
    modal.querySelector(".modal-price").textContent = tree.price;
    modal.querySelector(".modal-description").textContent = tree.description;

    modal.classList.remove("hidden");
};

document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("tree-modal").classList.add("hidden");
});

// -------------------- Initial Load --------------------
loadCategories();
const loadPlants = () => {
    showSpinner();
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(json => displayTrees(json.plants.slice(0, 6)));
};
loadPlants();
