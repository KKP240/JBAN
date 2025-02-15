async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    console.log(token)
    const response = await fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `${token}` }
    });
    if (response.ok) {
      const user = await response.json();
      document.querySelector('.username').textContent = user.name;
      console.log(user)
    }
  }

fetchUserProfile()
