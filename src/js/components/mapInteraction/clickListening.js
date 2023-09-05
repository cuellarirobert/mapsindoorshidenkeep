

export function initializeMapClicks(mapsIndoorsInstance, mapInstance) {
  mapsIndoorsInstance.addListener('click', location => {
    handleLocationClick(location, mapsIndoorsInstance, mapInstance);
  });
}

function handleLocationClick(location, mapsIndoorsInstance, mapInstance) {
  console.log(location);
  // Set map to location coordinates and floor
  mapsIndoorsInstance.setFloor(location.properties.floor);
  mapInstance.setCenter(location.properties.anchor.coordinates);

  



// Update the location info table
document.getElementById('location-name').innerText = location.properties.name;
document.getElementById('location-building').innerText = location.properties.building;
document.getElementById('location-venue').innerText = location.properties.venue;
document.getElementById('location-floor').innerText = location.properties.floorName;
document.getElementById('location-type').innerText = location.properties.type;
document.getElementById('location-externalid').innerText = location.properties.externalId;

// Check if the form input element exists, then update its value
const externalIdInput = document.getElementById('location-externalid-input');
if (externalIdInput) {
  externalIdInput.value = location.properties.externalId;
}

  
}
