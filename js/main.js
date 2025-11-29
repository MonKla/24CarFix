import { renderDashboard, renderGarage, renderMissions, renderMap, renderCommunity, renderShop, renderHistory, renderAIChat } from './modules/render.js';
import { handleSelectCar, sendAIMessage, claimMission, initLeafletMap, getCurrentUser, handleLogout } from './modules/logic.js';
import { togglePostModal, handleCreatePost, previewImage, clearImage, handleDeletePost, closeDeleteModal, confirmDeletePost } from './modules/logic.js';
import { toggleTheme, initTheme } from './modules/logic.js';

//mainfn
window.handleSelectCar = handleSelectCar;
window.sendAIMessage = sendAIMessage;
window.claimMission = claimMission;
window.initLeafletMap = initLeafletMap;
window.handleLogout = handleLogout;
window.togglePostModal = togglePostModal;
window.handleCreatePost = handleCreatePost;
window.previewImage = previewImage;
window.clearImage = clearImage;
window.handleDeletePost = handleDeletePost;
window.closeDeleteModal = closeDeleteModal;
window.confirmDeletePost = confirmDeletePost;
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;

const routes = {
    'nav-home': renderDashboard,
    'nav-garage': renderGarage,
    'nav-missions': renderMissions,
    'nav-map': renderMap,
    'nav-community': renderCommunity,
    'nav-shop': renderShop,
    'nav-history': renderHistory,
    'nav-ai-chat': renderAIChat
};

//Navigation
window.handleNavClick = (navId) => {
    const navBtn = document.getElementById(navId);
    if (navBtn) {
        navBtn.click();
    } else {
        const appView = document.getElementById('app-view');
        if (routes[navId]) {
            appView.innerHTML = routes[navId]();
            if (navId === 'nav-map') setTimeout(() => { if (window.initLeafletMap) window.initLeafletMap(); }, 100);
        }
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const appView = document.getElementById('app-view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const navId = e.currentTarget.id;
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (routes[navId]) {
                appView.innerHTML = routes[navId]();
                if (navId === 'nav-map') setTimeout(() => { if (window.initLeafletMap) window.initLeafletMap(); }, 100);
            }
        });
    });
}

//login
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = getCurrentUser();
    const savedUser = localStorage.getItem('currentUser');

    document.getElementById('user-points').textContent = currentUser.points.toLocaleString();
    
    if (savedUser) {
        document.querySelector('.user-name').textContent = savedUser;
    } else {
        document.querySelector('.user-name').textContent = currentUser.name;
    }

    setupNavigation(); 
    document.getElementById('app-view').innerHTML = renderDashboard();
});