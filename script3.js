
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(); // Initialize Firebase Realtime Database

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginFormContainer = document.getElementById('loginFormContainer');
const signupFormContainer = document.getElementById('signupFormContainer');
const scrollingApp = document.getElementById('scrollingApp');
const scrollCountDisplay = document.getElementById('scrollCount');
const accounts = {};
let currentItemIndex = 0;
let timer;
const posts = [];
const progressBars = [];
const totalTime = 3000;
const interval = 50;
const database = getDatabase(app);



let currentScrollCount = 0;

document.getElementById('goToSignup').addEventListener('click', () => {
    loginFormContainer.style.display = 'none';
    signupFormContainer.style.display = 'block';
});

document.getElementById('goToLogin').addEventListener('click', () => {
    signupFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
});




loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Check if the username exists in Firebase
    const userRef = ref(db, 'users/' + username);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const storedPassword = snapshot.val().password;
            if (storedPassword === password) {
                alert('Login successful!');
                loginFormContainer.style.display = 'none';
                scrollingApp.style.display = 'block';

                // Retrieve user's scroll count from Firebase
                currentScrollCount = snapshot.val().scrollCount || 0;
                scrollCountDisplay.innerText = `Scrolled: ${currentScrollCount}`;
            } else {
                alert('Incorrect password.');
            }
        } else {
            alert('Username not found.');
        }
    }).catch((error) => {
        console.error("Error retrieving user data: ", error);
    });
});






signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    // Check if the username already exists in Firebase
    const userRef = ref(db, 'users/' + username);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            alert('Username already exists.');
        } else {
            // Store the new user data in Firebase with initial scroll count of 0
            set(ref(db, 'users/' + username), {
                password: password,  // Store the password
                scrollCount: 0       // Initialize scroll count as 0
            }).then(() => {
                console.log("User added to Firebase!");
                alert('Account created successfully!');
                signupForm.reset();
                signupFormContainer.style.display = 'none';
                loginFormContainer.style.display = 'block';
            }).catch((error) => {
                console.error("Error adding user to Firebase: ", error);
            });
        }
    }).catch((error) => {
        console.error("Error checking username: ", error);
    });
});




scrollingApp.addEventListener('scroll', () => {
    const items = document.querySelectorAll('.item');
    const threshold = 50;

    items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.top > -threshold) {
            if (!item.classList.contains('scrolled')) {
                item.classList.add('scrolled');
                currentScrollCount++;
                scrollCountDisplay.innerText = `Scrolled: ${currentScrollCount}`;

                // Update scroll count in Firebase
                const username = document.getElementById('loginUsername').value;
                const userRef = ref(db, 'users/' + username);
                update(userRef, {
                    scrollCount: currentScrollCount
                }).catch((error) => {
                    console.error("Error updating scroll count in Firebase: ", error);
                });
            }
        }
    });
});
//----------------------------------------------------------------------------------------------------------------------



















//----------------------------------------------------------------------------------------------------------------------


function shuffleItemsOnLoad() {
  const container = document.getElementById('scrollingApp');
  const items = Array.from(container.children);

  items.sort(() => Math.random() - 0.5);

  container.innerHTML = '';
  items.forEach(item => container.appendChild(item));
}

window.onload = shuffleItemsOnLoad;









//----------------------------------------------------------------------------------------------------------------------


// Function to convert a string to title case
function toTitleCase(str) {
  const smallWords = ['and', 'or', 'but', 'the', 'a', 'an', 'in', 'on', 'with', 'at', 'by', 'for', 'to', 'of', 'up']; // Words to keep lowercase
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index, array) => {
      // Always capitalize the first and last word
      if (index === 0 || index === array.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Capitalize if it's not a small word
      return smallWords.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Function to create HTML for each news entry--------------------------------------------------------------------------


function generateNewsItems(newsText) {
  const container = document.getElementById('scrollingApp');
  const entries = newsText.split('--------------------------------------------------').filter(Boolean); // Split by separator

  // Combine the videos and news items into a single array
  const videos = [
    { title: "Video 1", filename: "Earth's Hottest in Millennia_ Climate Alarm.mp4" },
    { title: "Video 2", filename: "video2.mp4" },
    { title: "Video 3", filename: "video3.mp4" },
  ];

  // Combine the video and news entries into one array to be processed
  let allItems = [...entries];

  // Randomly insert videos into the list
  videos.forEach(video => {
    allItems.push({ type: "video", videoData: video });
  });

  // Shuffle the array if you want random placement of videos and news
  allItems = shuffleArray(allItems);

  allItems.forEach(item => {
    if (item.type === "video") {
      // Handle video item
      const videoDiv = document.createElement('div');
      videoDiv.className = 'item';

      const h2 = document.createElement('h2');
      h2.textContent = item.videoData.title;

      const videoElement = document.createElement('video');
      videoElement.setAttribute('controls', true);
      videoElement.setAttribute('src', `videos/${item.videoData.filename}`);

      videoDiv.appendChild(h2);
      videoDiv.appendChild(videoElement);

      container.appendChild(videoDiv);
    } else {
      // Handle text-based news item
      const lines = item.trim().split('\n');
      const url = lines[0].replace('Website URL: ', '').trim();
      const imageUrlLine = lines.find(line => line.startsWith('image_url: '));
      const imageUrl = imageUrlLine ? imageUrlLine.replace('image_url: ', '').trim() : null;
      const summary = lines.slice(1).join(' ').replace('First Three Sentences of the Summary:', '').trim();
      const sentences = summary.split('. ').filter(Boolean);

      if (sentences.length >= 3) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';

        const h1 = document.createElement('h1');
        h1.textContent = toTitleCase(sentences[0]);

        const p = document.createElement('p');
        p.textContent = `${sentences[1]}. ${sentences[2]}.`;

        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = 'Read the whole story here.';

        if (imageUrl) {
          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = 'News Image';
          img.className = 'news-image';
          itemDiv.appendChild(img);
        }

        itemDiv.appendChild(h1);
        itemDiv.appendChild(p);
        itemDiv.appendChild(link);

        container.appendChild(itemDiv);
      }
    }
  });
}

// Function to shuffle array for random video placement
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

































// Assuming you have a container in your HTML like this:
const container = document.getElementById('scrollingApp');

// Function to add videos dynamically
function addVideos() {
  const videos = [
    { title: "Video 1", filename: "Earth's Hottest in Millennia_ Climate Alarm.mp4" },
    { title: "Video 2", filename: "video2.mp4" },
    { title: "Video 3", filename: "video3.mp4" },
    // Add more video objects here as needed
  ];

  // Iterate over each video entry
  videos.forEach(video => {
    // Create a div to hold each video item
    const videoDiv = document.createElement('div');
    videoDiv.className = 'item';

    // Create a title for the video
    const h2 = document.createElement('h2');
    h2.textContent = video.title;

    // Create the video element
    const videoElement = document.createElement('video');
    videoElement.setAttribute('controls', true); // To enable controls (play, pause, etc.)
    videoElement.setAttribute('src', `videos/${video.filename}`); // Assuming video files are in the "videos" folder

    // Append the title and video element to the video div
    videoDiv.appendChild(h2);
    videoDiv.appendChild(videoElement);

    // Append the video div to the container
    container.appendChild(videoDiv);
  });
}

// Call the function to add videos
addVideos();


















// Fetch the content of the .txt file and generate news items
fetch('file.txt')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    generateNewsItems(text);
  })
  .catch(error => console.error('Error loading the news file:', error));

