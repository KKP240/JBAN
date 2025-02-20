function removeRow(element) {
    // Find the <tr> element that contains the <a> and remove it
    var row = element.closest('tr');
    row.remove();
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