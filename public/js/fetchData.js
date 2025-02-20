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