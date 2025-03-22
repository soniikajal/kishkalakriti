document.addEventListener('DOMContentLoaded', function() {
    // Product data - replace with your actual products
    const products = {
        'home-decor': [
            { name: 'Radha Krishna Glass Painting', image: '/assets/images/products/home-decor/product1.png' },
            { name: 'Shiva Charcoal Sketch', image: '/assets/images/products/home-decor/product2.png' },
            { name: 'Zenitsu Glass Painting', image: '/assets/images/products/home-decor/product3.png' },
            { name: 'Krishna Glass Painting', image: '/assets/images/products/home-decor/product4.jpg' },
            { name: 'Shiv Parvati Glass Painting', image: '/assets/images/products/home-decor/product5.jpg' },
            { name: 'Custom Glass Painting', image: '/assets/images/products/gifts/product4.png' },
            { name: 'Lord Ram Sketch', image: '/assets/images/products/home-decor/product6.heic' }
        ],
        'customized-chocolates': [
            { name: 'Chocolate Bouquet', image: '/assets/images/products/chocolates/product1.png' },
            { name: 'Anniversary Chocolates', image: '/assets/images/products/chocolates/product2.jpg' },
            { name: 'Custom Message Chocolates', image: '/assets/images/products/chocolates/product3.jpg' },
            { name: 'Photo Printed Chocolates', image: '/assets/images/products/chocolates/product4.jpg' },
            { name: 'Valentine Special', image: '/assets/images/products/chocolates/product5.jpg' },
            { name: '18Delights', image: '/assets/images/products/chocolates/product6.heic' }

        ],
        'jewelry': [
            { name: 'Custom Necklace', image: '/assets/images/products/jewelry/product1.jpg' },
            { name: 'Moon pendant', image: '/assets/images/products/jewelry/product2.jpg' },
            { name: 'Resin Earrings', image: '/assets/images/products/jewelry/product3.jpg' },
            { name: 'Resin Earrings', image: '/assets/images/products/jewelry/product4.jpg' },
            { name: 'Shell Earrings', image: '/assets/images/products/jewelry/product5.jpg' },
            { name: 'Rose Pendant', image: '/assets/images/products/jewelry/product6.jpg' },
            { name: 'Rose Earrings', image: '/assets/images/products/jewelry/product7.jpg' },
            { name: 'Custom Necklace', image: '/assets/images/products/jewelry/product8.jpg' }
        ],
        'keychains': [
            { name: 'Resin Keychain', image: '/assets/images/products/keychains/product1.jpg' },
            { name: 'Resin Keychain', image: '/assets/images/products/keychains/product2.jpg' }
        ],
        'handmade-gifts': [
            { name: 'Frame', image: '/assets/images/products/gifts/product1.jpg' },
            { name: 'Vintage Letter', image: '/assets/images/products/gifts/product2.jpg' },
            { name: 'Mini Scrapbook', image: '/assets/images/products/gifts/product3.jpg' },
            { name: 'Custom Glass Painting', image: '/assets/images/products/gifts/product4.png' },
            { name: 'Vintage scroll', image: '/assets/images/products/gifts/product5.heic' }

        ],
        'mobile-covers': [
            { name: 'Custom Design Cover', image: '/assets/images/products/mobile-covers/product1.jpg' },
            { name: 'Custom Design Cover', image: '/assets/images/products/mobile-covers/product2.jpg' }
        ]
    };

    const productContainer = document.getElementById('product-container');
    const categoryLinks = document.querySelectorAll('.category-link');
    const productsPerPage = 4;
    let currentCategory = 'home-decor';
    let currentPage = {};

    // Initialize current page for each category
    Object.keys(products).forEach(category => {
        currentPage[category] = 0;
    });
    
    // Check for hash in URL and set current category accordingly
    const hash = window.location.hash.substring(1); // Remove the # character
    if (hash && products[hash]) {
        currentCategory = hash;
        
        // Update active class on category links
        categoryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === currentCategory) {
                link.classList.add('active');
            }
        });
    }

    // Function to create product HTML with WhatsApp integration
    function createProductHTML(product) {
        const encodedMessage = encodeURIComponent(`Hi, I'm interested in purchasing ${product.name}. Product image: ${window.location.origin}/${product.image}`);
        const whatsappLink = `https://wa.me/+917827044075?text=${encodedMessage}`;
        
        return `
            <div class="product-box">
                <div class="product-img" style="background-image: url('${product.image}')"></div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <a href="${whatsappLink}" target="_blank">Shop Now</a>
                </div>
            </div>
        `;
    }
    

    // Function to render products for desktop view
    function renderDesktopProducts() {
        let html = '';
        
        Object.keys(products).forEach(category => {
            const categoryProducts = products[category];
            const startIndex = currentPage[category] * productsPerPage;
            const displayProducts = categoryProducts.slice(startIndex, startIndex + productsPerPage);
            const hasNextPage = startIndex + productsPerPage < categoryProducts.length;
            const hasPrevPage = currentPage[category] > 0;
            
            html += `
                <section id="${category}" class="shop-section desktop-view">
                    <h1>${formatCategoryName(category)}</h1>
                    <div class="products">
                        ${displayProducts.map(product => createProductHTML(product)).join('')}
                    </div>
                    <div class="pagination">
                        <button class="pagination-arrow prev" data-category="${category}" ${!hasPrevPage ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="pagination-arrow next" data-category="${category}" ${!hasNextPage ? 'disabled' : ''}>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </section>
            `;
        });
        
        return html;
    }

    // Function to render products for mobile view
    function renderMobileProducts() {
        let html = `<div class="mobile-view">`;
        
        // Only render the current category
        const categoryProducts = products[currentCategory];
        html += `
            <section id="${currentCategory}" class="shop-section mobile-view">
                <h2 class="mobile-category-title">${formatCategoryName(currentCategory)}</h2>
                <div class="products">
                    ${categoryProducts.map(product => createProductHTML(product)).join('')}
                </div>
            </section>
        `;
        
        html += `</div>`;
        return html;
    }

    // Format category name for display
    function formatCategoryName(category) {
        return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Render all products
    function renderProducts() {
        productContainer.innerHTML = renderDesktopProducts() + renderMobileProducts();
        
        // Add event listeners to pagination arrows
        document.querySelectorAll('.pagination-arrow').forEach(arrow => {
            arrow.addEventListener('click', handlePagination);
        });
    }

    // Handle pagination clicks
    function handlePagination(e) {
        const category = e.currentTarget.dataset.category;
        const direction = e.currentTarget.classList.contains('next') ? 1 : -1;
        
        currentPage[category] += direction;
        
        // Ensure page is within bounds
        if (currentPage[category] < 0) currentPage[category] = 0;
        const maxPage = Math.ceil(products[category].length / productsPerPage) - 1;
        if (currentPage[category] > maxPage) currentPage[category] = maxPage;
        
        renderProducts();
    }

    function updateActiveCategoryOnScroll() {
        // Only on desktop view
        if (window.innerWidth <= 768) return;
        
        // Get all shop sections
        const sections = document.querySelectorAll('.shop-section.desktop-view');
        
        // Find which section is most visible in the viewport
        let currentInView = '';
        let maxVisibility = 0;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the section is visible
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visibility = visibleHeight > 0 ? visibleHeight / section.offsetHeight : 0;
            
            // If this section has more visibility than previous maximum, it becomes the current one
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                currentInView = section.id;
            }
        });
        
        // Update active class if a section is in view
        if (currentInView) {
            categoryLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.category === currentInView) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Initial render
    renderProducts();
    
    // Add scroll event listener
    window.addEventListener('scroll', updateActiveCategoryOnScroll);
    
    // Update on resize too
    window.addEventListener('resize', function() {
        renderProducts();
        updateActiveCategoryOnScroll();
    });
    
    // Check active section on initial load
    updateActiveCategoryOnScroll();

    // Handle category link clicks
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active class
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Update current category for mobile view
            currentCategory = this.dataset.category;
            
            // Update URL hash without scrolling
            if (history.pushState) {
                history.pushState(null, null, `#${currentCategory}`);
            } else {
                location.hash = currentCategory;
            }
            
            // Render products
            renderProducts();
            
            // Scroll to category section on desktop
            if (window.innerWidth > 768) {
                const section = document.getElementById(currentCategory);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Mobile category dropdown functionality
    const dropdownBtn = document.querySelector('.category-dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    // Set initial dropdown button text based on current category
    if (dropdownBtn) {
        dropdownBtn.innerHTML = `${formatCategoryName(currentCategory)} <i class="fas fa-chevron-down"></i>`;
    }
    
    // Clone category links into dropdown
    const categoryLinksContainer = document.querySelector('.category');
    if (categoryLinksContainer) {
        const links = categoryLinksContainer.querySelectorAll('.category-link');
        links.forEach(link => {
            const clonedLink = link.cloneNode(true);
            dropdownContent.appendChild(clonedLink);
            
            // Add event listener to cloned link
            clonedLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update active class on both sets of links
                const category = this.dataset.category;
                document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll(`.category-link[data-category="${category}"]`).forEach(l => l.classList.add('active'));
                
                // Update current category
                currentCategory = category;
                
                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, `#${currentCategory}`);
                } else {
                    location.hash = currentCategory;
                }
                
                // Hide dropdown after selection
                dropdownContent.classList.remove('show');
                
                // Update dropdown button text
                dropdownBtn.innerHTML = `${formatCategoryName(category)} <i class="fas fa-chevron-down"></i>`;
                
                // Render products
                renderProducts();
            });
        });
    }
    
    // Toggle dropdown
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', function() {
            dropdownContent.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.mobile-category-dropdown')) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // Scroll to hash on initial load if on mobile
    if (hash && products[hash] && window.innerWidth <= 768) {
        setTimeout(function() {
            const mobileSection = document.querySelector(`.mobile-view #${hash}`);
            if (mobileSection) {
                mobileSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        renderProducts();
    });
});