import * as disProduct from "/js/displayProduct.js";

//////////////////////////////////////////////////////

// varibles
let productItems;
let check = true;

//////////////////////////////////////////////////////

// Active filter
export const activeFilter = async function(e, info){
  const curEl = e.target.closest("[data-filter]");
  if(!curEl) return;

  if(curEl.dataset.filter === "sort") document.querySelectorAll('[data-filter="sort"]').forEach(d => d.classList.remove('active-filter'))

  curEl.classList.toggle('active-filter');
  if(curEl.dataset.filter === "color") curEl.classList.toggle('active-btn-color');

  filterProduct(info);
}

//////////////////////////////////////////////////////

// Filter product
const filterProduct = function(info){
  const activeProEl = document.querySelector('[data-filter="promotion"].active-filter');
  const activeTypeEls = Array.from(document.querySelectorAll('[data-filter="type"].active-filter')).map(d => d.dataset.value);
  const activeColorEls = Array.from(document.querySelectorAll('[data-filter="color"].active-filter')).map(d => d.dataset.value.toLowerCase());
  const activeSizeEls = Array.from(document.querySelectorAll('[data-filter="size"].active-filter')).map(d => d.dataset.value.toUpperCase());
  const activeSortEl = document.querySelector('[data-filter="sort"].active-filter')

  if(check){
    productItems = document.querySelectorAll('.product__item')
    check = false;
  }

  let productEls = productItems;
  disProduct.clearUiProduct(document.querySelector('.product'));

  if(activeProEl) productEls = filterPromotion(productEls);

  if(activeTypeEls.length > 0) productEls = filterType(productEls, activeTypeEls)
  
  if(activeColorEls.length > 0) productEls = filterColor(productEls, activeColorEls, info)

  if(activeSizeEls.length > 0) productEls = filterSize(productEls, activeSizeEls, info)

  if(activeSortEl) productEls = sortProducts(activeSortEl.dataset.value, productEls)
  
  productEls.forEach(p => document.querySelector('.product').appendChild(p));
  urlFilter();
}

///////////////////////////////////////////////////////

// Url filter
const urlFilter = function(){
  const params = new URLSearchParams();

  const promo = document.querySelector('[data-filter="promotion"].active-filter')
  if(promo) params.set('promotion', promo.dataset.value);

  const types = Array.from(document.querySelectorAll('[data-filter="type"].active-filter')).map(d => d.dataset.value);
  if(types.length > 0) params.set('types', types.join(','));

  const sizes = Array.from(document.querySelectorAll('[data-filter="size"].active-filter')).map(d => d.dataset.value);
  if(sizes.length > 0) params.set('sizes', sizes.join(','));

  const colors = Array.from(document.querySelectorAll('[data-filter="color"].active-filter')).map(d => d.dataset.value);
  if(colors.length > 0) params.set('colors', colors.join(','));

  const sort = document.querySelector('[data-filter="sort"].active-filter')
  if(sort) params.set('sort', sort.dataset.value);

  history.replaceState(null, "", "?" + params.toString());
}

///////////////////////////////////////////////////////

// Load url filter
export const loadUrlFilter = async function(info){
  const params = new URLSearchParams(window.location.search);

  const promo = params.get('promotion')
  if(promo) document.querySelector('[data-filter="promotion"]').classList.add('active-filter')
  
  const types = params.get('types')
  if(types) {
    changeStateHideMenu(document.querySelector(`[data-head="type"]`))

    document.querySelectorAll('[data-filter="type"]').forEach(d => {
      if(types.split(',').find(t => t === d.dataset.value)) d.classList.add('active-filter')
    })
  }

  const sizes = params.get('sizes')
  if(sizes) {
    changeStateHideMenu(document.querySelector(`[data-head="size"]`))

    document.querySelectorAll('[data-filter="size"]').forEach(d => {
      if(sizes.split(',').find(s => s === d.dataset.value)) {
        d.classList.add('active-filter')
        d.checked = true;
      }
    })
  }

  const colors = params.get('colors')
  if(colors) {
    changeStateHideMenu(document.querySelector(`[data-head="color"]`))

    document.querySelectorAll('[data-filter="color"]').forEach(d => {
      if(colors.split(',').find(c => c === d.dataset.value)) {
        d.classList.add('active-filter')
        d.classList.add('active-btn-color')
      }
    })
  }

  const sort = params.get('sort')
  if(sort) document.querySelectorAll('[data-filter="sort"]').forEach(s => s.dataset.value === sort ? s.classList.add('active-filter') : "")

  filterProduct(info)
}

///////////////////////////////////////////////////////

// Change state hide menu
const changeStateHideMenu = function(curEl){
  const childSvg = curEl.querySelector(".menu-detail__icon");
  const nextEl = curEl.nextElementSibling;

  nextEl.classList.add("show-hide-menu");
  curEl.classList.add("state-active-menu");
  childSvg.classList.add("rotate");
}

///////////////////////////////////////////////////////

// Filter promotion
const filterPromotion = function(productItems){
  return Array.from(productItems).filter(p => p.dataset.promotion !== "false");
}

///////////////////////////////////////////////////////

// Filter type
const filterType = function(productItems, activeTypeEls){
  return Array.from(productItems).filter(p => activeTypeEls.includes(p.dataset.type))
}

///////////////////////////////////////////////////////

// Filter color
const filterColor = function(productItems, activeColorEls, info){
  return Array.from(productItems).filter(p => {
    const curData = info.find(i => i._id === p.dataset.id)
    const curcolors = curData.variants.some(c => activeColorEls.includes(c.color.toLowerCase()))
    if(curcolors) {
      return p;
    }
  })
}

///////////////////////////////////////////////////////

// Filter size
const filterSize = function(productItems, activeSizeEls, info){
  return Array.from(productItems).filter(p => {
    const curData = info.find(i => i._id === p.dataset.id)
    const curcolors = curData.variants.map(v => v.sizes)
    const curSizes = curcolors.some(c => c.find(a => activeSizeEls.includes(a.size)));
    if(curSizes){
      return p;
    }
  })
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
