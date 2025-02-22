import * as disProduct from "/js/displayProduct.js";

///////////////////////////////////////////////////////

// Filter products
export const filterProduct = async function (e) {
  const curEl = e.target.closest(".menu-filter__item");
  if (!curEl) return;

  document
    .querySelectorAll(".menu-filter__item")
    .forEach((d) => d.classList.remove("active-filter"));

  curEl.classList.toggle("active-filter");

  const products = Array.from(document.querySelectorAll(".product__item"));
  disProduct.clearUiProduct(document.querySelector('.product'));
  
  checkFilterProduct(curEl, products);
};

///////////////////////////////////////////////////////

// Check filter product
const checkFilterProduct = function(curEl, products) {
  let newProducts;

  if (curEl.dataset.filter === "low-to-high") {
    newProducts = sortLowToHigh(products);
  }

  if (curEl.dataset.filter === "high-to-low") {
    newProducts = sortHighToLow(products);
  }

  if (curEl.dataset.filter === "old-to-new") {
    newProducts = sortOldToNew(products);
  }

  if (curEl.dataset.filter === "new-to-old") {
    newProducts = sortNewToOld(products);
  }

  newProducts.forEach((p) => document.querySelector(".product").appendChild(p));
}

///////////////////////////////////////////////////////

// Filter product promotion
export const filterProductPromo = function(e){
  if(e.target.closest('.promo')){
    e.target.classList.toggle('active-filter')

    if(e.target.classList.contains('active-filter')){
      filterPromo(document.querySelectorAll('.product__item'))
    }else {
      hiddenFilterPromo(document.querySelectorAll('.product__item'))
    }

    checkAcitveFilter();
    return;
  }
}

///////////////////////////////////////////////////////

// Fliter promotion
export const filterPromo = function(productItems){
  Array.from(productItems).forEach(p => {
    if(p.dataset.promotion === "false" && !p.dataset.filter.includes('filter-')) {
      disProduct.HiddenUiProduct(p);
    }
      
    if(p.dataset.promotion === "true") {
      p.dataset.filter = "filter-promo";
      disProduct.showUiProduct(p)
    }
  })
}

// Hidden filter promotion
const hiddenFilterPromo = function(productItem){
  productItem.forEach(p => {
    if(p.dataset.filter === `filter-promo`){
      p.dataset.filter = "not-filter"
      disProduct.HiddenUiProduct(p);
    }
  })
}

///////////////////////////////////////////////////////

// Fliter product detail
export const filterProductDetail = function(e){
  if(e.target.closest('.menu-detail__item-content')){
    e.target.classList.toggle('active-filter')

    if(e.target.classList.contains('active-filter')){
      filterClothes(document.querySelectorAll('.product__item'), e.target)
    }else {
      hiddenFilterClothes(document.querySelectorAll('.product__item'), `clothes-${e.target.textContent}`)
    }

    checkAcitveFilter();
    return;
  }
}

///////////////////////////////////////////////////////

// Fliter clothes
export const filterClothes = function(productItem, curEl){
  productItem.forEach(p => {
    if(p.dataset.type === curEl.textContent || p.dataset.filter.includes('filter-')){
      if(!p.dataset.filter.includes('filter-clothes') && !p.dataset.filter.includes('filter-')) p.dataset.filter = `filter-clothes-${p.dataset.type}`
      disProduct.showUiProduct(p);
    }else{
      disProduct.HiddenUiProduct(p);
    }
  })
}

// Hidden filter clothes
const hiddenFilterClothes = function(productItem, valueFil){
  productItem.forEach(p => {
    if(p.dataset.filter === `filter-${valueFil}`){
      p.dataset.filter = "not-filter"
      disProduct.HiddenUiProduct(p);
    }
  })
}

///////////////////////////////////////////////////////

// Sort filter
const sortLowToHigh = function (products) {
  return products.sort(
    (a, b) => Number(a.dataset.price) - Number(b.dataset.price)
  );
};

const sortHighToLow = function (products) {
  return products.sort(
    (a, b) => Number(b.dataset.price) - Number(a.dataset.price)
  );
};

const sortOldToNew = function (products) {
  return products.sort(
    (a, b) => new Date(a.dataset.create) - new Date(b.dataset.create)
  );
};

const sortNewToOld = function (products) {
  return products.sort(
    (a, b) => new Date(b.dataset.create) - new Date(a.dataset.create)
  );
};

///////////////////////////////////////////////////////

const checkAcitveFilter = function(){
  const checkPromo = document.querySelector(".promo").classList.contains('active-filter')
  const lenProDetail = Array.from(document.querySelectorAll('.menu-detail__item-content')).filter(m => m.classList.contains('active-filter')).length
  const lenInput = Array.from(document.querySelectorAll('.label-input')).filter(m => m.classList.contains('active-filter')).length
  const lenColor = Array.from(document.querySelectorAll('.menu-colors li')).filter(m => m.classList.contains('active-filter')).length
  
  const result = lenProDetail + lenInput + lenColor  

  if(!checkPromo && result === 0) disProduct.showUiAllProduct(document.querySelectorAll('.product__item'));
}