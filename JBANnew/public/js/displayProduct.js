///////////////////////////////////////////////////////

// Hidden all ui product
export const HiddenAllUiProduct = function (productItems) {
  productItems.forEach((p) => HiddenUiProduct(p));
};

///////////////////////////////////////////////////////

// Hidden ui product
export const HiddenUiProduct = function (p) {
  p.classList.add("hidden-product");
  p.classList.remove("show-product");
};

///////////////////////////////////////////////////////

// Show all ui product
export const showUiAllProduct = function (productItems) {
  productItems.forEach((p) => showUiProduct(p));
};

///////////////////////////////////////////////////////

// Show ui product
export const showUiProduct = function (p) {
  p.classList.add("show-product");
  p.classList.remove("hidden-product");
};

///////////////////////////////////////////////////////

// Clear ui product
export const clearUiProduct = function (product) {
  product.innerHTML = "";
};