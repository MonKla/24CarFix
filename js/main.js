import { renderDashboard, renderGarage, renderMissions, renderMap, renderCommunity, renderShop, renderHistory, renderAIChat } from './modules/render.js';
import { handleSelectCar, sendAIMessage, claimMission, initLeafletMap, getCurrentUser } from './modules/logic.js';

// 1. Expose Global Functions (สำหรับเรียกจาก onclick="" ใน HTML)
window.handleSelectCar = handleSelectCar;
window.sendAIMessage = sendAIMessage;
window.claimMission = claimMission;
window.initLeafletMap = initLeafletMap;


// 2. Routing Table (ตารางเส้นทาง)
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

// 3. ฟังก์ชันสำหรับกดลิงก์ภายใน (เช่น จากปุ่ม "ดูทั้งหมด" บน Dashboard)
window.handleNavClick = (navId) => {
    const navBtn = document.getElementById(navId);
    if (navBtn) {
        navBtn.click(); // ถ้าเป็นปุ่ม Sidebar ให้สั่งปุ่มนั้นกดตัวเอง
    } else {
        // ถ้าเป็นหน้าพิเศษที่ไม่มีปุ่ม Sidebar (เช่น History, AI Chat)
        const appView = document.getElementById('app-view');
        if (routes[navId]) {
            appView.innerHTML = routes[navId]();
            // ถ้าเป็นหน้าแผนที่ ก็สั่ง Map โหลด
            if (navId === 'nav-map') setTimeout(() => { if (window.initLeafletMap) window.initLeafletMap(); }, 100);
        }
    }
}


// 4. ฟังก์ชันหลักในการติดตั้ง Event Listener ให้ Sidebar (ตัวติดกาว)
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const appView = document.getElementById('app-view');

    navItems.forEach(item => {
        // ติดตั้ง Listener เมื่อมีการคลิก
        item.addEventListener('click', (e) => {
            const navId = e.currentTarget.id;
            
            // 4a. อัปเดต Active Class
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 4b. Render หน้าจอตาม Route
            if (routes[navId]) {
                appView.innerHTML = routes[navId]();
                
                // 4c. สั่งโหลด Map (เฉพาะหน้าแผนที่)
                if (navId === 'nav-map') setTimeout(() => { if (window.initLeafletMap) window.initLeafletMap(); }, 100);
            }
        });
    });
}


// 5. ตัวเริ่มต้นระบบ (Initializer)
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();

    // แสดงข้อมูลผู้ใช้ใน Header
    document.getElementById('user-points').textContent = currentUser.points.toLocaleString();
    document.querySelector('.user-name').textContent = currentUser.name;
    
    // 🔥 ติดตั้ง Listener ให้ปุ่ม Sidebar
    setupNavigation(); 
    
    // แสดงหน้าแรกเมื่อโหลดเสร็จ
    document.getElementById('app-view').innerHTML = renderDashboard();
});