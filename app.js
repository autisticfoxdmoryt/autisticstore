document.getElementById('dark-mode').addEventListener('change', function() {
    if (this.checked) {
        document.body.style.backgroundColor = '#121212';
        document.body.style.color = '#e0e0e0';
    } else {
        document.body.style.backgroundColor = '#1e1e1e';
        document.body.style.color = '#ddd';
    }
});
