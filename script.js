const carousel = document.querySelector(".carousel");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://storage.googleapis.com/hush-dev-public/hush.json")
    .then((response) => response.json())
    .then((data) => {
      // data.sort((a, b) => b.priority - a.priority);

      // console.log("DATA: ", data);
      const productGroups = groupProducts(data);
      console.log("PRODUCT GROUPS: ", productGroups);

      const productsToDisplay = [];

      Object.values(productGroups).forEach((group) => {
        const { color, availableSizes } = chooseColor(group);
        // console.log(chosenColor);
        const chosenVariant = group.find((variant) => variant.color === color);

        chosenVariant.availableSizes = availableSizes;
        // console.log(chosenVariant);
        productsToDisplay.push(chosenVariant);
      });

      productsToDisplay.sort((a, b) => b.priority - a.priority);

      console.log(productsToDisplay);

      renderProducts(productsToDisplay);
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
function chooseColor(productVariants) {
  const colorGroups = productVariants.reduce((result, item) => {
    const { color, size, priority } = item;

    if (!result.hasOwnProperty(color)) {
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

  for (const color in colorGroups) {
    const { sizeCount, totalPriority } = colorGroups[color];
    colorGroups[color].averagePriority = totalPriority / sizeCount;
  }

  let chosenColor = null;
  let maxAveragePriority = -Infinity;

  for (const color in colorGroups) {
    const { averagePriority } = colorGroups[color];
    if (averagePriority > maxAveragePriority) {
      maxAveragePriority = averagePriority;
      chosenColor = color;
    }
  }

  return {
    color: chosenColor,
    availableSizes: [...colorGroups[chosenColor].sizes], // convert set into array
  };
}

function renderProducts(products) {
  products.slice(0, 8).forEach((product) => {
    const productTile = document.createElement("div");
    productTile.className = "product-tile";
    productTile.innerHTML = `
        <div class="image-wrapper">
          <img src=${product.image} alt=${product.imageAlt} />
          <span class="price">Available sizes: ${product.availableSizes.join(
            ", "
          )}</span>
        </div>
        <div class="product-info">
          <p>${product.name}</p>
          <p>£${product.priceObj.value}</p>
        </div>
        `;
    carousel.appendChild(productTile);
  });
}
