// Configuration
// Use API_BASE_URL from config.js if available, otherwise default to relative path
const API_BASE_URL = window.API_BASE_URL || '/api';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchResult = document.getElementById('searchResult');
const usersList = document.getElementById('usersList');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    loadAllUsers();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', searchUserById);
    clearBtn.addEventListener('click', clearSearch);
    refreshBtn.addEventListener('click', loadAllUsers);

    // Allow Enter key to trigger search
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchUserById();
        }
    });
}

// API Functions
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load all users
async function loadAllUsers() {
    try {
        showLoading(true);
        hideError();

        const response = await fetchFromAPI('/users');
        displayUsers(response.data);
        showLoading(false);

    } catch (error) {
        showLoading(false);
        showError('Failed to load users. Please check if the backend server is running.');
    }
}

// Search user by ID
async function searchUserById() {
    const userId = searchInput.value.trim();

    if (!userId) {
        showSearchResult('Please enter a User ID', 'error');
        return;
    }

    if (isNaN(userId) || userId < 1) {
        showSearchResult('Please enter a valid User ID (positive number)', 'error');
        return;
    }

    try {
        searchResult.innerHTML = '<div class="loading">Searching...</div>';

        const response = await fetchFromAPI(`/users/${userId}`);
        displaySearchResult(response.data);

    } catch (error) {
        if (error.message.includes('not found')) {
            showSearchResult(`User with ID ${userId} not found`, 'error');
        } else {
            showSearchResult('Search failed. Please check if the backend server is running.', 'error');
        }
    }
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    searchResult.innerHTML = '';
    searchInput.focus();
}

// Display Functions
function displayUsers(users) {
    if (!users || users.length === 0) {
        usersList.innerHTML = '<p class="no-data">No users found</p>';
        return;
    }

    const usersHTML = users.map(user => `
        <div class="user-card">
            <div class="user-id">ID: ${user.id}</div>
            <div class="user-info">
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Age:</strong> ${user.age}</p>
            </div>
        </div>
    `).join('');

    usersList.innerHTML = usersHTML;
}

function displaySearchResult(user) {
    const userHTML = `
        <div class="user-card highlighted">
            <div class="user-id">ID: ${user.id}</div>
            <div class="user-info">
                <h3>${user.name}</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Age:</strong> ${user.age}</p>
            </div>
        </div>
    `;

    searchResult.innerHTML = userHTML;
}

function showSearchResult(message, type = 'info') {
    const className = type === 'error' ? 'error-message' : 'info-message';
    searchResult.innerHTML = `<div class="${className}">${message}</div>`;
}

// Utility Functions
function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    usersList.style.display = show ? 'none' : 'block';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    usersList.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}