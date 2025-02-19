///////////////////////////////////////////////////////

// Fetch products
const fetchProduct = async function () {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

///////////////////////////////////////////////////////

// Show product
const showProduct = async function () {
  const data = await fetchProduct();

  data.forEach((d) => {
    insertUiProduct(d);
  });
};

///////////////////////////////////////////////////////

// Insert ui product
const insertUiProduct = function (d) {
  // ตรวจสอบว่า product นี้อยู่ใน favorites ของผู้ใช้
  const isFav = userFavorites.includes(d._id.toString());
  const heartSrc = isFav ? "/icon/heart-fill.svg" : "/icon/heart.svg";
  const heartState = isFav ? "fill" : "not-fill";

  const html = `
  <div class="product__item" data-name="${d.name}" data-type="${d.type}" data-id="${d._id}" data-create="${d.createdAt}" data-price="${d.price}">
    <div class="product__con-img">
      <img src="https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/zoom/68ef016b7946bcd32035a30c40e23f9209c53261_xxl-1.jpg" alt="img-product" class="product__img" product-id="${d._id}"/>
      <div class="percent ${d.isPromotion ? "active-percent" : ""}">${
    d.isPromotion
      ? `-${100 - (d.price / d.originalPrice * 100).toFixed(0)}%`
      : "&nbsp;"
  }</div>
    </div>
    <div class="product__content">
      <div class="product__content-heading">
        <h3 class="heading-product">${d.name}</h3>
        <img src="${heartSrc}" alt="heart" class="product__fav" data-state="${heartState}">
      </div>
      <div class="product__content-price ${d.isPromotion ? "has-promotion" : ""}">
        ${d.isPromotion ? d.originalPrice : d.price} บาท <span class="discount">${d.originalPrice ? d.price : "&nbsp;"}</span>
      </div>
      <div class="product__content-rating">
        <div class="rating">
          <input type="radio" id="star5-${d._id}" name="rating-${d._id}" value="5" /><label for="star5-${d._id}" class="${d.averageRating >= 5 ? "active-rating" : ""}"></label>
          <input type="radio" id="star4-${d._id}" name="rating-${d._id}" value="4" /><label for="star4-${d._id}" class="${d.averageRating >= 4 ? "active-rating" : ""}"></label>
          <input type="radio" id="star3-${d._id}" name="rating-${d._id}" value="3" /><label for="star3-${d._id}" class="${d.averageRating >= 3 ? "active-rating" : ""}"></label>
          <input type="radio" id="star2-${d._id}" name="rating-${d._id}" value="2" /><label for="star2-${d._id}" class="${d.averageRating >= 2 ? "active-rating" : ""}"></label>
          <input type="radio" id="star1-${d._id}" name="rating-${d._id}" value="1" /><label for="star1-${d._id}" class="${d.averageRating >= 1 ? "active-rating" : ""}"></label>
        </div>
        <div class="rating-count">(${d.numReviews ?? 0} rating)</div>
      </div>
    </div>
  </div>`;

  document.querySelector(".product").insertAdjacentHTML("beforeend", html);
  // เพิ่ม event listener สำหรับการคลิกที่หัวใจ
  document.querySelector(".product").addEventListener("click", processProduct);
};


///////////////////////////////////////////////////////

// // Favourite click
// const fillHeart = function (productFv, url, word) {
//   productFv.src = url;
//   productFv.dataset.state = word;
// };

// ///////////////////////////////////////////////////////

// // Process product
// const processProduct = function (e) {
//   const productItem = e.target.closest(".product__item");
//   const productFv = e.target.closest(".product__fav");

//   if (!productItem) return;

//   if (productFv && document.querySelector(".username")) {
//     if (productFv.dataset.state === "not-fill") {
//       fillHeart(productFv, "/icon/heart-fill.svg", "fill");
//       return;
//     }

//     if (productFv.dataset.state === "fill") {
//       fillHeart(productFv, "/icon/heart.svg", "not-fill");
//       return;
//     }
//   }

//   if (!productFv && productItem) {
//     const productId = productItem.getAttribute("data-id");
//     window.location.href = `/productdetails?id=${productId}`;
//   }
// };

///////////////////////////////////////////////////////

// Hidden all ui product
const HiddenAllUiProduct = function () {
  document.querySelectorAll(".product__item").forEach((p) => {
    HiddenUiProduct(p);
  });
};

// Hidden ui product
const HiddenUiProduct = function (p) {
  p.classList.add("hidden-product");
  p.classList.remove("show-product");
};

// Show all ui product
const showUiAllProduct = function () {
  document.querySelectorAll(".product__item").forEach((p) => {
    showUiProduct(p);
  });
};

// Show ui product
const showUiProduct = function (p) {
  p.classList.add("show-product");
  p.classList.remove("hidden-product");
};

// Clear ui product
const clearUiProduct = function () {
  document.querySelector(".product").innerHTML = "";
};

///////////////////////////////////////////////////////

// Filter products
const filterProduct = async function (e) {
  const curEl = e.target.closest(".menu-filter__item");
  if (!curEl) return;

  document
    .querySelectorAll(".menu-filter__item")
    .forEach((d) => d.classList.remove("active-filter"));

  curEl.classList.toggle("active-filter");

  const products = Array.from(document.querySelectorAll(".product__item"));

  clearUiProduct();

  if (curEl.dataset.filter === "low-to-high") {
    const newProducts = sortLowToHigh(products);
    newProducts.forEach((p) => {
      document.querySelector(".product").appendChild(p);
    });
    return;
  }

  if (curEl.dataset.filter === "high-to-low") {
    const newProducts = sortHighToLow(products);
    newProducts.forEach((p) => {
      document.querySelector(".product").appendChild(p);
    });
    return;
  }

  if (curEl.dataset.filter === "old-to-new") {
    const newProducts = sortOldToNew(products);
    newProducts.forEach((p) => {
      document.querySelector(".product").appendChild(p);
    });
    return;
  }

  if (curEl.dataset.filter === "new-to-old") {
    const newProducts = sortNewToOld(products);
    newProducts.forEach((p) => {
      document.querySelector(".product").appendChild(p);
    });
    return;
  }
};

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

// Open hide menu
const openHideMenu = function (e) {
  const curEl = e.target.closest(".menu-detail__item-heading");
  if (!curEl) return;

  const childSvg = curEl.querySelector(".menu-detail__icon");
  const nextEl = curEl.nextElementSibling;

  nextEl.classList.toggle("show-hide-menu");
  curEl.classList.toggle("state-active-menu");
  childSvg.classList.toggle("rotate");
};

///////////////////////////////////////////////////////

// Slide show
let count = 0;
const slideShow = function () {
  document.querySelectorAll(".btn-slide").forEach((b) => {
    b.classList.remove("active-show-btn");
  });

  const imgs = document.querySelectorAll(".slide-show__img");

  imgs.forEach((i, index) => {
    i.style.transform = `translateX(${-(count + 1 - index) * 100}%)`;

    if (-(count + 1 - index) * 100 === 0) {
      document
        .querySelector(`.btn-slide-${index + 1}`)
        .classList.add("active-show-btn");
    }
  });

  count += 1;

  if (count === imgs.length - 1) {
    count = -1;
  }
};

var interval;
const startSlideShow = function () {
  interval = setInterval(slideShow, 4000);
};

const stopSlideShow = function () {
  clearInterval(interval);
};

startSlideShow();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopSlideShow();
  } else {
    startSlideShow();
  }
});

///////////////////////////////////////////////////////

// Event
document
  .querySelector(".menu-filter__list")
  .addEventListener("click", filterProduct);
document
  .querySelector(".menu-detail__list")
  .addEventListener("click", openHideMenu);
document.addEventListener("DOMContentLoaded", async function() {
    await fetchFavorites();
    showProduct();
  });


/////////////////////////////////////////////////////

// Product favourite

async function addToFavorites(productId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return;
    }
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      // อัปเดต UI เปลี่ยนหัวใจเป็น fill
      console.log("เพิ่มใน favorites สำเร็จ", data);
      return true;
    } else {
      console.error("Error:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

async function removeFromFavorites(productId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาล็อกอินก่อน");
      return false;
    }
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Removed from favorites", data);
      return true;
    } else {
      console.error("Error:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}


// ปรับปรุงฟังก์ชัน fillHeart (ยังคงเหมือนเดิม)
const fillHeart = function (productFv, url, word) {
  productFv.src = url;
  productFv.dataset.state = word;
};



// ปรับปรุง event listener สำหรับการคลิกหัวใจ
const processProduct = function (e) {
  const productItem = e.target.closest(".product__item");
  const productFv = e.target.closest(".product__fav");
  
  if (!productItem) return;

  const productId = productItem.getAttribute("data-id");
  // ถ้าคลิกที่หัวใจ
  if (productFv) {
    // ตรวจสอบสถานะของหัวใจ
    if (productFv.dataset.state === "not-fill") {
      // ดึง productId จาก container (data-id ที่อยู่ใน product__item)
      // ส่งคำร้องเพิ่มสินค้าไปยัง favorites
      addToFavorites(productId).then(success => {
        if (success) {
          fillHeart(productFv, "/icon/heart-fill.svg", "fill");
        } else {
          console.log("Error")
        }
      });
      return;
    } else if (productFv.dataset.state === "fill") {
      // ตัวอย่าง: คุณอาจเพิ่มฟังก์ชันเพื่อลบออกจาก favorites (ถ้าต้องการ)
      
      removeFromFavorites(productId).then(success => {
        if (success) {
          fillHeart(productFv, "/icon/heart.svg", "not-fill");
        }
      });
      return;
    }
  }

  // ถ้าไม่ใช่หัวใจ (คลิกที่สินค้าอื่นๆ) ให้ไปที่หน้า Product Details
  window.location.href = `/productdetails?id=${productId}`;
};


// load webpage fav product
let userFavorites = []; // เก็บ array ของ fav productId

async function fetchFavorites() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("http://localhost:5000/api/user/favorites", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      }
    });
    const favData = await res.json();
    userFavorites = favData.map(fav => fav._id.toString());
    console.log("Favorites loaded:", userFavorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}
