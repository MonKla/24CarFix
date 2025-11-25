import { renderDashboard, renderGarage, renderMissions, renderMap, renderCommunity, renderShop, renderHistory, renderAIChat } from './modules/render.js';
import { handleSelectCar, sendAIMessage, claimMission, initLeafletMap, getCurrentUser } from './modules/logic.js';

window.handleSelectCar = handleSelectCar;
window.sendAIMessage = sendAIMessage;
window.claimMission = claimMission;
window.initLeafletMap = initLeafletMap;


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


document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    document.getElementById('user-points').textContent = currentUser.points.toLocaleString();
    document.querySelector('.user-name').textContent = currentUser.name;
    setupNavigation(); 
    document.getElementById('app-view').innerHTML = renderDashboard();
});


const isLoggedIn = localStorage.getItem('isLoggedIn');

if (!isLoggedIn) {
    window.location.href = 'login.html';
} else {
    const savedUser = localStorage.getItem('currentUser');
    const userNameElement = document.querySelector('.user-name'); 
    if(userNameElement) {
        userNameElement.innerText = savedUser;
    }
}