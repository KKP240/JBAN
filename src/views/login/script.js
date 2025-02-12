///////////////////////////////////////////////////////

// Selecting Elements
const formEl = document.querySelector("form");
const modalEl = document.querySelector(".modal");
const modalBtn = document.querySelector(".modal-button");
const modalContent = document.querySelector(".modal-content");

///////////////////////////////////////////////////////

// Check form data
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
    modalEl.classList.add("open-modal");
    modalContent.classList.add("open-content-modal");
    localStorage.setItem("token", data.token); // เก็บ token ใน localStorage
  }

  if (!response.ok) {
    document.querySelectorAll(".eror").forEach((e) => (e.innerHTML = "&nbsp;"));

    if (data.message === "This email is not registered") {
      const curEl =
        document.querySelector(".input-email").parentNode.nextElementSibling;
      curEl.textContent = "อีเมลนี้ยังไม่ได้ลงทะเบียน";
    }
    if (data.message === "Invalid email or password") {
      const curEl =
        document.querySelector(".input-password").parentNode.nextElementSibling;
      curEl.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
    }
  }
};

///////////////////////////////////////////////////////

// Change page to home
const goToHome = function () {
  // hidden modal
  modalContent.classList.remove("open-content-modal");
  modalEl.classList.remove("open-modal");

  // เปลี่ยนหน้าไป Home
  window.location.href = "/home.html";
};

///////////////////////////////////////////////////////

// Add event listener
formEl.addEventListener("submit", processForm);
modalBtn.addEventListener("click", goToHome);

///////////////////////////////////////////////////////
