const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show Modal, Focus on Input
function showModal() {
    modal.classList.add('show-modal'); // Opens modal
    websiteNameEl.focus(); // Puts cursor in website name input
}

// Modal Event Listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

// Delete Bookmark
function deleteBookmark(id) {
    if (bookmarks[id]) {
        delete bookmarks[id];
    }
    // Update bookmarks array in localStorage, repopulate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
    e.preventDefault(); // Prevents network request
    
    let formData = {};
    formData.name = websiteNameEl.value;
    formData.url = websiteUrlEl.value;
    
    if (!formData.url.includes('https://') && !formData.url.includes('http://')) {
        formData.url = `https://${formData.url}`; 
    }
    if(!validate(formData)) { // validate form inputs
        return false; // function execution stops if form is invalid
    }

    bookmarks[formData.url] = formData;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Validate Form
function validate(formData) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g; // Regular expression matching a valid url

    if (!formData.name || !formData.url) {
        alert('Please submit values for both fields');
        return false;
    }
    const regex = new RegExp(expression);
    if (!formData.url.match(regex)) {
        alert('Please provide a valid web address')
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks() {

    // Remove all bookmark elements
    bookmarksContainer.textContent = '';

    // Build Items
    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id]; // object destructuring

        // Item
        const item  = document.createElement('div');
        item.classList.add('item');

        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-xmark');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon / Link Container
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/u/0/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        // Const Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    })
}

// Fetch Bookmarks
function fetchBookmarks() {
    // Get bookmakrs from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        // Create bookmakrs array in localStorage
        bookmarks = {
            'https://gracefulglowco.com':
                {
                    name: 'Graceful Glow Co',
                    url: 'https://gracefulglowco.com'
                },
        }
    
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks
fetchBookmarks();