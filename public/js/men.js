import * as data from "/js/fetchData.js";
import * as mainPage from "/js/mainPage.js";
import * as filter from "/js/filter.js";

///////////////////////////////////////////////////////

// Show product
const showAllProduct = async function () {
  const info = Array.from(await data.fetchProduct()).filter(i => i.category === "ชาย");

  mainPage.removeLoadingElements()
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
  const info = await data.fetchProduct()
  document.querySelector('.aside-menu').addEventListener('click', (event) => filter.activeFilter(event, info));
  mainPage.addMenuColorItems(info);
  filter.loadUrlFilter(info);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    mainPage.stopSlideShow();
  } else {
    mainPage.startSlideShow();
  }
});
