import { groupProducts, chooseColor } from "./helpers.js";
const carousel = document.querySelector(".carousel-track");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://storage.googleapis.com/hush-dev-public/hush.json")
    .then((response) => response.json())
    .then((data) => {
      const productGroups = groupProducts(data);
      const productsToDisplay = [];

      // Loops through each product group
      Object.values(productGroups).forEach((group) => {
        const { color, availableSizes } = chooseColor(group);
        const chosenVariant = group.find((variant) => variant.color === color);
        // Match the variant with all its associated sizes
        chosenVariant.availableSizes = availableSizes;
        productsToDisplay.push(chosenVariant);
      });

      // Sorting all the products in the carousel by priority i.e highest to lowest
      productsToDisplay.sort((a, b) => b.priority - a.priority);
      renderProducts(productsToDisplay);
    })
    .catch((error) => console.log("Error fetching data:", error));
});

export function renderProducts(products) {
  products.forEach((product) => {
    const productTile = document.createElement("figure");
    productTile.className = "product-tile";
    productTile.innerHTML = `
        <div class="image-wrapper">
          <img src=${product.image} alt=${product.imageAlt} />
          <span class="price">Available sizes: ${product.availableSizes.join(
            ", "
          )}</span>
        </div>
        <figcaption class="product-info">
          <p>${product.name}</p>
          <p>£${product.priceObj.value}</p>
        </figcaption>
        `;
    carousel.appendChild(productTile);
  });
}
