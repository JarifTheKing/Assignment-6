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
    fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
        .then(res => res.json())
        .then(json => displayTrees(json.data || []));
};

// -------------------- Display Tree Cards --------------------
const displayTrees = (trees) => {
    const container = document.getElementById("plants-container");
    container.innerHTML = "";

    const seenNames = new Set();

    trees.forEach(tree => {
        const name = tree?.name || tree?.plant_name || "Unknown Tree";
        if (seenNames.has(name)) return; // skip duplicates
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

        container.appendChild(card);

        // Click on tree name opens modal
        card.querySelector("h2").addEventListener("click", () => openModal({
            name,
            image,
            category,
            price,
            description
        }));
    });
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

// Optional: Load first 6 plants initially
const loadPlants = () => {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(json => displayTrees(json.plants.slice(0, 6)));
};

loadPlants();
