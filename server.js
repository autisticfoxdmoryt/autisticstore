document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const uploadModal = document.getElementById('uploadModal');
    const closeModal = document.getElementById('closeModal');
    const videoList = document.getElementById('videoList');
    const videoPlayer = document.getElementById('videoPlayer');
    const player = document.getElementById('player');
    const videoTitleElem = document.getElementById('videoTitle');
    const videoDescriptionElem = document.getElementById('videoDescription');
    const backButton = document.getElementById('backButton');

    let videos = JSON.parse(localStorage.getItem('videos')) || [];

    function renderVideos() {
        videoList.innerHTML = '';
        videos.forEach((video, index) => {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');
            videoCard.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            `;
            videoCard.addEventListener('click', () => playVideo(index));
            videoList.appendChild(videoCard);
        });
    }

    function playVideo(index) {
        const video = videos[index];
        player.src = video.url;
        videoTitleElem.textContent = video.title;
        videoDescriptionElem.textContent = video.description;
        videoList.style.display = 'none';
        videoPlayer.style.display = 'block';
    }

    uploadButton.addEventListener('click', () => {
        uploadModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        uploadModal.classList.add('hidden');
    });

    document.getElementById('uploadVideo').addEventListener('click', () => {
        const title = document.getElementById('videoTitleInput').value;
        const description = document.getElementById('videoDescriptionInput').value;
        const fileInput = document.getElementById('videoFileInput');
        const file = fileInput.files[0];

        if (title && description && file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const videoUrl = event.target.result;
                const thumbnail = 'https://via.placeholder.com/200x150?text=Thumbnail'; // Placeholder thumbnail

                videos.push({ title, description, url: videoUrl, thumbnail });
                localStorage.setItem('videos', JSON.stringify(videos));

                renderVideos();
                uploadModal.classList.add('hidden');
                fileInput.value = '';
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please fill all fields and select a video file.');
        }
    });

    backButton.addEventListener('click', () => {
        videoPlayer.style.display = 'none';
        videoList.style.display = 'flex';
    });

    renderVideos();
});
