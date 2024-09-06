const BASE_URL = 'https://huo3cdzxv8.execute-api.us-east-1.amazonaws.com/dev'; 

async function fetchImagePaths() {
    try {
        const response = await fetch(`${BASE_URL}/imagePath`);
        const data = await response.json();

        if (response.ok) {
            const paths = JSON.parse(data.body); 
            paths.forEach(pathObj => {
                fetchImage(`${pathObj.path}/0.jpeg`); 
            });
        } else {
            console.error('Error fetching image paths:', data);
        }
    } catch (error) {
        console.error('Error fetching image paths:', error);
    }
}

async function fetchImage(key) {
    try {
        const response = await fetch(`${BASE_URL}/images?key=${key}`);
        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            const gallery = document.getElementById('gallery');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Furniture Image';
            img.classList.add('gallery-image');
            gallery.appendChild(img);
        } else {
            console.error('Error fetching image:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

fetchImagePaths();
