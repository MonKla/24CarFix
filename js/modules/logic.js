import { MOCK_USER, MOCK_CARS, MOCK_MASTER_MISSIONS, MOCK_USER_MISSIONS } from '../../data/mockmain.js'; 
import { AI_KNOWLEDGE } from '../../data/mockrealdata.js';
import { renderMissions, renderGarage } from './render.js';

let currentUser = MOCK_USER;
let currentCar = MOCK_CARS.find(car => car.ownerId === currentUser.id) || MOCK_CARS[0];

export const getCurrentUser = () => currentUser;
export const getCurrentCar = () => currentCar;

export function updateHeaderPoints() {
    document.getElementById('user-points').textContent = currentUser.points.toLocaleString(); 
}

export function claimMission(missionId) {
    const userMission = MOCK_USER_MISSIONS.find(um => um.missionId === missionId && um.status === 'active');
    const masterMission = MOCK_MASTER_MISSIONS.find(mm => mm.id === missionId);

    if (userMission && masterMission) {
        currentUser.points += masterMission.rewardPoints;
        userMission.status = 'completed';

        updateHeaderPoints(); 
        
        document.getElementById('app-view').innerHTML = renderMissions();

        alert(`สำเร็จ! รับไปเลย ${masterMission.rewardPoints} P!`);
    } else {
        alert("ภารกิจนี้ยังไม่ Active หรือถูกเคลมไปแล้วค่ะ");
    }
}

export function initLeafletMap() {
    const mapElement = document.getElementById('real-leaflet-map');
    if (!mapElement) return;

    if (window.myMapInstance) window.myMapInstance.remove();

    const map = L.map('real-leaflet-map').setView([13.7563, 100.5018], 12);
    window.myMapInstance = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mockMapPins.riskPins.forEach(pin => {
        const marker = L.marker([pin.lat, pin.long]).addTo(map);
        marker.bindPopup(`<div style="text-align: center;"><b style="color: #DC2626;">⚠️ ${pin.type}</b><br>${pin.message}</div>`);
    });

    mockMapPins.technicianPins.forEach(pin => {
        const marker = L.marker([pin.lat, pin.long]).addTo(map);
        marker.bindPopup(`<div style="text-align: center;"><b style="color: #2563EB;">🔧 ${pin.name}</b><br>Rating: ⭐ ${pin.rating}</div>`);
    });
}


const API_KEY = "AIzaSyD9ISa2Y_gzng75ZpKP-jOo777ZhfMZXRA"; 

async function askGemini(userMessage) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
    const systemInstruction = `
        บทบาท: คุณคือ "พี่ช่าง 24CarFix" ผู้เชี่ยวชาญด้านรถยนต์ นิสัยดี เป็นกันเอง
        หน้าที่: วิเคราะห์อาการรถเสียจากข้อความที่ลูกค้าบอก
        ข้อจำกัด: 
        - ตอบสั้นๆ เข้าใจง่าย (ประมาณ 3-5 บรรทัด) ไม่ใช้ศัพท์เทคนิคเยอะเกินไป
        - เน้นแนะนำ "วิธีเช็กหรือแก้ไขเบื้องต้น" ที่คนทั่วไปทำเองได้ก่อนเสมอ
        - อย่าเพิ่งรีบไล่ไปหาช่าง ยกเว้นว่ามันอันตรายจริงๆ หรือแก้เองไม่ได้แล้ว
        - ห้ามตอบเรื่องอื่นที่ไม่เกี่ยวกับรถยนต์ (บอกลูกค้าสุภาพๆ ว่าไม่รู้)
        - ใช้ภาษาพูดแบบวัยรุ่นนิดๆ มีอีโมจิประกอบ 🛠️🚗
    `;

    const requestBody = {
        contents: [{
            parts: [{ text: systemInstruction + "\n\nลูกค้าถาม: " + userMessage }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "ขอโทษครับ พี่ช่างมึนหัวนิดหน่อย ลองถามใหม่นะ 😵‍💫";
        }
    } catch (error) {
        console.error("AI Error:", error);
        return "ระบบขัดข้อง! (โควต้าเต็มหรือเน็ตหลุด) 😭";
    }

export async function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const chatBox = document.getElementById('chat-box');
    const text = input.value.trim();
    
    if (!text) return;

    chatBox.innerHTML += `
        <div class="chat-msg user" style="text-align: right; margin-bottom: 10px;">
            <span style="background: #FFC107; padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block; font-size: 0.95rem;">
                ${text}
            </span>
        </div>`;
    
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" class="chat-msg ai" style="margin-bottom: 10px;">
            <span style="background: #E5E7EB; padding: 8px 12px; border-radius: 15px 15px 15px 0; display: inline-block; color: #666;">
                กำลังวิเคราะห์... 🔧⚡
            </span>
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const aiReply = await askGemini(text);

    const loadingMsg = document.getElementById(loadingId);
    if (loadingMsg) loadingMsg.remove();

    chatBox.innerHTML += `
        <div class="chat-msg ai" style="margin-bottom: 10px;">
            <span style="background: #E5E7EB; padding: 8px 12px; border-radius: 15px 15px 15px 0; display: inline-block; line-height: 1.5;">
                ${aiReply}
            </span>
        </div>`;
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

export function handleSelectCar(carId) {
    const newCar = MOCK_CARS.find(c => c.id === carId);
    if (newCar) {
        currentCar = newCar;
        document.getElementById('app-view').innerHTML = renderGarage();
    }
}

export function handleLogout() {
    toggleLogoutModal(true);
}

window.toggleLogoutModal = (show) => {
    const modal = document.getElementById('logoutModal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

window.confirmLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');

    window.location.href = 'login.html';
}