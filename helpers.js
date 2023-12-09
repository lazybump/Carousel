// Groups all products by their IDs
export function groupProducts(products) {
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

// Looks within each product group and determines color variant to display
export function chooseColor(productVariants) {
  // Reduce method to tally up each color's data in a given product group
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

  // Calculates average priority for a color
  for (const color in colorGroups) {
    const { sizeCount, totalPriority } = colorGroups[color];
    colorGroups[color].averagePriority = totalPriority / sizeCount;
  }

  let chosenColor = null;
  let maxAveragePriority = -Infinity;

  // Finds the color with the highest average priority in a group
  for (const color in colorGroups) {
    const { averagePriority } = colorGroups[color];
    if (averagePriority > maxAveragePriority) {
      maxAveragePriority = averagePriority;
      chosenColor = color;
    }
  }

  return {
    color: chosenColor,
    availableSizes: [...colorGroups[chosenColor].sizes], // converts set into array
  };
}
