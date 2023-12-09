const carousel = document.querySelector(".carousel");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://storage.googleapis.com/hush-dev-public/hush.json")
    .then((response) => response.json())
    .then((data) => {
      // data.sort((a, b) => b.priority - a.priority);

      // console.log("DATA: ", data);
      const productGroups = groupProducts(data);
      // console.log("PRODUCT GROUPS: ", productGroups);
      Object.values(productGroups).forEach((group) => {
        const colorTally = groupByColor(group);
        console.log(colorTally);
      });

      renderProducts(data);
    })
    .catch((error) => console.log("Error fetching data:", error));
});

function groupProducts(products) {
  const productGroups = {};

  products.forEach((product) => {
    const { productId } = product;
    // If product isn't in the productGroups object, add it
    if (!productGroups.hasOwnProperty(productId)) {
      productGroups[productId] = [];
    }

    productGroups[productId].push(product);
  });

  return productGroups;
}

// Group by color and count distinct sizes
function groupByColor(productVariants) {
  return productVariants.reduce((result, item) => {
    const { color, size, priority } = item;

    if (!result[color]) {
      result[color] = {
        sizeCount: 1,
        sizes: new Set([size]),
        totalPriority: priority,
      };
    } else {
      result[color].sizeCount++;
      result[color].sizes.add(size);
      result[color].totalPriority += priority;
    }

    return result;
  }, {});
}

////////////////////////////////////////////////////

function renderProducts(products) {
  products.slice(0, 8).forEach((product) => {
    const productTile = document.createElement("div");
    productTile.className = "product-tile";
    productTile.innerHTML = `
        <div class="image-wrapper">
          <img src=${product.image} alt=${product.imageAlt} />
          <span class="price">${product.size}</span>
        </div>
        <div class="product-info">
          <p>${product.name}</p>
          <p>$${product.priceObj.value}</p>
        </div>
        `;
    carousel.appendChild(productTile);
  });
}
