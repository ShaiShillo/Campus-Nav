// in global scope so we could return mesh to visable from any function in case of interruption. 
let buildingObjToTempRemove = null;

document.addEventListener('DOMContentLoaded', function () {
  const cleanViewBtn = document.getElementById('cleanViewBtn');
  cleanViewBtn.addEventListener('click', function () {
    cleanView();
    app.render();
  });
});

function cleanView() {
  console.log('Clean View button clicked');
  app.cleanView()
  app.setRotateAnimationMode(false);
  app.controls.autoRotate = false;
  if (buildingObjToTempRemove) {
    buildingObjToTempRemove.visible = true;
  }
  if (app.arrowHelper) {
    app.scene.remove(app.arrowHelper);
  }
  if (timeout_id !== null) {
    clearTimeout(timeout_id);
  }
  app.scene.traverse(function (object) {
    if (
      object.isMesh &&
      object.userData &&
      object.userData.properties &&
      object.userData.properties.length > 0
    ) {
      if (originalMaterials.has(object)) {
        object.material = originalMaterials.get(object); // Restore original material
      }
    }
  });
  closeNotification()
}
function colorSafeBuildings(numberOfBuildings){
    for(let i=0;i<numberOfBuildings.length;i++){
      let building=findObject(numberOfBuildings[i][0],numberOfBuildings[i][1]);
      building.material.color.set(0xff0000); 
      
    }
  }

//Power save action
let flag2 = 0; //flag used to indicate saved buildings once we launch the app
let materials = []; //will hold materials of all buildings
let powerSaveState = false; //state of powersave button
let powerSaveBtn = document.getElementById("powerSave"); //powersave button
powerSaveBtn.addEventListener("click",()=>{
  if(flag2==0){ //will enter only once, to save the materials
    app.scene.traverse(function (object) {
      if (object.isMesh && object.userData && object.userData.properties){
        materials.push({ //adding building data as an object to the array
          object: object,
          material: object.material,
          castShadow: object.castShadow,
          receiveShadow: object.receiveShadow
        });
      }
      flag2 = 1; //setting flag to 1 to not enter here again (Need to save original building just once)
    });
  }
  if(!powerSaveState){
    powerSaveBtn.style.backgroundColor = "#04fa56"; //color powerbutton green
    powerSaveState = true;
    powerSaveBtn.innerHTML = "Power Save : ON";
  app.scene.traverse(function (object) { //traversing buildings and changing material and removing shadowing
    if (object.isMesh && object.userData && object.userData.properties){
      object.material = new THREE.MeshBasicMaterial({
        color: object.material.color,
        flatShading: true,
      });
      if (object.castShadow) {
        object.castShadow = false;
      }
      if (object.receiveShadow){ 
        object.receiveShadow = false;
      }
    }
  });
  } 
else{
  powerSaveState = false;
  powerSaveBtn.style.backgroundColor = "#dd5236"; //power button styling once clicked OFF
  powerSaveBtn.innerHTML = "Power Save : OFF";
  materials.forEach(({ object, material, castShadow, receiveShadow }) => { //Restoring original buildings
    object.material = material;
    object.castShadow = castShadow;
    object.receiveShadow = receiveShadow;
  });
}
  app.render();
});
let isColor=true;
var originalMaterials = new Map();// Map to store original materials

function colorRedProtectedSafe() {
  
  if(isColor){
  
  originalMaterials.clear();
  // First, set all buildings to grey and save original materials
  app.scene.traverse(function (object) {
    if (
      object.isMesh &&
      object.userData &&
      object.userData.properties &&
      object.userData.properties.length > 0
    ) {
      if (!originalMaterials.has(object)) {
        originalMaterials.set(object, object.material); // Save the original material
        object.material = object.material.clone(); // Clone the material for this mesh
      }
      object.material.color.set(0x808080); // Set color to grey
    }
  });
    //colors the protected buildings in red
    var numberOfBuildings=[[6,null],[1,null],[5,217]];
    colorSafeBuildings(numberOfBuildings);
    isColor=false;
  }
 // Now, restore the original materials and colors
 else{
  app.scene.traverse(function (object) {
    if (
      object.isMesh &&
      object.userData &&
      object.userData.properties &&
      object.userData.properties.length > 0
    ) {
      if (originalMaterials.has(object)) {
        object.material = originalMaterials.get(object); // Restore original material
      }
    }
  });
  isColor=true;
}
  
  app.renderer.render(app.scene, app.camera);
}

const searchInput = document.getElementById('search-input'); //search bar
//adds quicksearch element
document.addEventListener('DOMContentLoaded',function(){
  searchInput.addEventListener('keydown',function(event){
    event.stopPropagation(); //Prevents keybindings (like R=Rotate) from being activated when typing in input characters which are binded to actions 
  });
  const searchContainer = document.getElementById('search-container'); //search div container
  const buildingsList = document.getElementById('building-list'); //list of all buildings from database
  buildingsList.addEventListener('mouseover',(e)=>{ //mouse-over search result turns it to cyan
    if(e.target.tagName === 'LI')
      e.target.style.backgroundColor = '#6bfbe8';
  });
  buildingsList.addEventListener('mouseout',(e)=>{ //mouse-out of search result turns it back to white
    if(e.target.tagName === 'LI')
    e.target.style.backgroundColor = "#ddd";
  });
  //quick search creation
  function createQuickSearch() {
    db_data.forEach((building) => { //adding every building in database as a list item
      let listItem = document.createElement('li'); //each building is a list-item
      if(building.room_number!='NULL')
        listItem.textContent = building.room_name +" "+building.room_number+" "+building.building; //text content is name,room number,building number
      else 
        listItem.textContent = building.room_name +" "+building.building; //text content is name,building number if there is no room number
      listItem.style.padding = '5px'; 
      listItem.style.borderRadius = "10px";
      listItem.style.textAlign = "right";
      listItem.style.backgroundColor = "#ddd";
      listItem.addEventListener('click', () => {
        selectBuilding(building.room_name,building.building,building.room_number); //name,building num, room number for the zoom in and finding the building
        searchInput.value = building.room_name +" "+building.room_number+" "+building.building; //after selecting it will be shown in the input box
      });
      buildingsList.appendChild(listItem); //adding the building to the list 
    });
  }

  // Filter buildings based on input
  function filterBuildings() {
    const input = searchInput.value.toLowerCase(); //converting input to lowercase
    const listItems = buildingsList.querySelectorAll('li'); //returns all <li> under buildingList element
    let matchCount = 0; //count of search matches

    if(input ===''){ //if there's no input
      buildingsList.style.display = 'none'; //hide list if it's empty
      return;
    }

    listItems.forEach((item) => { //searching for the matching list item to the given input
      const buildingName = item.textContent.toLowerCase();
      if (buildingName.includes(input)) {
        item.style.display = ''; //displaying the item
        matchCount++;
      }
         else { //if no part of the list item matches the input
        item.style.display = 'none'; //not displaying the item
      }
    });

    // Show or hide the dropdown based on matches
    if (matchCount > 0) {
      buildingsList.style.display = 'block';
    } 
    else {
      buildingsList.style.display = 'none';
    }
  }

  // Handle selecting a building
  function selectBuilding(buildingName,buildingNum,roomNum) {
    searchInput.value = buildingName; // Set input value to selected building
    buildingsList.style.display = 'none'; // Hide the dropdown
    let selectedBuilding = findObject(buildingNum,roomNum); //finding the building with given parameters
    highlightsFeature(buildingNum,roomNum); //highlights building
  }

  searchInput.addEventListener('keyup', filterBuildings); // filters after every letter addition
  createQuickSearch(); // Initialize the search functionality
});

//Ensures so that when a user clicks on something that is not the input box, he will be out of the input box
document.addEventListener('click',function(event){
  if(event.target !== searchInput){
    searchInput.blur(); //input isn't active if user clicked out of it
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const uiContainer = document.querySelector('.ui-buttons-container');
  //create a emergency button
  const colorBuildingsRedBtn = document.createElement('button');
  colorBuildingsRedBtn.className = 'emergencyButton'; // class name
  colorBuildingsRedBtn.textContent = 'Emergency';

  // Append the button to the UI container
  uiContainer.appendChild(colorBuildingsRedBtn);

  colorBuildingsRedBtn.addEventListener('click', function () {
    colorRedProtectedSafe();
  });

  // Function to create a dropdown
  // Function to create a dropdown
  function createDropdown(title, items) {
    const dropdownDiv = document.createElement('div');
    dropdownDiv.className = 'dropdown';

    const button = document.createElement('button');
    button.className = 'btn btn-primary dropdown-toggle';
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'dropdown');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    button.textContent = title;

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-menu';

    items.forEach(item => {
      const buttonItem = document.createElement('button');
      buttonItem.className = 'dropdown-item btn btn-secondary'; // Add btn classes for button styling
      buttonItem.type = 'button'; // Specify the button type
      buttonItem.textContent = item.textContent;

      // You can still use data attributes with buttons
      buttonItem.dataset.building = item.dataset.building;
      buttonItem.dataset.room = item.dataset.room;

      // Append the button to the dropdown content
      dropdownContent.appendChild(buttonItem);
    });

    dropdownDiv.appendChild(button);
    dropdownDiv.appendChild(dropdownContent);
    uiContainer.appendChild(dropdownDiv);
  }

  // Create Buildings dropdown
  const buildings = ['Building 1', 'Building 2', 'Building 3', 'Building 4', 'Building 5', 'Building 6', 'Building 7', 'Building 8'];
  const buildingDivs = buildings.map((building, index) => {
    const div = document.createElement('div');
    div.className = 'dropdown-item';
    div.textContent = building;
    div.dataset.building = index + 1; // Assuming building numbers start at 1
    return div;
  });
  createDropdown('Building', buildingDivs);

  // Populate Courses dropdown from IndexedDB
  function populateDropdownsFromIndexedDB() {
    let openRequest = indexedDB.open('CampusNavDB', 1);

    openRequest.onsuccess = function (e) {
      let db = e.target.result;
      let transaction = db.transaction(['courses'], 'readonly');
      let store = transaction.objectStore('courses');
      let request = store.getAll();

      request.onsuccess = function () {
        const courseDivs = request.result.map(course => {
          const div = document.createElement('div');
          div.className = 'dropdown-item';
          div.textContent = course.class_name;
          div.dataset.building = course.class_building;
          div.dataset.room = course.class_room_number;
          return div;
        });
        createDropdown('Sort by courses', courseDivs);
      };

      request.onerror = function () {
        console.error("Error", request.error);
      };
    };
  }

  // Call the function to populate courses dropdown from IndexedDB
  populateDropdownsFromIndexedDB();




  // Event listener for dropdown item selection
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('dropdown-item')) {
      const buildingNumber = e.target.dataset.building;
      const roomNumber = e.target.dataset.room;
      if (roomNumber !== "undefined" && roomNumber.trim() !== "") {
        // It's a course item
        console.log('Course clicked: Building number:', buildingNumber, 'Room number:', roomNumber);
        // Call highlighting function for room
        highlightsFeature(buildingNumber, roomNumber);
      } else {
        // It's a building item
        console.log('Building clicked: Building number:', buildingNumber);
        // Handle building click (perhaps highlight the entire building or open building-specific information)
        highlightsFeature(buildingNumber, null);
      }
    }
  });
});

//-------------------------------- HIGHLIGHTS  FEATURE --------------------------------

let timeout_id = null; // global for last timeout id to be cleared
let app = window.Q3D.application;

// Clears any ongoing highlights or animations
function resetHighlights() {
  // Reset the rotation speed to default before applying new value
  app.controls.autoRotateSpeed = 0; // Reset to halt any ongoing rotation quickly
  app.renderer.render(app.scene, app.camera); // Immediate render to apply the reset
  if (app && app.scene && app.arrowHelper) {
    app.scene.remove(app.arrowHelper);
    app.arrowHelper = null;
  }

  if (timeout_id !== null) {
    clearTimeout(timeout_id);
  }
  if (buildingObjToTempRemove) {
    buildingObjToTempRemove.visible = true;
  }
  app.setRotateAnimationMode(false); // Ensure no orbit animation is running
  app.controls.autoRotate = false; // Disable auto-rotate
}


// Finds and returns the object with matching building number or ID
function findObject(buildingNumber, roomNumber) {
  let objectToHighlight = null;
  app.scene.traverse(function (object) {
    if (object.isMesh && object.userData && object.userData.properties) {
      let properties = object.userData.properties;


      // If roomNumber is not provided, search for a building with the given buildingNumber
      if ((roomNumber === undefined || roomNumber === null) && properties.length === 1) {
        if (properties[0] == buildingNumber) {
          objectToHighlight = object;
          return true; // Found the building object, stop traversing
        }
      } else {
        // If roomNumber is provided, search for a specific room within the building
        if (properties[2] == buildingNumber && properties[5] == roomNumber) {
          objectToHighlight = object;
          return true; // Found the room object, stop traversing
        }
      }
    }
  });
  return objectToHighlight;
}


function setupArrowHelper(objectToHighlight) {
  let center = objectToHighlight.geometry.boundingSphere.center;
  let heightAboveObject = 75; // Adjust as needed
  let arrowDirection = new THREE.Vector3(0, 0, -0.5); // Direction pointing downwards
  let arrowPosition = new THREE.Vector3(center.x, center.y + 1, center.z + 40).add(arrowDirection.clone().multiplyScalar(-heightAboveObject));
  let arrowLength = heightAboveObject * 0.5;
  let headLength = arrowLength * 0.4;
  let headWidth = headLength * 0.5;

  app.arrowHelper = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1), // Pointing down
    arrowPosition,
    arrowLength,
    0x00018F, // Color
    headLength,
    headWidth
  );
  app.scene.add(app.arrowHelper);
}


function highlightsFeature(buildingNumber, roomNumber) {
  resetHighlights(); // Clear previous highlights and animations
  let objectToHighlight = findObject(buildingNumber, roomNumber);

  if (!objectToHighlight) {
    console.log("No matching object found.");
    return;
  }

  highlightAndFocusOnObject(objectToHighlight);

  // Only process notifications for specific rooms
  if (roomNumber !== undefined && roomNumber !== null) {
    handleBuildingHighlight(buildingNumber);
    handleRoomHighlight(objectToHighlight);
  }
}

function handleRoomHighlight(object) {
  // Find the building object to temporarily hide
  const description = object.userData.properties[1];
  const building = object.userData.properties[2];
  const room = object.userData.properties[5];

  const floor = extractFloorNumber(room);

  const notificationMessage = `Hey! \n Please head to: ${description} \n in building: ${building}\n floor number: ${floor} \n Class number: ${room}`;
  showNotification(notificationMessage);
}

const MIN_FLOOR = 1;
const MAX_FLOOR = 4;

function extractFloorNumber(roomNumber) {
  const floorDigit = roomNumber.toString().charAt(0);
  const floor = parseInt(floorDigit, 10);
  return (floor >= MIN_FLOOR && floor <= MAX_FLOOR) ? floor : '1';
}

function handleBuildingHighlight(buildingNumber) {
  // Find and temporarily hide the building object
  buildingObjToTempRemove = findObject(buildingNumber, null);
  if (buildingObjToTempRemove) {
    buildingObjToTempRemove.visible = false;
    // Remember to reset visibility later if needed
  }
}

function findObjectByLayerId(layerId) {
  let foundObject = null;

  // Assuming 'app.scene' is your main scene object
  app.scene.traverse(function (object) {
    if (object.userData && object.userData.layerId === layerId) {
      foundObject = object;
      return foundObject;  // If you only need the first match, you can return early
    }
  });

  return foundObject;  // Returns the found object or null if not found
}

function highlightAndFocusOnObject(objectToHighlight) {
  let center = objectToHighlight.geometry.boundingSphere.center;
  let distance = app.scene.userData.baseExtent.width * 0.28;
  app.cameraAction.zoom(center.x, center.y, center.z, distance);

  setupArrowHelper(objectToHighlight);

  // Start orbiting
  app.setRotateAnimationMode(true);
  app.controls.autoRotate = true;
  app.controls.autoRotateSpeed = 1.2;
  app.cameraAction.orbit(center.x, center.y, center.z);

  // Highlight the building/room
  app.highlightFeature(objectToHighlight);
  app.renderer.render(app.scene, app.camera);

  // Set a timeout to stop orbiting after 10 seconds
  timeout_id = setTimeout(function () {
    stopOrbiting(objectToHighlight, center, distance);
    if (buildingObjToTempRemove) {
      buildingObjToTempRemove.visible = true;
    }
  }, 10000);
}

function stopOrbiting(objectToHighlight, center, distance) {
  app.setRotateAnimationMode(false);
  app.controls.autoRotate = false;
  app.renderer.render(app.scene, app.camera);
  console.log(`Camera has Stopped orbiting with timeout_id: ${timeout_id}`);
  // Re-center on object at the end of orbit animation
  app.cameraAction.zoom(center.x, center.y, center.z, distance);
  app.highlightFeature(objectToHighlight);
}
//-------------------------------- USER LOCATION ---------------------------------------------------

// first try of creating a marker for studnets location
// function createMarkerMaterial() {
//   console.log("Creating marker material...");
//   const geometry = new THREE.SphereGeometry(5.05, 32, 32);
//   const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//   return new THREE.Mesh(geometry, material);
// }

console.log("Setting up projections and materials...");
// Setting up projections outside to be accessible by all functions
const sourceProjection = proj4('EPSG:4326'); // WGS 84
const destProjection = proj4('EPSG:3857');  // WGS 84 / Pseudo-Mercator



function getLocation() {
  console.log("Attempting to fetch the user's location...");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Fetch user location and check against plane bounds
function showPosition(position) {
  const { latitude, longitude } = position.coords;
  const convertedCoords = proj4(sourceProjection, destProjection, [longitude, latitude]);
  const userLocationVector = new THREE.Vector3(convertedCoords[0], convertedCoords[1], 4.7);
  //const userLocationVector = new THREE.Vector3(4000000.42, 4000000.57, 4.7);//Debugging outside of plane boundries
  //const userLocationVector = new THREE.Vector3(3871293.42, 3765441.57, 4.7); //Debugging  - use fixed coordinates instead of GPS data
  const planeConfig = getPlaneConfig();
  if (planeConfig && isWithinPlaneBounds(userLocationVector, planeConfig)) {
    console.log("User is within the plane bounds.");
    addUserModel(userLocationVector);
  } else {
    console.log("User is outside the plane bounds.");
    showNotification("You are outside the plane bounds.");
  }
}

function showNotification(message) {
  document.getElementById('notification-message').innerText = message;
  document.getElementById('notification-popup').style.display = 'block';
}

function closeNotification() {
  document.getElementById('notification-popup').style.display = 'none';
}

// Add event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('close-notification-btn').addEventListener('click', closeNotification);
});

// Check if user location is within plane bounds
function isWithinPlaneBounds(userLocationVector, planeConfig) {
  const halfWidth = planeConfig.width / 2;
  const halfHeight = planeConfig.height / 2;
  const centerX = planeConfig.center[0];
  const centerY = planeConfig.center[1];

  return (
    userLocationVector.x >= centerX - halfWidth && userLocationVector.x <= centerX + halfWidth &&
    userLocationVector.y >= centerY - halfHeight && userLocationVector.y <= centerY + halfHeight
  );
}

function addUserModel(userLocationVector) {
  // Load the student model and add it to the scene
  const loader = new THREE.GLTFLoader();
  loader.load('student_icon.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(10, 10, 10); // Adjust scale as needed
    model.rotation.x = Math.PI / 2; // Adjust rotation as needed to stand upright
    model.position.copy(userLocationVector); // Position the model
    Q3D.application.scene.add(model);
    console.log("Student model added to the scene");

    Q3D.application.render(); // Ensure the scene is updated
    console.log("Scene rendered with the student model");
  }, undefined, function (error) {
    console.error('An error happened while loading the model', error);
  });
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.error("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.error("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.error("An unknown error occurred.");
      break;
  }
}

// Get Plane Configuration with correct transformations
function getPlaneConfig() {
  let layer = null;
  let flatPlaneLayer = null;

  Q3D.application.scene.traverse(function (object) {
    if (object.isMesh) {
      if (object.userData.layerId === 7) {
        layer = object;
      }
      if (object.userData.layerId === 30) {
        flatPlaneLayer = object;
      }
    }
  });

  if (!layer || !flatPlaneLayer) {
    console.error("Required layers not found.");
    return null;
  }
  const layerCenter = getObjectCenter(layer);
  const flatPlaneWidth = flatPlaneLayer.geometry.parameters.width;
  const flatPlaneHeight = flatPlaneLayer.geometry.parameters.height;

  return {
    width: flatPlaneWidth,
    height: flatPlaneHeight,
    center: [layerCenter.x, layerCenter.y],
    zScale: 1 // Assuming no vertical scaling for simplicity
  };
}

function getObjectCenter(object) {
  if (object.geometry && object.geometry.boundingSphere) {
    const center = object.geometry.boundingSphere.center.clone(); // Cloning to avoid direct reference changes
    return center;
  } else {
    console.error('Bounding sphere not found for the object');
    return new THREE.Vector3(); // Return a default center if not found
  }
}

document.addEventListener('DOMContentLoaded', function () {
  Q3D.application.addEventListener("sceneLoaded", function () {
    console.log("Scene fully loaded, now fetching user location...");
    getLocation();
  });
});



//Add colors to buildings that currently do not have any color
document.addEventListener('DOMContentLoaded', function () {
  // Wait for the Q3D scene to be loaded before proceeding
  Q3D.application.addEventListener("sceneLoaded", function () {
    // Define a function to attempt coloring the building until it's successful
    function attemptToColorBuilding(buildingId) {

      function tryColorBuilding() {
        let building = findObject(buildingId, null);
        if (building) {
          // Generate a random color
          let randomColor = Math.floor(Math.random() * 16777215);
          // Building found, change color to the random color
          building.material.color.setHex(randomColor);
          building.material.needsUpdate = true;
          app.renderer.render(app.scene, app.camera);
        } else {
          // If building is not found, try again after a short delay
          setTimeout(tryColorBuilding, 100);
        }
      }
      // Start the first attempt
      tryColorBuilding();
    }
    // Attempt to color buildings with IDs 1, 3, 4, 6, and 7
    [1, 3, 4, 6, 7].forEach(buildingId => attemptToColorBuilding(buildingId));
  });
});
