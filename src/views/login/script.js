///////////////////////////////////////////////////////

// Selecting Elements
const formEl = document.querySelector("form");

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
    alert("เข้าสู่ระบบ!");
    localStorage.setItem("token", data.token); // เก็บ token ใน localStorage
    window.location.href = "/index.html"; // เปลี่ยนหน้า
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

// Add event listener
formEl.addEventListener("submit", processForm);

///////////////////////////////////////////////////////
