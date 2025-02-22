import * as disProduct from "/js/displayProduct.js";
import * as productData from "/js/fetchData.js";

///////////////////////////////////////////////////////

// Filter product detail
export const filterProductDetail = function(e){
  const curEl = e.target.closest("[data-filter]");
  if(!curEl) return;

  curEl.classList.toggle('active-filter');
  const checkActive = curEl.classList.contains('active-filter');

  curEl.dataset.filter === "promotion" ? filterPromotion(document.querySelectorAll('.product__item'), checkActive) : '';
  curEl.dataset.filter === "type" ? filterType(document.querySelectorAll('.product__item'), checkActive, curEl) : '';

  if(!checkAcitveFilter()) disProduct.showUiAllProduct(document.querySelectorAll('.product__item'));
}


// Filter promotion
const filterPromotion = function(productItems, checkActive){
    Array.from(productItems).forEach(item => {
      const data = item.dataset;

      if(checkActive){
        if(data.promotion === "true") {
          data.filterPromo = "promotion";
          disProduct.showUiProduct(item);
  
        }else if(data.filterTypes === "not-filter" && data.filterSizes === "not-filter" && data.filterColors === "not-filter"){
          disProduct.HiddenUiProduct(item);
        }

      }else{
        if(data.filterPromo === "promotion") {
          data.filterPromo = "not-filter";
  
          const check = checkAcitveFilter();
          if(check) disProduct.HiddenUiProduct(item)
        }
        else if(data.filterTypes !== "not-filter" || data.filterSizes !== "not-filter" || data.filterColors !== "not-filter") {
          disProduct.showUiProduct(item);
        }
      }
    })
}

// Filter type
const filterType = function(productItems, checkActive, curEl){
    Array.from(productItems).forEach(item => {
      const data = item.dataset;

      if(checkActive){
        if(data.type === curEl.textContent) {
          data.filterTypes = data.type;
          disProduct.showUiProduct(item);
        }
        else if(data.filterPromo === "not-filter" && data.filterSizes === "not-filter" && data.filterColors === "not-filter" && data.filterTypes === "not-filter"){
          disProduct.HiddenUiProduct(item);
        }

      }else {
        if(data.filterTypes === data.type && data.filterTypes === curEl.textContent) {
          data.filterTypes = "not-filter";

          const check = checkAcitveFilter();
          if(check) disProduct.HiddenUiProduct(item);
        }  
        else if(data.filterPromo !== "not-filter" || data.filterSizes !== "not-filter" || data.filterColors !== "not-filter")
          disProduct.showUiProduct(item);
      }
    })
}

///////////////////////////////////////////////////////

// Filter products sort
export const filterProductSort = async function (e) {
  const curEl = e.target.closest(".menu-filter__item");
  if (!curEl) return;

  document.querySelectorAll(".menu-filter__item").forEach((d) => d.classList.remove("active-filter-sort"));
  curEl.classList.toggle("active-filter-sort");

  const products = Array.from(document.querySelectorAll(".product__item"));
  disProduct.clearUiProduct(document.querySelector('.product'));
  
  const sortPros = sortProducts(curEl.dataset.filter, products);
  sortPros.forEach((p) => document.querySelector(".product").appendChild(p));
};

///////////////////////////////////////////////////////

// Check filter product sort
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

// Sort filter
const sortByPrice = function(products, boolean){
  return products.sort((a, b) => {
    const lowToHigh = Number(a.dataset.price) - Number(b.dataset.price)
    const highToLow = Number(b.dataset.price) - Number(a.dataset.price)
    return boolean ? lowToHigh : highToLow
  });
}

const sortByDate = function(product, boolean){
  return product.sort((a, b) => {
    const oldToNew = new Date(a.dataset.create) - new Date(b.dataset.create);
    const newToOld = new Date(b.dataset.create) - new Date(a.dataset.create);
    return boolean ? oldToNew : newToOld;
  })
}

///////////////////////////////////////////////////////

// Check active filter
const checkAcitveFilter = function(){
  return document.querySelectorAll('.active-filter').length > 0;
}
