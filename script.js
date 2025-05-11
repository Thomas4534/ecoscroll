import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",  // Replace with your API key
  authDomain: "your-project-id.firebaseapp.com",  // Replace with your Firebase project's auth domain
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",  // Replace with your Firebase Realtime Database URL
  projectId: "your-project-id",  // Replace with your Firebase project ID
  storageBucket: "your-project-id.appspot.com",  // Replace with your Firebase storage bucket
  messagingSenderId: "your-messaging-sender-id",  // Replace with your Firebase sender ID
  appId: "your-app-id",  // Replace with your Firebase app ID
  measurementId: "your-measurement-id"  // Replace with your Firebase measurement ID
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

                // Store login status in sessionStorage ONLY if the password matches
                sessionStorage.setItem('userLoggedIn', 'true');

                // Hide login form and show the scrolling app
                loginFormContainer.style.display = 'none';
                scrollingApp.style.display = 'block';

                // Retrieve user's scroll count from Firebase
                currentScrollCount = snapshot.val().scrollCount || 0;
                scrollCountDisplay.innerText = `Scrolled: ${currentScrollCount}`;

                // Show intro page after successful login
                showIntroPage();
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






//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//-------------------------------------------------------------------#--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------#--------------------------------------------------------------------#--------------------------------------------------------------------#--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------







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

const container = document.getElementById('scrollingApp');





//----------------------------------------------------------------------------------------------------------------------


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}









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

let items = [];








function AddVideos() {
    const videos = [
        { title: "Video 1", filename: "Earth's Hottest in Millennia_ Climate Alarm.mp4" },
        { title: "Video 2", filename: "The Fastest Warming in Earth's History - And We're the Cause.mp4" },
        { title: "Video 3", filename: "The Real Cost of Ignoring Climate Change.mp4" }
    ];

    videos.forEach(video => {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'item';


        const videoElement = document.createElement('video');
        videoElement.setAttribute('controls', true);
        videoElement.setAttribute('src', `videos/${video.filename}`);


        videoDiv.appendChild(videoElement);

        items.push(videoDiv);


        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(videoElement);
    });
}
















function generateNewsItems(newsText) {
    if (!container) {
        console.error("Container not found!");
        return;
    }

    const entries = newsText.split('--------------------------------------------------').filter(Boolean);


    AddVideos();



    function createItems() {
        entries.forEach(entry => {





            const lines = entry.trim().split('\n');
            const url = lines[0].replace('Website URL: ', '').trim();
            const imageUrlLineIndex = lines.findIndex(line => line.startsWith('image_url: '));
            const imageUrl = imageUrlLineIndex !== -1 ? lines[imageUrlLineIndex].replace('image_url: ', '').trim() : null;
            const summaryLines = lines.slice(1, imageUrlLineIndex !== -1 ? imageUrlLineIndex : undefined).join(' ').replace('First Three Sentences of the Summary:', '').trim();
            const sentences = summaryLines.split('. ').map(sentence => sentence.trim().replace(/\.$/, '')).filter(Boolean);




            if (sentences.length >= 3) {


                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';


                const textContainer = document.createElement('div');
                textContainer.className = 'text-container';


                const h1 = document.createElement('h1');
                h1.textContent = toTitleCase(sentences[0]);
                h1.className = 'news-title';

                const p = document.createElement('p');
                p.textContent = `${sentences[1]}. ${sentences[2]}.`;
                p.className = 'news-summary';

                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = 'Read the whole story here.';


                textContainer.appendChild(h1);
                textContainer.appendChild(p);
                textContainer.appendChild(link);
                itemDiv.appendChild(textContainer);



//PROBELLMMMMMMMMMMMMMMMMMMm--------------------------------------------------------------------------------------------
                if (imageUrl) {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.className = 'news-image';
                    img.loading = 'lazy'; // Lazy load the image
                    itemDiv.appendChild(img);
                }


                items.push(itemDiv);

                shuffleArray(items);

                




                const fragment = document.createDocumentFragment();







                items.forEach(item => {
                    fragment.appendChild(item);

                    const button = document.createElement("button");
                    button.classList.add("styled-button", "position-1");
                    button.innerHTML = "See the Leaderboard";
                    button.onclick = function() {
                        window.location.href = '56.html';
                    };
                    //fragment.appendChild(button);
                });

                container.appendChild(fragment);


            }
        });

    }

    createItems();
}









let itemIndex = 0;
const batchSize = 5;

function loadMoreItems() {
    if (itemIndex >= items.length) {
        console.log("Fetching more items...");
        fetchMoreItems(); // Function to get more items (define this separately)
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < batchSize && itemIndex < items.length; i++) {
        const item = items[itemIndex];
        fragment.appendChild(item);
        itemIndex++;
    }

    container.appendChild(fragment);
}

scrollingApp.addEventListener('scroll', () => {
    if (scrollingApp.scrollTop + scrollingApp.clientHeight >= scrollingApp.scrollHeight - 10) {
        loadMoreItems();
    }
});







function fetchMoreItems() {
    // Simulating an API fetch with a delay
    setTimeout(() => {
        for (let i = 0; i < batchSize; i++) {
            const newItem = document.createElement("div");
            newItem.innerText = `Item ${items.length + 1}`;
            newItem.classList.add("item");
            items.push(newItem);
        }
        console.log("New items added! Total:", items.length);
        loadMoreItems(); // Call again after new items are added
    }, 1000);
}












document.addEventListener('DOMContentLoaded', () => {
    const introPage = document.getElementById('intro-page');
    const startButton = document.getElementById('start-button');

    // Check if the user is logged in using sessionStorage
    if (isUserLoggedIn()) {
        showIntroPage(); // Show the intro page if the user is logged in
    } else {
        introPage.style.display = 'none'; // Hide the intro page if not logged in
    }

    // Hide the intro page after clicking the 'Enter' button
    startButton.addEventListener('click', () => {
        introPage.style.display = 'none';
    });
});

// Function to show the intro page
function showIntroPage() {
    const introPage = document.getElementById('intro-page');
    introPage.style.display = 'flex'; // Show the intro page
}

// Function to check if the user is logged in
function isUserLoggedIn() {
    return sessionStorage.getItem('userLoggedIn') === 'true';
}





















// Fetch the content of the .txt file and generate news items
fetch('file.txt')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(buffer);
    generateNewsItems(text);
  })
  .catch(error => console.error('Error loading the news file:', error));
