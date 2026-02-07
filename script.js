let map;
let service;
let geocoder;
let companyLatLng; // Stores LatLng for company location
let searchResults = []; // Stores the current search results
let favoriteRestaurants = JSON.parse(localStorage.getItem('favoriteRestaurants')) || [];

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 }, // Default center, will be updated
        zoom: 15,
    });
    service = new google.maps.places.PlacesService(map);

    document.getElementById('search-btn').addEventListener('click', findRestaurants);
    document.getElementById('random-favorite-btn').addEventListener('click', getRandomFavorite);
    document.getElementById('random-search-result-btn').addEventListener('click', getRandomSearchResult);

    renderFavorites(); // Display favorites on load
}

function findRestaurants() {
    const locationInput = document.getElementById('company-location').value;
    if (!locationInput) {
        alert('Please enter your company location.');
        return;
    }

    geocoder.geocode({ address: locationInput }, (results, status) => {
        if (status === 'OK' && results[0]) {
            companyLatLng = results[0].geometry.location;
            map.setCenter(companyLatLng);

            const request = {
                location: companyLatLng,
                radius: 1000, // 1km radius
                type: ['restaurant'],
            };

            service.nearbySearch(request, (places, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && places) {
                    searchResults = places; // Store results
                    displaySearchResults(places);
                    document.getElementById('random-search-result-btn').style.display = 'block';
                } else {
                    document.getElementById('search-results').innerHTML = '<p class="placeholder">No restaurants found near this location.</p>';
                    document.getElementById('random-search-result-btn').style.display = 'none';
                    searchResults = [];
                }
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
            document.getElementById('search-results').innerHTML = '<p class="placeholder">Could not find location. Please try again.</p>';
            document.getElementById('random-search-result-btn').style.display = 'none';
            searchResults = [];
        }
    });
}

function displaySearchResults(places) {
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = '';
    if (places.length === 0) {
        searchResultsDiv.innerHTML = '<p class="placeholder">No restaurants found near this location.</p>';
        return;
    }

    places.forEach(place => {
        const item = document.createElement('div');
        item.classList.add('restaurant-item');
        item.innerHTML = `
            <span>${place.name}</span>
            <button data-place-id="${place.place_id}" data-place-name="${place.name}">Add to Favorites</button>
        `;
        searchResultsDiv.appendChild(item);
    });

    // Add event listeners for "Add to Favorites" buttons
    searchResultsDiv.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', addFavorite);
    });
}

function renderFavorites() {
    const favoritesListDiv = document.getElementById('favorites-list');
    favoritesListDiv.innerHTML = '';

    if (favoriteRestaurants.length === 0) {
        favoritesListDiv.innerHTML = '<p class="placeholder">Save restaurants from the search results to see them here.</p>';
        document.getElementById('no-favorites-message').style.display = 'block';
        return;
    }

    document.getElementById('no-favorites-message').style.display = 'none';
    favoriteRestaurants.forEach(fav => {
        const item = document.createElement('div');
        item.classList.add('restaurant-item');
        item.innerHTML = `
            <span>${fav.name}</span>
            <button class="remove-fav-btn" data-place-id="${fav.place_id}">Remove</button>
        `;
        favoritesListDiv.appendChild(item);
    });

    favoritesListDiv.querySelectorAll('.remove-fav-btn').forEach(button => {
        button.addEventListener('click', removeFavorite);
    });
}

function addFavorite(event) {
    const button = event.target;
    const placeId = button.dataset.placeId;
    const placeName = button.dataset.placeName;

    const isAlreadyFavorite = favoriteRestaurants.some(fav => fav.place_id === placeId);
    if (!isAlreadyFavorite) {
        favoriteRestaurants.push({ place_id: placeId, name: placeName });
        localStorage.setItem('favoriteRestaurants', JSON.stringify(favoriteRestaurants));
        renderFavorites();
        alert(`${placeName} added to favorites!`);
    } else {
        alert(`${placeName} is already in your favorites.`);
    }
}

function removeFavorite(event) {
    const button = event.target;
    const placeId = button.dataset.placeId;

    favoriteRestaurants = favoriteRestaurants.filter(fav => fav.place_id !== placeId);
    localStorage.setItem('favoriteRestaurants', JSON.stringify(favoriteRestaurants));
    renderFavorites();
    alert('Restaurant removed from favorites.');
}

function getRandomFavorite() {
    if (favoriteRestaurants.length === 0) {
        alert('You need to add some favorite restaurants first!');
        return;
    }
    const randomIndex = Math.floor(Math.random() * favoriteRestaurants.length);
    const randomRestaurant = favoriteRestaurants[randomIndex];
    alert(`Today's random favorite recommendation: ${randomRestaurant.name}`);
}

function getRandomSearchResult() {
    if (searchResults.length === 0) {
        alert('Please search for restaurants first!');
        return;
    }
    const randomIndex = Math.floor(Math.random() * searchResults.length);
    const randomRestaurant = searchResults[randomIndex];
    alert(`Today's random recommendation from search results: ${randomRestaurant.name}`);
}

// Make initMap globally accessible as required by Google Maps API
window.initMap = initMap;