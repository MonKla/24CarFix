import { renderDashboard, renderGarage, renderMissions, renderMap, renderCommunity, renderShop, renderHistory, renderAIChat } from './modules/render.js';
import { setupNavigation, handleNavClick, handleSelectCar, sendAIMessage, claimMission, initLeafletMap, getCurrentUser } from './modules/logic.js';

window.handleNavClick = handleNavClick;
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

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();

    document.getElementById('user-points').textContent = currentUser.points.toLocaleString();
    document.querySelector('.user-name').textContent = currentUser.name;
    
    setupNavigation(routes);
    document.getElementById('app-view').innerHTML = renderDashboard();
});