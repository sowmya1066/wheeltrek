"use strict";

// Selecting necessary elements
const form = document.querySelector(".form");
const inputDistance = document.querySelector(".distance");
const inputDuration = document.querySelector(".duration");
const inputElevation = document.querySelector(".elevation");
const submittedValues = document.querySelector(".submitted-values");
let map,
  mapEvent,
  markers = [];

// Function to initialize the map
function initializeMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude, longitude } = position.coords;

        // Creating the map
        map = L.map("map").setView([latitude, longitude], 13);

        // Adding OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Adding marker on map click
        map.on("click", function (mapE) {
          mapEvent = mapE;
          form.classList.remove("hidden");
          inputDistance.focus();
        });
      },
      function () {
        alert("Could not get your position.");
      }
    );
  }
}

// Function to add marker and display submitted values
function addMarkerAndDisplayValues() {
  const { lat, lng } = mapEvent.latlng;
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const distance = parseFloat(inputDistance.value);
  const duration = parseFloat(inputDuration.value);
  const elevation = parseFloat(inputElevation.value);

  // Check if inputs are valid positive numbers
  if (
    isNaN(distance) ||
    isNaN(duration) ||
    isNaN(elevation) ||
    distance <= 0 ||
    duration <= 0 ||
    elevation <= 0
  ) {
    alert("Please enter valid data :)");
    return;
  }

  // Creating marker and adding it to the map
  const marker = L.marker([lat, lng]).addTo(map);
  marker
    .bindPopup(`<p>Cycling on ${currentDate}</p>`, {
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: "running-popup",
    })
    .openPopup();
  markers.push(marker);

  // Displaying submitted values with current date
  const newValues = document.createElement("div");
  newValues.innerHTML = `
    <p class="submitted-value" data-lat="${lat}" data-lng="${lng}">
      Cycling on ${currentDate}<br>
      🚴‍♀️ ${distance} KM &nbsp;&nbsp;&nbsp;⏱ ${duration} MIN &nbsp;&nbsp;&nbsp;
      ⛰️ ${elevation} m &nbsp;&nbsp;&nbsp; <br>
      ⚡️${distance / duration} KM/H
    </p>
  `;
  submittedValues.appendChild(newValues);

  // Hide the form after submitting
  form.classList.add("hidden");

  // Clearing form fields
  inputDistance.value = "";
  inputDuration.value = "";
  inputElevation.value = "";
}

// Event listener for form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();
  addMarkerAndDisplayValues();
});

// Event listener for form submission using Enter key
form.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addMarkerAndDisplayValues();
  }
});

// Event listener for clicking on submitted values to show marker on map
submittedValues.addEventListener("click", function (e) {
  if (e.target.classList.contains("submitted-value")) {
    const lat = parseFloat(e.target.dataset.lat);
    const lng = parseFloat(e.target.dataset.lng);
    map.setView([lat, lng], 13);
  }
});

// Initializing the map when the page loads
initializeMap();
