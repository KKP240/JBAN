///////////////////////////////////////////////////////

// Fetch products
const fetchProduct = async function () {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

///////////////////////////////////////////////////////

const showProduct = async function () {
  const data = await fetchProduct();

  data.forEach((d) => {
    insertUiProduct(d);
  });
};

///////////////////////////////////////////////////////

// Insert ui product
const insertUiProduct = function (d) {
  const html = `
  <div class="product__item" data-type="${d.category}" data-stock="${d.stock}" data-id="${d._id}" data-create="${d.createdAt}" data-update="${d.updatedAt}">
    <div class="product__con-img">
      <img src="https://d29c1z66frfv6c.cloudfront.net/pub/media/catalog/product/zoom/68ef016b7946bcd32035a30c40e23f9209c53261_xxl-1.jpg" alt="img-product" class="product__img" />
      <div class="percent">-50%</div>
    </div>
    <div class="product__content">
      <div class="product__content-heading">
        <h3 class="heading-product">${d.name}</h3>
        <img src="/icon/heart.svg" alt="heart" class="product__fav" data-state="not-fill" >
      </div>
      <div class="product__content-price">${d.price} บาท <span class="discount">&nbsp;</span></div>
      <div class="product__content-rating">
        <div class="rating">
          <input type="radio" id="star5" name="rating" value="5" /><label
          for="star5"
          ></label>
          <input type="radio" id="star4" name="rating" value="4" /><label
          for="star4"
          ></label>
          <input type="radio" id="star3" name="rating" value="3" /><label
          for="star3"
          ></label>
          <input type="radio" id="star2" name="rating" value="2" /><label
          for="star2"
          ></label>
          <input type="radio" id="star1" name="rating" value="1" /><label
          for="star1"
          ></label>
        </div>
        <div class="rating-count">(0 rating)</div>
      </div>
    </div>
  </div>`;

  document.querySelector(".product").insertAdjacentHTML("beforeend", html);
  document.querySelector(".product").addEventListener("click", processProduct);
};

///////////////////////////////////////////////////////

// Fill heart
const fillHeart = function (productFv, url, word) {
  productFv.src = url;
  productFv.dataset.state = word;
};

///////////////////////////////////////////////////////

// Process product
const processProduct = function (e) {
  const productItem = e.target.closest(".product__item");
  const productFv = e.target.closest(".product__fav");

  if (!productItem) return;

  if (productFv) {
    if (productFv.dataset.state === "not-fill") {
      fillHeart(productFv, "/icon/heart-fill.svg", "fill");
      return;
    }

    if (productFv.dataset.state === "fill") {
      fillHeart(productFv, "/icon/heart.svg", "not-fill");
      return;
    }
  }

  window.location.href = "/productDetail";
};

///////////////////////////////////////////////////////

const clearUiProduct = function () {
  document.querySelector(".product").innerHTML = ``;
};

///////////////////////////////////////////////////////

// Search
const searchProduct = async function (e) {
  const data = await fetchProduct();

  clearUiProduct();

  if (e.target.value === "") {
    showProduct();
    return;
  }


  data.forEach((d) => {
    if (
      d.name.toLowerCase().includes(e.key) ||
      d.name.toLowerCase().includes(e.target.value)
    ) {
      insertUiProduct(d);
    }
  });
};

document
  .querySelector(".search-bar")
  .addEventListener("keydown", searchProduct);
showProduct();
