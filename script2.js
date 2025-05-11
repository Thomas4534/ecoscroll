
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSdUWop0tbW3gypOoW7cAUSmmyKsb7Kf0",
  authDomain: "ecoscroll-26741.firebaseapp.com",
  databaseURL: "https://ecoscroll-26741-default-rtdb.firebaseio.com",
  projectId: "ecoscroll-26741",
  storageBucket: "ecoscroll-26741.firebasestorage.app",
  messagingSenderId: "241271236440",
  appId: "1:241271236440:web:f7c9db05a09eff219c272d",
  measurementId: "G-92P746FHL7"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Function to update leaderboard
async function updateLeaderboard() {
    const usersRef = ref(db, "users");

    try {
        const snapshot = await get(usersRef);
        if (!snapshot.exists()) {
            displayError("No leaderboard data available.");
            return;
        }

        let users = [];

        snapshot.forEach((childSnapshot) => {
            let user = childSnapshot.key;
            let data = childSnapshot.val();

            if (data.scrollCount !== undefined) {
                users.push({ name: user, scrollCount: data.scrollCount });
            }
        });

        // Sort users by scrollCount in descending order and take the top 10
        users.sort((a, b) => b.scrollCount - a.scrollCount);
        let topUsers = users.slice(0, 10);

        renderLeaderboard(topUsers);
    } catch (error) {
        displayError("Error fetching leaderboard data.");
        console.error("Error fetching data: ", error);
    }
}

// Function to render leaderboard UI
function renderLeaderboard(users) {
    const leaderboard = document.getElementById("leaderboard");

    if (!leaderboard) return; // Prevent errors if the element is missing

    let leaderboardHTML = `
        <h2>Leaderboard</h2>
        <ul class="leaderboard-list">
            ${users.map((user, index) => `<li>#${index + 1} <strong>${user.name}</strong> - ${user.scrollCount}</li>`).join("")}
        </ul>
    `;

    leaderboard.innerHTML = leaderboardHTML;
}

// Function to display an error message in the UI
function displayError(message) {
    const leaderboard = document.getElementById("leaderboard");
    if (leaderboard) {
        leaderboard.innerHTML = `<p class="error">${message}</p>`;
    }
}

// Call function on page load
window.onload = updateLeaderboard;




