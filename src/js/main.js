import { defineCustomElements } from 'https://www.unpkg.com/@mapsindoors/components/dist/esm/loader.js';
import { initializeMapClicks } from './components/mapInteraction/clickListening.js';
import { placeSearch } from './components/search/search.js';


let mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

defineCustomElements();
// Get the venue selector and building selector elements
const venueSelector = document.getElementById('venue-select');
const buildingSelector = document.getElementById('building-select');
const addressDisplay = document.getElementById('building-address');



let buildings; // Declare the buildings variable


function populateVenueSelector(venues) {
  venues.forEach((venue, index) => {
    const option = document.createElement('option');
    option.value = venue.id;
    option.textContent = venue.name;
    venueSelector.appendChild(option);

    // Set the default selected option to the 4th venue in the array for Hide and Keep
    if (index === 3) {
      option.selected = true;
    }
  }); 



  // Trigger building selector population with the first venue
  const firstVenueId = venues[3].id;
  populateBuildingSelector(firstVenueId);
}

// Function to populate the building selector dropdown
function populateBuildingSelector(venueId) {
  mapsindoors.services.VenuesService.getBuildings(venueId).then(retrievedBuildings => {
    buildings = retrievedBuildings; // Update the buildings variable

    // Clear previous options
    buildingSelector.innerHTML = '';

    buildings.forEach(building => {
      const option = document.createElement('option');
      option.value = building.id;
      option.textContent = building.buildingInfo.name; // Use building name from buildingInfo
      buildingSelector.appendChild(option);
    });

    // Set default building's address
    const defaultBuilding = buildings[0];
    console.log(defaultBuilding)
    const defaultAddress = defaultBuilding && defaultBuilding.address;

    if (defaultAddress) {
      addressDisplay.textContent = defaultAddress;
    } else {
      addressDisplay.textContent = 'No address stored';
    }
  });
}

// Event listener for building selector changes
buildingSelector.addEventListener('change', event => {
  const selectedBuildingId = event.target.value;
  const selectedBuilding = buildings.find(building => building.id === selectedBuildingId);
  console.log(selectedBuilding)
  const address = selectedBuilding && selectedBuilding.address;

  if (address) {
    addressDisplay.textContent = address;
  } else {
    addressDisplay.textContent = 'No address stored';
  }
});


export const miMapElement = document.querySelector('mi-map-mapbox');
const mapViewOptions = {
  accessToken: mapboxToken,
  element: document.getElementById('map'),
  center: { lat: 48.146443278182595, lng: 17.130318221624492 },
  zoom: 19,
  maxZoom: 22,
};

const mapViewInstance = new mapsindoors.mapView.MapboxView(mapViewOptions);
const mapsIndoorsInstance = new mapsindoors.MapsIndoors({ mapView: mapViewInstance });
const mapInstance = mapViewInstance.getMap();

// Floor Selector
const floorSelectorElement = document.createElement('div');
new mapsindoors.FloorSelector(floorSelectorElement, mapsIndoorsInstance);
mapInstance.addControl({
  onAdd: function () {
    return floorSelectorElement;
  },
  onRemove: function () {}
});

const miSearchElement = document.getElementById('search-input');
const miListElement = document.getElementById('search-list');

mapsIndoorsInstance.on('ready', () => {
  mapsindoors.services.VenuesService.getVenues().then(venues => {

            console.log(venues);
            const anchorCoordinates = venues[3].anchor.coordinates;
            mapInstance.setCenter(anchorCoordinates);
            // mapsIndoorsInstance.setCenter(anchorCoordinates);
        }).catch(error => {
            console.error(error);
        });
  // Hide MI_BUILDING and MI_VENUE layers on the map. This will prevent them from being clicked.
  mapsIndoorsInstance.setDisplayRule(['MI_BUILDING', 'MI_VENUE'], {
    visible: false
  });

  // Initialize search and click handling
  placeSearch(miSearchElement, miListElement, mapsIndoorsInstance, mapInstance);
  initializeMapClicks(mapsIndoorsInstance, mapInstance);

  // Fetch the venues and populate the venue selector
mapsindoors.services.VenuesService.getVenues().then(venues => {
  populateVenueSelector(venues);

});

// Event listener for venue selector changes
venueSelector.addEventListener('change', event => {
  const selectedVenueId = event.target.value;
  console.log(selectedVenueId)
  populateBuildingSelector(selectedVenueId);

    mapsindoors.services.VenuesService.getVenue(selectedVenueId).then(venue => {
    console.log(venue);
    const anchorCoordinates = venue.anchor.coordinates;
    mapInstance.setCenter(anchorCoordinates);
    mapsIndoorsInstance.setZoom(20);
    miSearchElement.setAttribute('mi-venue', venue.id);
    placeSearchElement.setAttribute('mi-near', venue.id);
  });
});


mapsindoors.services.LocationsService.getLocations({types: 'Unit'})
.then(locations => {
    console.log("Number of locations returned:", locations.length);

    let availableUnits = [];
    let reservedUnits = [];
    let unavailableUnits = [];

    // Randomly assign units to available, reserved, or unavailable
    locations.forEach(location => {
        const randNum = Math.random();

        if (randNum < 0.1) {
            availableUnits.push(location);
        } else if (randNum < 0.2) {
            reservedUnits.push(location);
        } else {
            unavailableUnits.push(location);
        }
    });

    // Extract the MapsIndoors location IDs
    const availableUnitIds = availableUnits.map(location => location.id);
    const reservedUnitIds = reservedUnits.map(location => location.id);
    const unavailableUnitIds = unavailableUnits.map(location => location.id);

    // Apply display rules for each type
    // Customize this part according to the real MapsIndoors instance you have
    mapsIndoorsInstance.setDisplayRule(availableUnitIds, {
        polygonVisible: true,
        polygonFillOpacity: 1,
        polygonZoomFrom: 16,
        polygonZoomTo: 22,
        visible: true,
        polygonFillColor: "#90ee90",  // Green for available
    });

    mapsIndoorsInstance.setDisplayRule(reservedUnitIds, {
        polygonVisible: true,
        polygonFillOpacity: 1,
        polygonZoomFrom: 16,
        polygonZoomTo: 22,
        visible: true,
        polygonFillColor: "#ffcc00",  // Yellow for reserved
    });

    mapsIndoorsInstance.setDisplayRule(unavailableUnitIds, {
        polygonVisible: true,
        polygonFillOpacity: 1,
        polygonZoomFrom: 16,
        polygonZoomTo: 22,
        visible: true,
        polygonFillColor: "#ff0000",  // Red for unavailable
    });

})
.catch(error => {
    console.error("An error occurred:", error);
});



  
  // Retrieve the venues and populate the venue select dropdown
});

// Get the form and the submit button
const form = document.getElementById('work-order-form');
const submitButton = form.querySelector('button[type="submit"]');

// Get the location input field
const locationInput = document.getElementById('work-order-location');

// Disable the submit button initially
submitButton.disabled = true;





// Add an event listener to the form's submit event
form.addEventListener('submit', (event) => {
  // If a location has not been selected, prevent form submission
  if (locationInput.value === '') {
    event.preventDefault();
    alert('Please select a location before submitting the form.');
  }
});

// Enable the submit button whenever the location input field has a value
locationInput.addEventListener('input', () => {
  submitButton.disabled = locationInput.value === '';
});


