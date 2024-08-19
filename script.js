document.addEventListener('DOMContentLoaded', () => {
    const lightModeButton = document.getElementById('lightMode');
    const darkModeButton = document.getElementById('darkMode');
    const startAnnouncementButton = document.getElementById('startAnnouncement');
    const stopAnnouncementButton = document.getElementById('stopAnnouncement');
    const announcementTimeDisplay = document.getElementById('announcementTime');
    const announcementItems = document.getElementById('announcementItems');

    let announcementStartTime;
    let announcementInterval;

    // Dark mode toggle
    darkModeButton.addEventListener('click', () => {
        document.body.classList.add('dark-mode');
    });

    // Light mode toggle
    lightModeButton.addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
    });

    // Start announcement timer
    startAnnouncementButton.addEventListener('click', () => {
        if (announcementInterval) return; // Prevent multiple intervals

        announcementStartTime = Date.now();
        announcementInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - announcementStartTime) / 1000);
            announcementTimeDisplay.textContent = `Announcement Time: ${elapsedSeconds} seconds`;
        }, 1000);

        // Add announcement to list
        const announcementItem = document.createElement('li');
        announcementItem.textContent = `Announcement started at ${new Date(announcementStartTime).toLocaleTimeString()}`;
        announcementItems.appendChild(announcementItem);
    });

    // Stop announcement timer
    stopAnnouncementButton.addEventListener('click', () => {
        if (announcementInterval) {
            clearInterval(announcementInterval);
            announcementInterval = null;

            const elapsedSeconds = Math.floor((Date.now() - announcementStartTime) / 1000);
            announcementTimeDisplay.textContent = `Announcement Time: ${elapsedSeconds} seconds`;

            // Update announcement in list
            const announcementItem = announcementItems.lastElementChild;
            announcementItem.textContent += ` - Stopped at ${new Date().toLocaleTimeString()}`;
        }
    });
});
