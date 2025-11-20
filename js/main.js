// --- js/main.js --- (ฉบับสมบูรณ์: แก้ปุ่มกดไม่ติด + รวม Data จริง)

import { MOCK_USER, MOCK_CARS, MOCK_MASTER_MISSIONS } from '../data/mockmain.js'; 
import { CAR_INSIGHTS, REPAIR_ESTIMATES, AI_KNOWLEDGE } from '../data/mockrealdata.js';

let currentUser = MOCK_USER;
let currentCar = MOCK_CARS.find(car => car.ownerId === currentUser.id) || MOCK_CARS[0];

// =========================================
// 🏗️ PART 1: View Generators (หน้าจอต่างๆ)
// =========================================

// 1. 🏠 Dashboard (หน้าหลัก)
function renderDashboard() {
    const { battery, engine, tires } = currentCar.predictiveHealth;
    const totalHealth = Math.round((battery + engine + tires) / 3);
    
    // Insight Badge (แจ้งเตือนรุ่นรถ)
    const carKey = `${currentCar.brand}-${currentCar.model}`.toLowerCase().split(' ')[0]; 
    const insight = CAR_INSIGHTS["nison-kicks"] || CAR_INSIGHTS["toyota-vios"]; 
    
    const insightHtml = insight ? `
        <div class="insight-badge" style="background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #FFC107;">
            <i class="fa-solid fa-lightbulb" style="color: #FFC107;"></i> 
            <span style="font-size: 0.9rem; color: #fff;">${insight.warningMessage}</span>
        </div>
    ` : '';

    return `
    <div class="view-dashboard fade-in">
        <section class="hero-section">
            <div class="car-preview-card">
                <div class="car-status">
                    <span class="status-badge ${totalHealth < 70 ? 'warning' : 'success'}">
                        ${totalHealth < 70 ? 'ต้องการการดูแล' : 'สุขภาพดีเยี่ยม'}
                    </span>
                    <h3>${currentCar.nickname} (${currentCar.model})</h3>
                    ${insightHtml}
                    <div class="health-bar-container">
                        <span>สุขภาพรถ: ${totalHealth}%</span>
                        <div class="progress-bar"><div class="progress-fill" style="width: ${totalHealth}%;"></div></div>
                    </div>
                </div>
                <div class="car-image">🚗</div>
            </div>
            
            <div class="ai-card">
                <div class="ai-avatar">🤖</div>
                <div class="ai-text"><h4>มีปัญหาปรึกษาพี่!</h4><p>วิเคราะห์อาการรถด้วย AI</p></div>
                <button class="btn-ai-action" onclick="handleNavClick('nav-ai-chat')">คุยกับ AI</button>
            </div>
        </section>

        <div class="grid-layout">
            <section class="mission-card">
                <div class="card-header">
                    <h4>🎯 ภารกิจวันนี้</h4>
                    <a href="#" onclick="handleNavClick('nav-missions')">ดูทั้งหมด</a>
                </div>
                <div class="mission-item">
                    <div class="mission-icon">📷</div>
                    <div class="mission-info">
                        <h5>ถ่ายรูปเลขไมล์</h5>
                        <p>เหลือเวลาอีก 2 ชม.</p>
                    </div>
                    <button class="btn-claim">รับ 50 P</button>
                </div>
            </section>
        </div>
    </div>
    `;
}

// 2. 🚗 Garage (โรงรถ)
function renderGarage() {
    const carList = MOCK_CARS.map(car => `
        <div class="garage-car-card ${car.id === currentCar.id ? 'active-car' : ''}" onclick="handleSelectCar('${car.id}')">
            <div class="car-info">
                <h4>${car.nickname}</h4>
                <p>${car.brand} ${car.model}</p>
            </div>
            <button class="btn-history" onclick="event.stopPropagation(); handleNavClick('nav-history')">
                <i class="fa-solid fa-clock-rotate-left"></i> ดูประวัติซ่อม
            </button>
        </div>
    `).join('');

    return `
    <div class="view-garage fade-in">
        <h2>🚗 โรงรถของฉัน</h2>
        <div class="car-list-grid">${carList}</div>
    </div>`;
}

// 3. 🛠️ Repair History (ประวัติซ่อม)
function renderHistory() {
    const history = currentCar.repairHistory || [];
    const historyList = history.map(h => {
        const estimate = REPAIR_ESTIMATES[h.service] || { avg: h.cost, unit: "บาท" };
        return `
        <div class="history-card" style="background: white; padding: 20px; margin-bottom: 15px; border-radius: 12px; border-left: 5px solid #2ECC71;">
            <div style="display: flex; justify-content: space-between;">
                <h4 style="margin: 0;">${h.service}</h4>
                <span style="color: #888;">${h.date}</span>
            </div>
            <p style="margin: 10px 0; color: #555;">ค่าใช้จ่ายจริง: <strong style="color: #2ECC71;">${h.cost.toLocaleString()} บาท</strong></p>
            <div style="background: #F9FAFB; padding: 10px; border-radius: 8px; font-size: 0.9rem;">
                <i class="fa-solid fa-tag"></i> ราคากลาง: 
                <span style="font-weight: bold;">${estimate.avg.toLocaleString()} ${estimate.unit}</span>
            </div>
        </div>`;
    }).join('');

    return `
    <div class="view-history fade-in">
        <div class="header-back" style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <button onclick="handleNavClick('nav-garage')" style="background:none; border:none; font-size: 1.2rem; cursor: pointer;">⬅️</button>
            <h2>🛠️ ประวัติการซ่อมบำรุง</h2>
        </div>
        <div class="history-container">
            ${historyList.length > 0 ? historyList : '<p>ยังไม่มีประวัติการซ่อมจ้า รถสุขภาพดีเว่อร์!</p>'}
        </div>
    </div>`;
}

// 4. 🤖 AI Chat (แชทบอท)
function renderAIChat() {
    return `
    <div class="view-ai-chat fade-in" style="height: 80vh; display: flex; flex-direction: column;">
        <h2 style="margin-bottom: 10px;">🤖 ช่าง AI อัจฉริยะ</h2>
        <div id="chat-box" style="flex: 1; background: white; border-radius: 16px; padding: 20px; overflow-y: auto; margin-bottom: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.05);">
            <div class="chat-msg ai" style="margin-bottom: 10px;">
                <span style="background: #E5E7EB; padding: 8px 12px; border-radius: 15px 15px 15px 0; display: inline-block;">
                    สวัสดีครับ! ผมคือ AI ผู้ช่วยช่าง 🔧 รถมีอาการอะไรบอกผมได้เลย
                </span>
            </div>
        </div>
        <div class="chat-input-area" style="display: flex; gap: 10px;">
            <input type="text" id="ai-input" placeholder="พิมพ์อาการรถ..." style="flex: 1; padding: 12px; border-radius: 50px; border: 1px solid #ddd; outline: none;">
            <button onclick="sendAIMessage()" style="background: var(--primary); border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer;">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    </div>`;
}

// 5. 🎮 Missions (ภารกิจ) - *กู้คืนแล้ว!*
function renderMissions() {
    const missionList = MOCK_MASTER_MISSIONS.map(m => `
        <div class="mission-item" style="margin-bottom: 10px; background: white; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="mission-icon" style="font-size: 1.5rem;">⚡️</div>
                <div class="mission-info">
                    <h5 style="margin: 0;">${m.title}</h5>
                    <p style="margin: 0; font-size: 0.8rem; color: #666;">รางวัล: ${m.rewardPoints} P</p>
                </div>
            </div>
            <button class="btn-claim" style="background: var(--primary); border: none; padding: 5px 15px; border-radius: 20px; cursor: pointer;">ทำภารกิจ</button>
        </div>
    `).join('');

    return `
    <div class="view-missions fade-in">
        <h2>🎮 ภารกิจ & รางวัล</h2>
        <div class="grid-layout" style="margin-top: 20px;">
            ${missionList}
        </div>
    </div>`;
}

// 6. หน้าอื่นๆ (Placeholder) - *กู้คืนแล้ว!*
function renderMap() { return `<div class="fade-in"><h2>🗺️ แผนที่ & จุดเสี่ยง</h2><p>กำลังโหลด Map API... (Demo)</p></div>`; }
function renderCommunity() { return `<div class="fade-in"><h2>💬 ชุมชนคนรักรถ</h2><p>กระทู้ล่าสุด... (Demo)</p></div>`; }
function renderShop() { return `<div class="fade-in"><h2>🛍️ ร้านค้า</h2><p>แลกของรางวัล... (Demo)</p></div>`; }


// =========================================
// 🕹️ PART 2: Controller (ระบบนำทาง)
// =========================================

const routes = {
    'nav-home': renderDashboard,
    'nav-garage': renderGarage,
    'nav-missions': renderMissions,  // ✅ กู้คืนแล้ว
    'nav-map': renderMap,            // ✅ กู้คืนแล้ว
    'nav-community': renderCommunity,// ✅ กู้คืนแล้ว
    'nav-shop': renderShop,          // ✅ กู้คืนแล้ว
    'nav-history': renderHistory,    // หน้าพิเศษ (ไม่มีในเมนูหลัก)
    'nav-ai-chat': renderAIChat      // หน้าพิเศษ (ไม่มีในเมนูหลัก)
};

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const appView = document.getElementById('app-view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // หา ID ของปุ่มที่กด (เช็กให้ชัวร์ว่าได้ ID จริงๆ)
            const navId = e.currentTarget.id;
            
            // 1. เปลี่ยนสีปุ่ม Active
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // 2. เปลี่ยนหน้าจอ
            if (routes[navId]) {
                appView.innerHTML = routes[navId](); 
            } else {
                console.error("หาหน้าไม่เจอจ้า: " + navId);
            }
        });
    });
}

// --- Helper Functions ---

window.sendAIMessage = () => {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="chat-msg user" style="text-align: right; margin-bottom: 10px;"><span style="background: #FFC107; padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block;">${text}</span></div>`;
    input.value = '';

    setTimeout(() => {
        const foundKnowledge = AI_KNOWLEDGE.find(k => k.keywords.some(word => text.includes(word)));
        let reply = "ขอโทษนะครับ ผมยังไม่แน่ใจอาการนี้ ลองอธิบายเพิ่มเติมครับ";
        
        if (foundKnowledge) {
            reply = `<strong>${foundKnowledge.suggestion}</strong><br><small>ความน่าจะเป็น:</small><br>${foundKnowledge.likelyCauses.map(c => `- ${c.cause} (${c.probability})`).join('<br>')}`;
        }
        chatBox.innerHTML += `<div class="chat-msg ai" style="margin-bottom: 10px;"><span style="background: #E5E7EB; padding: 8px 12px; border-radius: 15px 15px 15px 0; display: inline-block;">${reply}</span></div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

window.handleNavClick = (navId) => {
    const navBtn = document.getElementById(navId);
    if (navBtn) {
        navBtn.click();
    } else {
        const appView = document.getElementById('app-view');
        if (routes[navId]) appView.innerHTML = routes[navId]();
    }
}

// เริ่มต้นทำงาน
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    document.getElementById('app-view').innerHTML = renderDashboard();
});