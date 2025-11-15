document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-animate-link');

    // --- 1. Dynamic Scroll Effect Logic ---
    window.addEventListener('scroll', () => {
        // Activate the 'scrolled' class when the user scrolls past 50 pixels
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Dynamic Active Link Logic ---
    
    // Set 'Home' as active by default on load (since we removed it from HTML)
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    // Add click listener to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default link action (optional, depends on if these are placeholders)
            e.preventDefault(); 
            
            // Remove 'active' class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add 'active' class to the clicked link
            e.target.classList.add('active');
        });
    });
});


// for fetching header data from json file
// header.js
fetch('header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  })
  .catch(err => console.error('Header load failed:', err));

