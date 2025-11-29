import { MOCK_USER, MOCK_CARS, MOCK_MASTER_MISSIONS, MOCK_USER_MISSIONS } from '../../data/mockmain.js'; 
import { AI_KNOWLEDGE } from '../../data/mockrealdata.js';
import { renderMissions, renderGarage } from './render.js';

// --- 1. ส่วนจัดการ User ---
let savedUserData = null;
try {
    savedUserData = JSON.parse(localStorage.getItem('userProfileData'));
} catch (e) {}

let currentUser = savedUserData || MOCK_USER; 
let currentCar = MOCK_CARS.find(car => car.ownerId === currentUser.id) || MOCK_CARS[0];

export const getCurrentUser = () => currentUser;
export const getCurrentCar = () => currentCar;

export function updateHeaderPoints() {
    document.getElementById('user-points').textContent = currentUser.points.toLocaleString(); 
}

// --- 2. ส่วนภารกิจ ---
export function claimMission(missionId) {
    const userMission = MOCK_USER_MISSIONS.find(um => um.missionId === missionId && um.status === 'active');
    const masterMission = MOCK_MASTER_MISSIONS.find(mm => mm.id === missionId);

    if (userMission && masterMission) {
        currentUser.points += masterMission.rewardPoints;
        userMission.status = 'completed';

        if(localStorage.getItem('userProfileData')) {
            localStorage.setItem('userProfileData', JSON.stringify(currentUser));
        }

        updateHeaderPoints(); 
        document.getElementById('app-view').innerHTML = renderMissions();
        alert(`สำเร็จ! รับไปเลย ${masterMission.rewardPoints} P!`);
    } else {
        alert("ภารกิจนี้ยังไม่ Active หรือถูกเคลมไปแล้วค่ะ");
    }
}

// --- 3. ส่วนแผนที่ ---
const mockMapPins = {
    riskPins: [
        { lat: 13.7563, long: 100.5018, type: "อุบัติเหตุ", message: "อุบัติเหตุรถชนหลายคัน โปรดระมัดระวัง" },
        { lat: 13.7450, long: 100.5320, type: "ถนนลื่น", message: "ฝนตกถนนลื่น ระวังการขับขี่" },
    ],
    technicianPins: [
        { lat: 13.7620, long: 100.4950, name: "ช่างสมชาย", rating: 4.8 },
        { lat: 13.7510, long: 100.5200, name: "ช่างยุทธนา", rating: 4.5 },
    ]
};

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

// --- 4. ส่วน AI Chatbot ---
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
}

export async function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const chatBox = document.getElementById('chat-box');
    const text = input.value.trim();
    
    if (!text) return;

    chatBox.innerHTML += `
        <div class="chat-msg user" style="text-align: right; margin-bottom: 10px;">
            <span style="background: var(--bg-chat-user); padding: 8px 12px; border-radius: 15px 15px 0 15px; display: inline-block; font-size: 0.95rem;">
                ${text}
            </span>
        </div>`;
    
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" class="chat-msg ai" style="margin-bottom: 10px;">
            <span style="background: var(--bg-chat-ai); padding: 8px 12px; border-radius: 15px 15px 15px 0; display: inline-block; color: var(--text-main);">
                กำลังวิเคราะห์... 🔧⚡
            </span>
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const aiReply = await askGemini(text);

    const loadingMsg = document.getElementById(loadingId);
    if (loadingMsg) loadingMsg.remove();

    chatBox.innerHTML += `
        <div class="chat-msg ai" style="margin-bottom: 10px;">
            <span class="bubble-ai">
                ${aiReply}
            </span>
        </div>`;
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

// --- 5. ส่วนจัดการรถ และ Logout ---
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

// --- 6. ส่วน Community (สร้างโพสต์) ---
export function togglePostModal(show) {
    const modal = document.getElementById('postModal');
    if(modal) {
        if (show) modal.classList.remove('hidden');
        else modal.classList.add('hidden');
    }
}

export function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export function previewImage() {
    const file = document.getElementById('post-image-input').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview-container').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}

export function clearImage() {
    document.getElementById('post-image-input').value = ""; 
    document.getElementById('image-preview-container').classList.add('hidden');
}

export async function handleCreatePost() {
    const text = document.getElementById('post-text').value;
    const fileInput = document.getElementById('post-image-input').files[0];
    
    if (!text && !fileInput) {
        alert("พิมพ์อะไรหน่อยสิเตง! 🥺");
        return;
    }

    let imageBase64 = null;
    if (fileInput) {
        try {
            imageBase64 = await convertImageToBase64(fileInput);
        } catch (e) {
            console.error("แปลงรูปไม่ได้", e);
        }
    }

    const newPost = {
        postId: "local_" + Date.now(),
        authorName: localStorage.getItem('currentUser') || "ฉันเอง",
        content: text,
        imageUrl: imageBase64,
        timestamp: "เมื่อสักครู่",
        isLocal: true
    };

    const oldPosts = JSON.parse(localStorage.getItem('myCommunityPosts')) || [];
    oldPosts.unshift(newPost);
    
    try {
        localStorage.setItem('myCommunityPosts', JSON.stringify(oldPosts));
        togglePostModal(false);
        document.getElementById('nav-community').click(); 
        
    } catch (e) {
        alert("เมมเต็มแล้ว! ลบโพสต์เก่าๆ ออกบ้างน้า 😭");
    }
}

// --- 7. ส่วน Community (ลบโพสต์) ---
let postToDeleteId = null;

export function handleDeletePost(postId) {
    postToDeleteId = postId;
    const modal = document.getElementById('deleteModal');
    if(modal) modal.classList.remove('hidden');
}

export function closeDeleteModal() {
    postToDeleteId = null;
    const modal = document.getElementById('deleteModal');
    if(modal) modal.classList.add('hidden');
}

export function confirmDeletePost() {
    if (!postToDeleteId) return;

    let localPosts = JSON.parse(localStorage.getItem('myCommunityPosts')) || [];
    localPosts = localPosts.filter(post => post.postId !== postToDeleteId);
    localStorage.setItem('myCommunityPosts', JSON.stringify(localPosts));

    closeDeleteModal();
    document.getElementById('nav-community').click();
}

// --- 8. ส่วน Dark Mode ---
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } 
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);   
    localStorage.setItem('theme', newTheme); 
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
}

// --- 9. ส่วน Profile Page (กู้คืนมาแล้ว!) ---
export function previewProfileImage() {
    const file = document.getElementById('profile-upload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic-preview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

export async function handleSaveProfile() {
    const newName = document.getElementById('edit-name').value;
    const fileInput = document.getElementById('profile-upload').files[0];
    
    if (!newName.trim()) {
        alert("ชื่อห้ามว่างนะเตง!");
        return;
    }

    currentUser.name = newName;

    if (fileInput) {
        try {
            const base64 = await convertImageToBase64(fileInput);
            currentUser.profilePicUrl = base64;
        } catch (e) {
            console.error("เปลี่ยนรูปไม่สำเร็จ", e);
        }
    }

    try {
        localStorage.setItem('userProfileData', JSON.stringify(currentUser));
        
        document.querySelector('.user-name').textContent = currentUser.name;
        document.querySelector('.profile-pic img').src = currentUser.profilePicUrl;

        alert("บันทึกข้อมูลเรียบร้อย! ✨");
    } catch(e) {
        alert("เมมเต็มแล้ว! รูปอาจจะใหญ่ไป 🥺");
    }
}