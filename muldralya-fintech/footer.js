// This script runs when the page is loaded
fetch('footer.html')
  .then(response => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    // Parse the HTML and extract only the footer content
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const footerContent = doc.querySelector('footer.site-footer');
    
    // Try to find footer element with either class name
    const footerElement = document.querySelector('.site-footer-a') || document.querySelector('.site-footer');
    
    if (footerElement && footerContent) {
        // Inject the inner HTML of the footer (without the footer tag itself, or with it)
        footerElement.innerHTML = footerContent.innerHTML;
        // Also copy the class to ensure styling works
        footerElement.className = 'site-footer';
    } else if (footerElement) {
        console.error('Footer content not found in footer.html');
    } else {
        console.error('Footer element not found on page. Looking for .site-footer-a or .site-footer');
    }
  })
  .catch(error => {
    console.error('Error loading footer:', error);
  });