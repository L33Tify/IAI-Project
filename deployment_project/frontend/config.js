// Environment configuration for different deployment environments
// This file can be modified during container startup to set the correct API URL

// Use relative path so requests go through nginx proxy
window.API_BASE_URL = window.API_BASE_URL || '/api';

// Environment-specific settings
window.ENV_CONFIG = {
    API_BASE_URL: window.API_BASE_URL,
    DEBUG: false,
    VERSION: '1.0.0'
};