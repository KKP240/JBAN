async function validateForm() {
  const account = document.getElementById("account");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const rePassword = document.getElementById("re-password");
  
  clearErrors();
  
  let hasErrors = false;
  
  if (!account.value) {
    showError("account-error", "กรุณากรอกชื่อผู้ใช้");
    hasErrors = true;
  }
  
  if (!email.value) {
    showError("email-error", "กรุณากรอกอีเมล");
    hasErrors = true;
  } else if (!isValidEmail(email.value)) {
    showError("email-error", "กรุณากรอกอีเมลให้ถูกต้อง");
    hasErrors = true;
  }
  
  if (!password.value) {
    showError("password-error", "กรุณากรอกรหัสผ่าน");
    hasErrors = true;
  }
  
  if (!rePassword.value) {
    showError("repassword-error", "กรุณายืนยันรหัสผ่าน");
    hasErrors = true;
  } else if (password.value !== rePassword.value) {
    showError("repassword-error", "รหัสผ่านไม่ตรงกัน");
    hasErrors = true;
  }
  
  // Only proceed with form submission if there are no validation errors
  if (!hasErrors) {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.value,
          email: email.value,
          password: password.value,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        document.getElementById("successModal").style.display = "flex";
      } else {
        const el = document.querySelector("#email");
        const curEl = el.parentNode.nextElementSibling;
        
        if (data.message !== "Server error") {
          if (curEl.textContent === "") {
            showError("email-error", "อีเมลนี้มีอยู่แล้ว");
          }
        } else {
          console.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function clearErrors() {
  const errorElements = document.getElementsByClassName("error-message");
  for (let element of errorElements) {
    element.textContent = "";
  }
}

function showModal() {
  document.getElementById("successModal").style.display = "flex";
}

function clearInput() {
  document.getElementById("account").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("re-password").value = "";
}

function closeModal() {
  document.getElementById("successModal").style.display = "none";
  // Optional: Clear form after successful submission
  clearInput();
}