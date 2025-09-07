

const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then((res) => res.json())
        .then((json) => {
            displayCategories(json.categories)
        })

}

const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("categories-container")
    categoriesContainer.innerHTML = ""

    for (let category of categories) {
        // create element
        const btnCategories = document.createElement("button")

        btnCategories.className =
            "block  text-left px-4 py-2 my-1 rounded hover:bg-green-200"

        btnCategories.innerHTML = `
            <h3 class="font-medium">${category.category_name}</h3>
        `

        // click event → load trees of that category
        btnCategories.addEventListener("click", () => {
            // remove previous active
            document.querySelectorAll("#categories-container button").forEach(btn => {
                btn.classList.remove("bg-green-700", "text-white")
            })
            // set active
            btnCategories.classList.add("bg-green-700", "text-white")

            loadTreesByCategory(category.category_name)
        })

        categoriesContainer.appendChild(btnCategories)
    }

    // make first one active by default
    // if (categories.length > 0) {
    //     const firstBtn = categoriesContainer.querySelector("button")
    //     firstBtn.classList.add("bg-green-700", "text-white")
    //     loadTreesByCategory(categories[0].category_name)
    // }
}

// const loadTreesByCategory = (categoryName) => {
//     fetch(`https://openapi.programming-hero.com/api/trees?category=${categoryName}`)
//         .then(res => res.json())
//         .then(json => {
//             displayTrees(json.data || [])
//         })

// }



// const displayTrees = (trees) => {
//     const treesContainer = document.getElementById("trees-container")
//     treesContainer.innerHTML = ""

//     for (let tree of trees) {
//         const card = document.createElement("div")
//         card.className = "border rounded-lg p-4 bg-white shadow"

//         card.innerHTML = `
//             <h3 class="text-lg font-bold">${tree.tree_name}</h3>
//             <p class="text-sm text-gray-600">${tree.description}</p>
//             <p class="font-semibold">Price: $${tree.price}</p>
//             <button class="bg-green-600 text-white px-3 py-1 rounded mt-2">
//                 Add to Cart
//             </button>
//         `
//         treesContainer.appendChild(card)
//     }
// }

loadCategories()










const loadPlants = () => {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then((res) => res.json())
        .then((json) => {
            displayPlants(json.plants)
        })
}


const displayPlants = (plants) => {
    const plantsContainer = document.getElementById("plants-container");
    plantsContainer.innerHTML = "";

    // Show only 6 plants
    plants.slice(0, 6).forEach(plant => {
        const card = document.createElement("div");
        card.className = "card bg-base-100 shadow-sm";

       card.innerHTML = `
          <figure>
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-64 object-cover rounded-t-lg"/>
          </figure>
          <div class="card-body">
            <h2 class="card-title">${plant.name}</h2>
            <p>${plant.description.slice(0, 100)}...</p>
            <div class="card-actions justify-between">
              <div class="badge font-bold text-[#15803cee] bg-[#15803c1e]">
                ${plant.category}
              </div>
              <div class="badge font-bold">৳${plant.price}</div>
            </div>
            <button class="btn w-full bg-[#15803D] text-white border-[#f1d800] rounded-full">
              Donate Now
            </button>
          </div>
        `;

        plantsContainer.appendChild(card);
    });
}



loadPlants()