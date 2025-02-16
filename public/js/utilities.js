///////////////////////////////////////////////////////

// Fetch user data
const fetchUserProfile = async function () {
  const userEl = document.querySelector(".user");

  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/auth/me", {
    headers: { Authorization: `${token}` },
  });

  if (response.ok) {
    const user = await response.json();

    userEl.innerHTML = `<div class="username">
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
                                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z">
                                  </path>
                              </svg>
                              <div>${user.name}</div>
                              <div class="drop-menu">
                                  <ul class="drop-menu__list">
                                      <li class="drop-menu__item"><a href="/orderHistory" class="drop-menu__link">ประวัติคำสั่งซื้อ</a></li>
                                      <li class="drop-menu__item"><a href="/logout" class="drop-menu__link">ออกจากระบบ</a></li>
                                  </ul>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256" class="drop-menu__icon">
                                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z">
                                  </path>
                              </svg>
                          </div>`;
    document.querySelector(".username").addEventListener("click", openDropdown);
    window.addEventListener("click", closeDropdownWindow);
  }

  if (!response.ok) {
    userEl.innerHTML = `<a href="/login" class="btn-login">เข้าสู่ระบบ</a>`;
  }
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

// Window load
window.addEventListener("DOMContentLoaded", () => {
  fetchUserProfile();
  fetchProduct();
  document
    .querySelector(".menu-detail__list")
    .addEventListener("click", openHideMenu);
});
