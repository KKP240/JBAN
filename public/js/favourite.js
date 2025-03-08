function removeRow(element) {
    var row = element.closest('tr');
    row.remove();
  }
  
  const removeFromFavorites = async function(productId, element) {
    try {
      const res = await fetch(`http://localhost:5000/api/user/favorites/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `${token}`
          credentials: "include"
        }
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("Removed from favorites", data);
        removeRow(element); //
        return true;
      } else {
        console.error("Error:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }
  document.querySelectorAll("#btnSelectProduct").forEach(button => {
    button.addEventListener("click", function() {
      const productId = this.getAttribute("data-product-id");
      if (productId) {
        window.location.href = `/productdetails?id=${productId}`;
      }
    });
  });