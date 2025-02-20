import * as data from "/js/fetchData.js";
import * as mainPage from "/js/mainPage.js";
import * as filter from "/js/filter.js";

///////////////////////////////////////////////////////

// Show product
const showAllProduct = async function () {
  const info = await data.fetchProduct();

  info.forEach((d) => {
    mainPage.insertUiProduct(d);
  });
};

///////////////////////////////////////////////////////

// Event
document.addEventListener("DOMContentLoaded", async function() {
  await mainPage.fetchFavorites();
  showAllProduct();
  mainPage.startSlideShow();
  document.querySelector(".menu-detail__list").addEventListener("click", mainPage.openHideMenu);
  document.querySelector(".menu-filter__list").addEventListener("click", filter.filterProduct);
  document.querySelector('.promo').addEventListener('click', filter.filterProductPromo);
  document.querySelector('.menu-detail').addEventListener('click', filter.filterProductDetail);
  
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    mainPage.stopSlideShow();
  } else {
    mainPage.startSlideShow();
  }
});
