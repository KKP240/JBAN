///////////////////////////////////////////////////////

// Insert ui product
export const insertUiProduct = function (d) {
  // ตรวจสอบว่า product นี้อยู่ใน favorites ของผู้ใช้
  const isFav = userFavorites.includes(d._id.toString());
  const heartSrc = isFav ? "/icon/heart-fill.svg" : "/icon/heart.svg";
  const heartState = isFav ? "fill" : "not-fill";

  const imgUrl = d.image?.split('public').at(-1)

  const html = `
  <div class="product__item" data-name="${d.name}" data-category="${d.category}" data-id="${d._id}" data-create="${d.createdAt}" data-price="${d.price}" data-promotion="${d.isPromotion}" data-type="${d.type}"
    >
    <div class="product__con-img">
      <img src="${imgUrl}" alt="img-product" class="product__img" product-id="${d._id}"/>
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
      <div class="product__content-price">
        <span class="${d.isPromotion ? "has-promotion" : ""}">${d.isPromotion ? d.originalPrice.toFixed(2) : d.price.toFixed(2)} บาท</span>
        <span class="discount">${d.isPromotion ? `${d.price.toFixed(2)} บาท` : "&nbsp;"}</span>
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
  document.querySelector(".product").addEventListener("click", processProduct);
};

///////////////////////////////////////////////////////

// Product favourite
const addToFavorites = async function(productId) {
  try {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   alert("กรุณาล็อกอินก่อน");
    //   return;
    // }
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `${token}`
      },
      credentials: "include"
    });

    if (res.status === 401) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาล็อกอินก่อน',
        text: 'คุณต้องเข้าสู่ระบบเพื่อดำเนินการนี้',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        
      });
      return false;
    }

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

const removeFromFavorites = async function(productId) {
  try {
    // const token = localStorage.getItem("token");

    // if (!token) {
    //   alert("กรุณาล็อกอินก่อน");
    //   return false;
    // }
    const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `${token}`
        credentials: "include"
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

  if (productFv) {
    if (productFv.dataset.state === "not-fill") {
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
      // ลบ fav ออกจากสินค้า
      removeFromFavorites(productId).then(success => {
        if (success) {
          fillHeart(productFv, "/icon/heart.svg", "not-fill");
        }
      });
      return;
    }
  }

  window.location.href = `/productdetails?id=${productId}`;
};


// Load webpage fav product
let userFavorites = [];

export const fetchFavorites = async function() {
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

///////////////////////////////////////////////////////

// Open hide menu
export const openHideMenu = function (e) {
  const curEl = e.target.closest(".menu-detail__item-heading");
  if (!curEl) return;

  const childSvg = curEl.querySelector(".menu-detail__icon");
  const nextEl = curEl.nextElementSibling;

  nextEl.classList.toggle("show-hide-menu");
  curEl.classList.toggle("state-active-menu");
  childSvg.classList.toggle("rotate");
};

///////////////////////////////////////////////////////

// Add menu color items
export const addMenuColorItems = function(products){
  let colors = new Set()
  Array.from(products).map(p => p.variants.forEach(v => colors.add(v.color)))
  colors.forEach(c => {
    const html = `<li><div class="btn-color" style="background-color: ${c.toLowerCase()};" data-filter="color" data-value="${c}"></div></li>`
    document.querySelector('.menu-colors').insertAdjacentHTML('beforeend', html)
  })
  
}


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

///////////////////////////////////////////////////////

// Interval slide show
var interval;
export const startSlideShow = function () {
  interval = setInterval(slideShow, 4000);
};

export const stopSlideShow = function () {
  clearInterval(interval);
};

export const removeLoadingElements = function(){
  document.querySelector('.product').innerHTML = ``
  document.querySelector('.product').style.display = "grid";
}