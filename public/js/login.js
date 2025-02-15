///////////////////////////////////////////////////////

// Selecting Elements
const modalEl = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");

///////////////////////////////////////////////////////

// Show modal
const showModal = function () {
  modalEl.classList.add("open-modal");
  modalContent.classList.add("open-content-modal");
};

///////////////////////////////////////////////////////

// Hidden modal
const hiddenModal = function () {
  modalContent.classList.remove("open-content-modal");
  modalEl.classList.remove("open-modal");
};

///////////////////////////////////////////////////////

// Show eror
const showEror = function (data) {
  document.querySelectorAll(".eror").forEach((e) => (e.innerHTML = "&nbsp;"));

  const erorEmail =
    document.querySelector(".input-email").parentNode.nextElementSibling;
  const erorPassword =
    document.querySelector(".input-password").parentNode.nextElementSibling;

  if (data.message === "This email is not registered") {
    erorEmail.textContent = "อีเมลนี้ยังไม่ได้ลงทะเบียน";
  }

  if (data.message === "Invalid email or password") {
    erorPassword.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
};

///////////////////////////////////////////////////////

// Process login
const processForm = async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    showModal();
    localStorage.setItem("token", data.token); // เก็บ token ใน localStorage
  }

  if (!response.ok) {
    showEror(data);
  }
};

///////////////////////////////////////////////////////

// Change page to home
const goToHome = function () {
  hiddenModal();

  // เปลี่ยนหน้าไป Home
  window.location.href = "/home";
};

///////////////////////////////////////////////////////

// Add event listener
document.querySelector("form").addEventListener("submit", processForm);
document.querySelector(".modal-button").addEventListener("click", goToHome);

///////////////////////////////////////////////////////
