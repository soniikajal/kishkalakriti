document.addEventListener('DOMContentLoaded', function() {
    // Function to set up mobile menu
    function setupMobileMenu() {
        // Check window width for mobile view
        const isMobile = window.innerWidth <= 576;
        
        // Elements we'll need to modify
        const navbar = document.querySelector('.navbar');
        const navOps = document.querySelector('.nav-ops');
        const social = document.querySelector('.social');
        const navLogo = document.querySelector('.nav-logo');
        let menuButton = document.querySelector('.menu-button');
        
        if (isMobile) {
            // Mobile view - ensure we have a menu button
            if (!menuButton) {
                // Create menu button if it doesn't exist
                menuButton = document.createElement('button');
                menuButton.className = 'menu-button';
                menuButton.setAttribute('aria-label', 'Toggle navigation menu');
                
                // Insert the button after the logo
                if (navLogo) {
                    navLogo.after(menuButton);
                } else if (navbar) {
                    // Fallback if nav logo doesn't exist
                    navbar.prepend(menuButton);
                }
            }
            
            // Ensure menu button is visible
            if (menuButton) {
                menuButton.style.display = 'block';
                
                // Add click event listener to toggle menu - add only once
                if (!menuButton.hasAttribute('data-event-added')) {
                    menuButton.setAttribute('data-event-added', 'true');
                    menuButton.addEventListener('click', function() {
                        navbar.classList.toggle('menu-active');
                        
                        // Update display based on menu-active class
                        if (navbar.classList.contains('menu-active')) {
                            if (navOps) navOps.style.display = 'flex';
                            if (social) social.style.display = 'flex';
                        } else {
                            if (navOps) navOps.style.display = 'none';
                            if (social) social.style.display = 'none';
                        }
                    });
                }
            }
            
            // Always start with menu closed on mobile unless manually opened
            if (!navbar.classList.contains('menu-active')) {
                if (navOps) navOps.style.display = 'none';
                if (social) social.style.display = 'none';
            }
        } else {
            // Desktop/tablet view - ensure menu is always visible
            if (navOps) navOps.style.display = 'flex';
            if (social) social.style.display = 'flex';
            
            // Hide menu button if it exists
            if (menuButton) {
                menuButton.style.display = 'none';
            }
            
            // Remove menu-active class for desktop
            if (navbar) navbar.classList.remove('menu-active');
        }
    }
    
    // Initialize mobile menu on every page load
    setupMobileMenu();
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        setupMobileMenu();
    });
    
    // Add Windows-specific adjustments
    function checkBrowserCompatibility() {
        const isWindows = navigator.userAgent.indexOf("Windows") != -1;
        if (isWindows) {
            // Apply any Windows-specific CSS adjustments if needed
            document.documentElement.classList.add('windows-device');
        }
    }
    
    // Call the compatibility check
    checkBrowserCompatibility();
    
    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        // Handle form submission
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get the email value
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Google Form submission URL - Replace with your actual form ID
            const formId = '1FAIpQLSd3j9bJBYiY0qSpcBaje5ldT2xm76WDi9WsoZTJlyva2qDcUw';
            const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
            
            // Create form data with the correct entry ID
            // entry.2108832233 is your Google Form's field ID
            const formData = new FormData();
            formData.append('entry.2108832233', email);
            
            // Use a hidden iframe to submit the form (to avoid CORS issues)
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Create a form within the iframe and submit it
            iframe.contentDocument.write(`
                <form id="hidden-form" action="${formUrl}" method="POST">
                    <input name="entry.2108832233" value="${email}">
                </form>
                <script>document.getElementById('hidden-form').submit();</script>
            `);
            
            // Clear the input field
            newsletterForm.querySelector('input[type="email"]').value = '';
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Remove the iframe after submission (optional, can be delayed)
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        });
    }
});