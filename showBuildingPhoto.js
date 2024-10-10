// Function to display the building photo
function displayBuildingPhoto(buildingId) {
    let photoUrl;
    if (buildingId >= 60 && buildingId < 65) {
        photoUrl = 'hit_photos/img60.jpg'; // Use img60 for buildings with ID between 60 and 64
    } else {
        photoUrl = `hit_photos/img${buildingId}.jpg`; // Regular case, assuming image files are named img1.jpg, img2.jpg, etc.
    }// Assuming the image files are named img1.jpg, img2.jpg, etc.
    
    // Create or get the existing photo container
    let photoContainer = document.getElementById('buildingPhotoContainer');
    if (!photoContainer) {
      photoContainer = document.createElement('div');
      photoContainer.id = 'buildingPhotoContainer';
      photoContainer.style.position = 'absolute';
      photoContainer.style.top = '50%';
      photoContainer.style.left = '50%';
      photoContainer.style.transform = 'translate(-50%, -50%)';
      photoContainer.style.backgroundColor = 'white';
      photoContainer.style.padding = '20px';
      photoContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
      photoContainer.style.zIndex = '1000';
      document.body.appendChild(photoContainer);
    }
  
    // Clear previous content
    photoContainer.innerHTML = '';
  
    // Create and add the image
    const img = document.createElement('img');
    img.src = photoUrl;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '80vh';
    photoContainer.appendChild(img);
  
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.display = 'block';
    closeButton.style.marginTop = '10px';
    closeButton.onclick = () => {
      photoContainer.style.display = 'none';
    };
    photoContainer.appendChild(closeButton);
  
    // Show the container
    photoContainer.style.display = 'block';
  }
  
  // Function to handle the "building photo" button click
  function handleBuildingPhotoClick() {
    const buildingId = getCurrentBuildingId(); // You'll need to implement this function
    if (buildingId) {
      displayBuildingPhoto(buildingId);
    } else {
      alert('No building selected');
    }
  }
  
  // Add event listener to the "building photo" button
  document.addEventListener('DOMContentLoaded', () => {
    const photobtn = document.getElementById('photobtn');
    if (photobtn) {
      photobtn.addEventListener('click', handleBuildingPhotoClick);
    } else {
      console.error('Element with ID "photobtn" not found');
    }
  });
  
  // Helper function to get the current building ID (you need to implement this)
  function getCurrentBuildingId() {
    const attrsTable = document.getElementById('qr_attrs_table');
    if (attrsTable) {
        const rows = attrsTable.getElementsByTagName('tr');
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            if (cells.length > 1 && cells[0].innerText === 'id') {
                const buildingId = parseInt(cells[1].innerText, 10);
                return buildingId; // Return the building ID found
            }
        }
    }
  }
  