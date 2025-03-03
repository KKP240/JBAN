///////////////////////////////////////////////////////

// Selecting element
const userEl = document.querySelector(".user");
const navP2 = document.querySelector('.navpart2');
const navP3 = document.querySelector('.navpart3');
const search = document.querySelector('.nav__search');
const searchParent = search.parentNode;

///////////////////////////////////////////////////////

// Fetch user data
const fetchUserProfile = async function () {
  console.log("fetching user profile...");
  // const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/auth/me", {
    credentials: "include", // เวลาจะใช้ token ทำแบบนี้ 
  });

  if (response.ok) {
    const user = await response.json();
    insertUiUser(user);
  } else {
    insertUiBtnLogin();
  }

};

///////////////////////////////////////////////////////

// Fetch products
const fetchProductv2 = async function () {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

//////////////////////////////////////////////////////
// Insert ui user
const insertUiUser = function (user) {
  userEl.innerHTML = `<div class="username">
                              ${user.role === 'admin' ? `
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                <path d="M228.25,63.07l-4.66-2.69a23.6,23.6,0,0,0,0-8.76l4.66-2.69a8,8,0,0,0-8-13.86l-4.67,2.7A23.92,23.92,0,0,0,208,33.38V28a8,8,0,0,0-16,0v5.38a23.92,23.92,0,0,0-7.58,4.39l-4.67-2.7a8,8,0,1,0-8,13.86l4.66,2.69a23.6,23.6,0,0,0,0,8.76l-4.66,2.69a8,8,0,0,0,4,14.93,7.92,7.92,0,0,0,4-1.07l4.67-2.7A23.92,23.92,0,0,0,192,78.62V84a8,8,0,0,0,16,0V78.62a23.92,23.92,0,0,0,7.58-4.39l4.67,2.7a7.92,7.92,0,0,0,4,1.07,8,8,0,0,0,4-14.93ZM192,56a8,8,0,1,1,8,8A8,8,0,0,1,192,56Zm29.35,48.11a8,8,0,0,0-6.57,9.21A88.85,88.85,0,0,1,216,128a87.62,87.62,0,0,1-22.24,58.41,79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75A88,88,0,0,1,128,40a88.76,88.76,0,0,1,14.68,1.22,8,8,0,0,0,2.64-15.78,103.92,103.92,0,1,0,85.24,85.24A8,8,0,0,0,221.35,104.11ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0Z">
                                </path>
                              </svg>` : 
                              `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z">
                                  </path>
                              </svg>`}
                              
                              <div>${user.name}</div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" class="drop-menu__icon">
                                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z">
                                  </path>
                              </svg>
                              <div class="drop-menu">
                                  <ul class="drop-menu__list">
                                      ${user.role === "admin" ? `<li class="drop-menu__item"><a href="/manageProduct" class="drop-menu__link">จัดการสินค้า</a></li>` : ""}
                                      <li class="drop-menu__item"><a href="/orderHistory" class="drop-menu__link">ประวัติคำสั่งซื้อ</a></li>
                                      <li class="drop-menu__item"><a href="/logout" class="drop-menu__link" id="logoutBtn">ออกจากระบบ</a></li>
                                  </ul>
                              </div>
                          </div>`;

  document.querySelector(".username")?.addEventListener("click", openDropdown);
  window.addEventListener("click", closeDropdownWindow);
};

///////////////////////////////////////////////////////

// Insert ui btn login
const insertUiBtnLogin = function () {
  userEl.innerHTML = `<a href="/login" class="btn-login">เข้าสู่ระบบ</a>`;
  document.querySelector("#logoutBtn")?.removeEventListener('click', logout);
};

///////////////////////////////////////////////////////

// Toggle drop menu
const toggleDropMenu = function () {
  document.querySelector(".drop-menu").classList.toggle("showDrop");
  document
    .querySelector(".username svg")
    .classList.toggle("change-active-color");
  document.querySelector(".drop-menu__icon").classList.toggle("rotate-180");
};

///////////////////////////////////////////////////////

// Remove drop menu
const removeDropMenu = function () {
  document.querySelector(".drop-menu").classList.remove("showDrop");
  document
    .querySelector(".username svg")
    .classList.remove("change-active-color");
  document.querySelector(".drop-menu__icon").classList.remove("rotate-180");
  document.querySelector(".username").classList.remove("change-bg");
};

///////////////////////////////////////////////////////

// Open drop down
const openDropdown = function (e) {
  if (e.target.closest(".username")) {
    toggleDropMenu();
    e.target.closest(".username").classList.toggle("change-bg");
  }
};

// Close drop down window
const closeDropdownWindow = function (e) {
  if (!e.target.closest(".username")) {
    removeDropMenu();
  }
};

///////////////////////////////////////////////////////

// Search link
const processLinkSearchData = function(e){
  const searchData = e.target.closest('.search-data');

  if(!searchData) return;

  const productId = searchData.getAttribute('data-product-id');

  window.location.href = `/productdetails?id=${productId}`;
}

// Search products
const searchProduct = async function (e) {
  const data = await fetchProductv2()
  const value = e.target.value;

  if (value === "") {
    document.querySelector('.search-result').classList.remove('active-search')
    return;
  }

  clearSearchData()

  document.querySelector('.search-result').classList.add('active-search')

  data.forEach((d) => {
    if (d.name.toLowerCase().trim().includes(value.toLowerCase().trim())) {
      insertUiSearchData(d)
    }
  });

  document.querySelector('.search-sum').textContent = `${document.querySelector('.search-group-data').children.length} ผลลัพธ์`

  if(!document.querySelector('.search-group-data').childNodes.length) {
    notFoundSearchData();
  }
};

// Insert ui search data
const insertUiSearchData = function(data){
  const html = `
            <div class="search-data" data-product-id="${data._id}">
              <img src="${data.image.split('public').at(-1)}" alt="img-product" class="product__img">
              <div class="product__detail">
                <div class="heading-product">${data.name}</div>
                <div class="product__price">${data.price} บาท</div>
              </div>
            </div>`

  document.querySelector('.search-group-data').insertAdjacentHTML('beforeend', html);
  document.querySelector(".search-group-data").addEventListener("click", processLinkSearchData);
}

// Clear search data
const clearSearchData = function(){
  document.querySelector('.search-group-data').innerHTML = ''
}

// Not found search data
const notFoundSearchData = function(){
  document.querySelector('.search-group-data').innerHTML = '<div style="text-align: center;">ไม่พบการค้นหา</div>';
}

///////////////////////////////////////////////////////

// Nav res
const openNavRes = function(e){
  const curEl = e.target.closest('.btn-nav-res');
  if(!curEl) return;
  
  document.querySelector('.nav-res').classList.add('open-nav-res')
}

const closeNavRes = function(e){
  const curEl = e.target.closest('.btn-close-nav');
  if(!curEl) return;

  document.querySelector('.nav-res').classList.remove('open-nav-res')
}

const resNav = function () {
  const widthWindow = window.innerWidth;
  const navbar = document.querySelector('.navbar');
  const newParent = document.querySelector('.nav-res');

  const div = document.createElement('div');
  div.className = "btn-nav-res"
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="2.4rem" height="2.4rem" fill="#000000" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path></svg>`

  if (widthWindow <= 1200) {
    if (navbar.contains(navP3)) newParent.appendChild(navP3);
    if (searchParent.contains(search)) newParent.appendChild(search);
    if (navbar.contains(navP2)) newParent.appendChild(navP2);
    if (!navbar.contains(document.querySelector('.btn-nav-res'))) {
      navbar.appendChild(div);
      div.addEventListener('click', openNavRes);
    }
  } else {
    if (navbar.contains(document.querySelector('.btn-nav-res'))) navbar.removeChild(document.querySelector('.btn-nav-res'));
    if (newParent.contains(navP2)) navbar.appendChild(navP2);
    if (newParent.contains(navP3)) navbar.appendChild(navP3);
    if (newParent.contains(search)) searchParent.appendChild(search);
    document.querySelector('.nav-res').classList.remove('open-nav-res')
  }
}

// ------------------------ logout ------------------------------
async function logout() {
  try {
      const response = await fetch('/logout', { method: 'GET', credentials: 'include' });
      if (response.ok) {
          fetchUserProfile();
          console.log("Logout");
      }
  } catch (error) {
      console.error("เกิดข้อผิดพลาดในการ Logout:", error);
  }
}

///////////////////////////////////////////////////////

// Window load
window.addEventListener("DOMContentLoaded", () => {
  fetchUserProfile();
  resNav();
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", searchProduct);
  window.addEventListener('resize', resNav);
  document.querySelector('.btn-close-nav').addEventListener('click', closeNavRes);
  document.getElementById('logoutBtn').addEventListener('click', logout);
});
