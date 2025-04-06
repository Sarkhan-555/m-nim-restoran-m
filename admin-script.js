const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

// DOM Elements
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const navLinks = document.querySelectorAll('.admin-nav a');
const adminPages = document.querySelectorAll('.admin-page');
const headerTitle = document.querySelector('.admin-header-title h2');

// Menu Management Elements
const menuItemsList = document.getElementById('menu-items-list');
const addMenuItemBtn = document.getElementById('add-menu-item');
const menuForm = document.getElementById('menu-form');
const menuItemForm = document.getElementById('menu-item-form');
const cancelMenuItemBtn = document.getElementById('cancel-menu-item');

// Offers Management Elements
const offerItemsList = document.getElementById('offer-items-list');
const addOfferItemBtn = document.getElementById('add-offer-item');
const offerForm = document.getElementById('offer-form');
const offerItemForm = document.getElementById('offer-item-form');
const cancelOfferItemBtn = document.getElementById('cancel-offer-item');

// Settings Elements
const settingsForm = document.getElementById('settings-form');

// Dashboard Quick Action Buttons
const addMenuBtn = document.getElementById('add-menu-btn');
const addOfferBtn = document.getElementById('add-offer-btn');

// Stats Elements
const menuCountElement = document.getElementById('menu-count');
const offersCountElement = document.getElementById('offers-count');

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// Show login modal if not logged in
function checkAuth() {
    if (!isLoggedIn()) {
        loginModal.style.display = 'flex';
    } else {
        loginModal.style.display = 'none';
    }
}

// Initialize data in localStorage if not exists
function initializeData() {
    if (!localStorage.getItem('menuItems')) {
        localStorage.setItem('menuItems', JSON.stringify([
            {
                id: 1,
                name: 'Plov',
                category: 'əsas',
                price: 12.50,
                description: 'Ənənəvi Azərbaycan plovu'
            },
            {
                id: 2,
                name: 'Dolma',
                category: 'əsas',
                price: 10.00,
                description: 'Üzüm yarpağında dolma'
            }
        ]));
    }
    
    if (!localStorage.getItem('offerItems')) {
        localStorage.setItem('offerItems', JSON.stringify([
            {
                id: 1,
                title: 'Həftəsonu Gün Ərzində -15%',
                description: 'Şənbə və bazar günləri səhər 09:00-dan 12:00-a qədər bütün yeməklərə 15% endirim.',
                active: true
            },
            {
                id: 2,
                title: 'Ailə Paketi',
                description: '4 nəfərlik xüsusi ailə paketi - 2 əsas yemək, 4 salat və 4 içki cəmi 40 AZN-ə.',
                active: true
            }
        ]));
    }
    
    if (!localStorage.getItem('siteSettings')) {
        localStorage.setItem('siteSettings', JSON.stringify({
            title: 'Mənim Restoranım',
            description: 'Ən ləzzətli Azərbaycan mətbəxi',
            phone: '(012) 123-44-67',
            email: 'info@restoranim.az',
            workHoursWeekday: '09:00 - 22:00',
            workHoursWeekend: '10:00 - 23:00'
        }));
    }
}

// Update dashboard stats
function updateStats() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const offerItems = JSON.parse(localStorage.getItem('offerItems') || '[]');
    
    menuCountElement.textContent = menuItems.length;
    offersCountElement.textContent = offerItems.length;
}

// Load menu items
function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    menuItemsList.innerHTML = '';
    
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <div class="item-header">
                <h4>${item.name} - ${item.price.toFixed(2)} AZN</h4>
                <div class="item-actions">
                    <button class="admin-btn edit-btn" data-id="${item.id}">Redaktə et</button>
                    <button class="admin-btn delete-btn" data-id="${item.id}">Sil</button>
                </div>
            </div>
            <p><strong>Kateqoriya:</strong> ${item.category}</p>
            <p>${item.description}</p>
        `;
        
        menuItemsList.appendChild(itemElement);
        
        // Add event listeners to buttons
        const editBtn = itemElement.querySelector('.edit-btn');
        const deleteBtn = itemElement.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editMenuItem(item.id));
        deleteBtn.addEventListener('click', () => deleteMenuItem(item.id));
    });
}

// Load offer items
function loadOfferItems() {
    const offerItems = JSON.parse(localStorage.getItem('offerItems') || '[]');
    offerItemsList.innerHTML = '';
    
    offerItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <div class="item-header">
                <h4>${item.title} ${item.active ? '' : '(Deaktiv)'}</h4>
                <div class="item-actions">
                    <button class="admin-btn edit-btn" data-id="${item.id}">Redaktə et</button>
                    <button class="admin-btn delete-btn" data-id="${item.id}">Sil</button>
                </div>
            </div>
            <p>${item.description}</p>
        `;
        
        offerItemsList.appendChild(itemElement);
        
        // Add event listeners to buttons
        const editBtn = itemElement.querySelector('.edit-btn');
        const deleteBtn = itemElement.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editOfferItem(item.id));
        deleteBtn.addEventListener('click', () => deleteOfferItem(item.id));
    });
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    document.getElementById('site-title').value = settings.title || '';
    document.getElementById('site-description').value = settings.description || '';
    document.getElementById('site-phone').value = settings.phone || '';
    document.getElementById('site-email').value = settings.email || '';
    document.getElementById('work-hours-weekday').value = settings.workHoursWeekday || '';
    document.getElementById('work-hours-weekend').value = settings.workHoursWeekend || '';
}

// Menu Item Functions
function addMenuItem() {
    document.getElementById('menu-item-id').value = '';
    document.getElementById('menu-item-name').value = '';
    document.getElementById('menu-item-category').value = 'əsas';
    document.getElementById('menu-item-price').value = '';
    document.getElementById('menu-item-description').value = '';
    
    menuForm.classList.remove('hidden');
}

function editMenuItem(id) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const item = menuItems.find(item => item.id === id);
    
    if (item) {
        document.getElementById('menu-item-id').value = item.id;
        document.getElementById('menu-item-name').value = item.name;
        document.getElementById('menu-item-category').value = item.category;
        document.getElementById('menu-item-price').value = item.price;
        document.getElementById('menu-item-description').value = item.description;
        
        menuForm.classList.remove('hidden');
    }
}

function deleteMenuItem(id) {
    if (confirm('Bu menyu elementini silmək istədiyinizə əminsiniz?')) {
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const updatedItems = menuItems.filter(item => item.id !== id);
        
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        loadMenuItems();
        updateStats();
    }
}

function saveMenuItem(event) {
    event.preventDefault();
    
    const id = document.getElementById('menu-item-id').value;
    const name = document.getElementById('menu-item-name').value;
    const category = document.getElementById('menu-item-category').value;
    const price = parseFloat(document.getElementById('menu-item-price').value);
    const description = document.getElementById('menu-item-description').value;
    
    const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    
    if (id) {
        // Update existing item
        const index = menuItems.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            menuItems[index] = {
                id: parseInt(id),
                name,
                category,
                price,
                description
            };
        }
    } else {
        // Add new item
        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
        menuItems.push({
            id: newId,
            name,
            category,
            price,
            description
        });
    }
    
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    menuForm.classList.add('hidden');
    loadMenuItems();
    updateStats();
}

// Offer Item Functions
function addOfferItem() {
    document.getElementById('offer-item-id').value = '';
    document.getElementById('offer-item-title').value = '';
    document.getElementById('offer-item-description').value = '';
    document.getElementById('offer-item-active').checked = true;
    
    offerForm.classList.remove('hidden');
}

function editOfferItem(id) {
    const offerItems = JSON.parse(localStorage.getItem('offerItems') || '[]');
    const item = offerItems.find(item => item.id === id);
    
    if (item) {
        document.getElementById('offer-item-id').value = item.id;
        document.getElementById('offer-item-title').value = item.title;
        document.getElementById('offer-item-description').value = item.description;
        document.getElementById('offer-item-active').checked = item.active;
        
        offerForm.classList.remove('hidden');
    }
}

function deleteOfferItem(id) {
    if (confirm('Bu təklifi silmək istədiyinizə əminsiniz?')) {
        const offerItems = JSON.parse(localStorage.getItem('offerItems') || '[]');
        const updatedItems = offerItems.filter(item => item.id !== id);
        
        localStorage.setItem('offerItems', JSON.stringify(updatedItems));
        loadOfferItems();
        updateStats();
    }
}

function saveOfferItem(event) {
    event.preventDefault();
    
    const id = document.getElementById('offer-item-id').value;
    const title = document.getElementById('offer-item-title').value;
    const description = document.getElementById('offer-item-description').value;
    const active = document.getElementById('offer-item-active').checked;
    
    const offerItems = JSON.parse(localStorage.getItem('offerItems') || '[]');
    
    if (id) {
        // Update existing item
        const index = offerItems.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            offerItems[index] = {
                id: parseInt(id),
                title,
                description,
                active
            };
        }
    } else {
        // Add new item
        const newId = offerItems.length > 0 ? Math.max(...offerItems.map(item => item.id)) + 1 : 1;
        offerItems.push({
            id: newId,
            title,
            description,
            active
        });
    }
    
    localStorage.setItem('offerItems', JSON.stringify(offerItems));
    offerForm.classList.add('hidden');
    loadOfferItems();
    updateStats();
}

// Save Settings
function saveSettings(event) {
    event.preventDefault();
    
    const settings = {
        title: document.getElementById('site-title').value,
        description: document.getElementById('site-description').value,
        phone: document.getElementById('site-phone').value,
        email: document.getElementById('site-email').value,
        workHoursWeekday: document.getElementById('work-hours-weekday').value,
        workHoursWeekend: document.getElementById('work-hours-weekend').value
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    alert('Parametrlər uğurla yadda saxlanıldı!');
}

// Navigation
function navigateTo(pageId) {
    adminPages.forEach(page => {
        page.classList.remove('active');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Update header title
    const linkText = document.querySelector(`[data-page="${pageId}"]`).textContent;
    headerTitle.textContent = linkText;
    
    // Load data based on page
    if (pageId === 'menu') {
        loadMenuItems();
    } else if (pageId === 'offers') {
        loadOfferItems();
    } else if (pageId === 'settings') {
        loadSettings();
    } else if (pageId === 'dashboard') {
        updateStats();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    initializeData();
    
    // Check authentication
    checkAuth();
    
    // Login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            loginModal.style.display = 'none';
        } else {
            alert('Yanlış istifadəçi adı və ya şifrə!');
        }
    });
    
    // Logout button
    logoutBtn.addEventListener('click', () => {
        localStorage.setItem('adminLoggedIn', 'false');
        checkAuth();
    });
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            
            const pageId = link.getAttribute('data-page');
            if (pageId) {
                navigateTo(pageId);
            }
        });
    });
    
    // Menu item form events
    addMenuItemBtn.addEventListener('click', addMenuItem);
    cancelMenuItemBtn.addEventListener('click', () => {
        menuForm.classList.add('hidden');
    });
    menuItemForm.addEventListener('submit', saveMenuItem);
    
    // Offer item form events
    addOfferItemBtn.addEventListener('click', addOfferItem);
    cancelOfferItemBtn.addEventListener('click', () => {
        offerForm.classList.add('hidden');
    });
    offerItemForm.addEventListener('submit', saveOfferItem);
    
    // Settings form events
    settingsForm.addEventListener('submit', saveSettings);
    
    // Dashboard quick action buttons
    addMenuBtn.addEventListener('click', () => {
        navigateTo('menu');
        addMenuItem();
    });
    
    addOfferBtn.addEventListener('click', () => {
        navigateTo('offers');
        addOfferItem();
    });
    
    // Initialize with dashboard page
    navigateTo('dashboard');
});