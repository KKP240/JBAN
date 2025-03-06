///////////////////////////////////////////////////////

// Fetch products
export const fetchProduct = async function () {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    console.log(data)
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

// Check role admin
export const getRoleUser = async function(){
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include", // เวลาจะใช้ token ทำแบบนี้ 
    });
    const user = await res.json();
    console.log(user.role)
    return user.role;
  }catch (err) {
    console.log(err.message)
  }
}