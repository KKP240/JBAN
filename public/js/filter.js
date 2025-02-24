import * as disProduct from "/js/displayProduct.js";

//////////////////////////////////////////////////////

// varibles
let productItems;
let check = true;

let productFilter = [];
let productColor = [];
let productSize = [];

//////////////////////////////////////////////////////

// Filter product
export const filterProduct = async function(e, info){
  const curEl = e.target.closest("[data-filter]");
  if(!curEl) return;

  if(curEl.dataset.filter === "sort") document.querySelectorAll('[data-filter="sort"]').forEach(d => d.classList.remove('active-filter'))

  curEl.classList.toggle('active-filter');
  if(curEl.dataset.filter === "color") curEl.classList.toggle('active-btn-color');

  const activeEl = Array.from(document.querySelectorAll('.active-filter'));

  if(check){
    productItems = document.querySelectorAll('.product__item')
    check = false;
  }

  let productEls = productItems;
  disProduct.clearUiProduct(document.querySelector('.product'));

  activeEl.forEach(el => {
    switch (el.dataset.filter) {
      case "promotion":
        productEls = filterPromotion(productEls)
        break;
      case "type":
        productEls = filterType(productEls, el)
        break;
      case "color":
        productEls = filterColor(productEls, el, info)
        break;
      case "size":
        productEls = filterSize(productEls, el, info)
        break;
      case "sort":
        productEls = sortProducts(el.dataset.value, productEls)
        break;
    }
  })
  
  productEls.forEach(p => document.querySelector('.product').appendChild(p));
  productFilter = [];
  productColor = [];
  productSize = [];
}

///////////////////////////////////////////////////////

// Filter promotion
const filterPromotion = function(productItems){
  return Array.from(productItems).filter(p => p.dataset.promotion !== "false");
}

///////////////////////////////////////////////////////

// Filter type
const filterType = function(productItems, el){
  Array.from(productItems).forEach(p => {
    if(el.dataset.value === p.dataset.type) productFilter.push(p)
  })
  return productFilter;
}

///////////////////////////////////////////////////////

// Filter color
const filterColor = function(productItems, el, info){
  Array.from(productItems).forEach(p => {
    const curData = info.find(i => i._id === p.dataset.id)
    const curcolors = curData.variants.some(c => c.color === el.dataset.value)
    if(curcolors) productColor.push(p)
  })
  return productColor;
}

///////////////////////////////////////////////////////

// Filter size
const filterSize = function(productItems, el, info){
  Array.from(productItems).forEach(p => {
    const curData = info.find(i => i._id === p.dataset.id)
    const curcolors = curData.variants.map(v => v.sizes)
    const curSizes = curcolors.some(c => c.find(a => a.size === el.dataset.value));
    if(curSizes) productSize.push(p)
  })
  return productSize;
}

///////////////////////////////////////////////////////

// Sort product
const sortProducts = function(filter, products) {
  switch (filter){
    case "low-to-high" :
      return sortByPrice(products, true)
    case "high-to-low":
      return sortByPrice(products, false)
    case "old-to-new":
      return sortByDate(products, true);
    case "new-to-old":
      return sortByDate(products, false);
    default:
      return products
  }
}

///////////////////////////////////////////////////////

// Sort by price
const sortByPrice = function(products, boolean){
  return Array.from(products).sort((a, b) => {
    const lowToHigh = Number(a.dataset.price) - Number(b.dataset.price)
    const highToLow = Number(b.dataset.price) - Number(a.dataset.price)
    return boolean ? lowToHigh : highToLow
  });
}

///////////////////////////////////////////////////////

// Sort by date
const sortByDate = function(products, boolean){
  return Array.from(products).sort((a, b) => {
    const oldToNew = new Date(a.dataset.create) - new Date(b.dataset.create);
    const newToOld = new Date(b.dataset.create) - new Date(a.dataset.create);
    return boolean ? oldToNew : newToOld;
  })
}
