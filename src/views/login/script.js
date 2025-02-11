document
  .querySelector("form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

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
      window.location.href = "/dashboard.html"; // เปลี่ยนหน้า
    } else {
      alert("Error: " + data.message);
    }
  });
