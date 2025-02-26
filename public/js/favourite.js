function removeRow(element) {
    var row = element.closest('tr');
    row.remove();
  }
  
  const removeFromFavorites = async function(productId, element) {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("กรุณาล็อกอินก่อน");
        return false;
      }
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

// let userFavorites = []; // เก็บ array ของ fav product IDs

// async function fetchFavorites() {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     const res = await fetch("http://localhost:5000/api/user/favorites", {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `${token}`
//       }
//     });
//     const favData = await res.json();
//     userFavorites = favData.map(fav => fav._id.toString());
//     console.log("Favorites loaded:", userFavorites);
//   } catch (error) {
//     console.error("Error fetching favorites:", error);
//   }
// }


// document.addEventListener("DOMContentLoaded", () => {
//     fetchFavorites();
//   });