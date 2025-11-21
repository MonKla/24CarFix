import { MOCK_USER, MOCK_CARS, MOCK_MASTER_MISSIONS, MOCK_USER_MISSIONS } from '../data/mockmain.js'; 
import { AI_KNOWLEDGE } from '../data/mockRealData.js';
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

export function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="chat-msg user" style="text-align: right; margin-bottom: 10px;"><span style="background: #FFC107; padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block;">${text}</span></div>`;
    input.value = '';

    setTimeout(() => {
        const foundKnowledge = AI_KNOWLEDGE.find(k => k.keywords.some(word => text.includes(word)));
        let reply = "ขอโทษนะครับ ผมยังไม่แน่ใจอาการนี้ ลองอธิบายเพิ่มเติม หรือถ่ายรูปมาให้ดูหน่อยครับ";
        
        if (foundKnowledge) {
            reply = `<strong>${foundKnowledge.suggestion}</strong><br><small>🔍 ความน่าจะเป็น:</small><br>${foundKnowledge.likelyCauses.map(c => `- ${c.cause} (${c.probability})`).join('<br>')}`;
        }
        chatBox.innerHTML += `<div class="chat-msg ai" style="margin-bottom: 10px;"><span style="background: #E5E7EB; padding: 8px 12px; border-radius: 15px 15px 15px 0; display: inline-block;">${reply}</span></div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
}

export function handleSelectCar(carId) {
    const newCar = MOCK_CARS.find(c => c.id === carId);
    if (newCar) {
        currentCar = newCar;
        document.getElementById('app-view').innerHTML = renderGarage();
    }
}