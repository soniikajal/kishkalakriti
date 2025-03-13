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
    
    // Handle all forms - both Google Forms and Formspree
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        if (form.action) {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevent default form submission
                
                // Check if the form is a Formspree form
                if (form.action.includes('formspree.io')) {
                    // Handle Formspree submission
                    const formData = new FormData(form);
                    
                    fetch(form.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            // Clear the form
                            form.reset();
                            // Show success message
                            alert('Thank you for your submission!');
                        } else {
                            throw new Error('Form submission failed');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('There was a problem submitting your form. Please try again.');
                    });
                } 
                // Check if the form is a Google Form
                else if (form.action.includes('docs.google.com/forms') || form.id === 'newsletter-form') {
                    // Handle Google Forms - need to identify the email input and entry ID
                    const emailInput = form.querySelector('input[type="email"]');
                    
                    if (emailInput) {
                        const email = emailInput.value;
                        
                        // Extract form ID from the action URL or use default
                        let formId = '1FAIpQLSd3j9bJBYiY0qSpcBaje5ldT2xm76WDi9WsoZTJlyva2qDcUw';
                        const actionMatch = form.action.match(/\/e\/([^\/]+)/);
                        if (actionMatch && actionMatch[1]) {
                            formId = actionMatch[1];
                        }
                        
                        // Use entry ID from the input name or default
                        let entryId = 'entry.2108832233';
                        if (emailInput.name && emailInput.name.startsWith('entry.')) {
                            entryId = emailInput.name;
                        }
                        
                        const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
                        
                        // Use a hidden iframe to submit the form (to avoid CORS issues)
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        document.body.appendChild(iframe);
                        
                        // Create a form within the iframe and submit it
                        iframe.contentDocument.write(`
                            <form id="hidden-form" action="${formUrl}" method="POST">
                                <input name="${entryId}" value="${email}">
                            </form>
                            <script>document.getElementById('hidden-form').submit();</script>
                        `);
                        
                        // Clear the input field
                        emailInput.value = '';
                        
                        // Show success message
                        alert('Thank you for subscribing to our newsletter!');
                        
                        // Remove the iframe after submission
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                        }, 1000);
                    } else {
                        // Try standard form submission if no email input found
                        form.submit();
                    }
                } else {
                    // For any other form type, just submit normally
                    form.submit();
                }
            });
        }
    });
});