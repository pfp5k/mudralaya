
    document.addEventListener('DOMContentLoaded', () => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        let currentIndex = 0;
        let autoplayInterval;

        // Function to set the active state
        function setActiveItem(index) {
            if (index < 0 || index >= timelineItems.length) {
                console.error("Invalid timeline index.");
                return;
            }
            
            // 1. Remove active class from ALL items
            timelineItems.forEach(item => {
                item.classList.remove('active');
            });

            // 2. Add active class to the target item
            timelineItems[index].classList.add('active');
            currentIndex = index;
        }

        // Function to advance the timeline
        function advanceTimeline() {
            // Calculate the next index, cycling back to 0 if we hit the end
            let nextIndex = (currentIndex + 1) % timelineItems.length;
            setActiveItem(nextIndex);
        }

        // Start the autoplay function
        function startAutoplay() {
            // Clear any existing interval before starting a new one
            clearInterval(autoplayInterval);
            // Set the interval for 3000 milliseconds (3 seconds)
            autoplayInterval = setInterval(advanceTimeline, 3000);
        }

        // Add Manual Click Listener (Stops Autoplay)
        timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Stop the auto-advance immediately
                clearInterval(autoplayInterval);
                setActiveItem(index);
                // Restart autoplay after a 5-second grace period
                setTimeout(startAutoplay, 5000); 
            });
        });

        // ------------------------------------
        // INITIALIZATION
        // ------------------------------------
        if (timelineItems.length > 0) {
            setActiveItem(0); // Start with the first item active
            startAutoplay();  // Start the automatic sequence
        }
    });
