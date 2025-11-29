import { renderDashboard, renderGarage, renderMissions, renderMap, renderCommunity, renderShop, renderHistory, renderAIChat, renderProfile } from './modules/render.js';
import { handleSelectCar, sendAIMessage, claimMission, initLeafletMap, getCurrentUser, handleLogout } from './modules/logic.js';
import { togglePostModal, handleCreatePost, previewImage, clearImage, handleDeletePost, closeDeleteModal, confirmDeletePost } from './modules/logic.js';
import { toggleTheme, initTheme } from './modules/logic.js';
import { handleSaveProfile, previewProfileImage } from './modules/logic.js'; // 🔥 เพิ่มบรรทัดนี้

// Bind to window
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
window.handleSaveProfile = handleSaveProfile;     // 🔥 เพิ่ม
window.previewProfileImage = previewProfileImage; // 🔥 เพิ่ม

const routes = {
    'nav-home': renderDashboard,
    'nav-garage': renderGarage,
    'nav-missions': renderMissions,
    'nav-map': renderMap,
    'nav-community': renderCommunity,
    'nav-shop': renderShop,
    'nav-history': renderHistory,
    'nav-ai-chat': renderAIChat,
    'nav-profile': renderProfile // 🔥 เพิ่ม Route นี้
};

// Navigation Logic
window.handleNavClick = (navId) => {
    const navBtn = document.getElementById(navId);
    if (navBtn) {
        navBtn.click();
    } else {
        // กรณีคลิกจากที่อื่นที่ไม่ใช่เมนู (เช่น คลิกรูปโปรไฟล์)
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
            
            // ลบคลาส active จากทุกปุ่ม
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // ถ้าปุ่มที่กดมี class nav-item (บางทีคลิกโดนไอคอนข้างใน) ให้ใส่ active
            if (item.classList.contains('nav-item')) {
                item.classList.add('active');
            }

            if (routes[navId]) {
                appView.innerHTML = routes[navId]();
                if (navId === 'nav-map') setTimeout(() => { if (window.initLeafletMap) window.initLeafletMap(); }, 100);
            }
        });
    });
}

// Init App
document.addEventListener('DOMContentLoaded', () => {
    initTheme(); // โหลดธีมก่อนเพื่อน
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = getCurrentUser();
    const savedUser = localStorage.getItem('currentUser');

    document.getElementById('user-points').textContent = currentUser.points.toLocaleString();
    
    // อัปเดตชื่อและรูปจากข้อมูลจริง (ไม่ใช่แค่จาก localStorage ธรรมดา)
    document.querySelector('.user-name').textContent = currentUser.name;
    document.querySelector('.profile-pic img').src = currentUser.profilePicUrl;

    setupNavigation(); 
    document.getElementById('app-view').innerHTML = renderDashboard();
});