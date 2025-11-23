import { MOCK_CARS, MOCK_MASTER_MISSIONS, MOCK_SHOP_ITEMS, MOCK_USER_MISSIONS } from '../../data/mockmain.js'; 
import { CAR_INSIGHTS, REPAIR_ESTIMATES } from '../../data/mockrealdata.js';
import { mockFeedPosts } from '../../data/mockfeed.js';
import { mockCommunityTopics, mockCommunityPosts } from '../../data/mockcommu.js';
import { mockMapPins } from '../../data/mockmap.js';
import { getCurrentUser, getCurrentCar } from './logic.js'; 


export function renderDashboard() {
    const currentUser = getCurrentUser();
    const currentCar = getCurrentCar();

    const { battery, engine, tires } = currentCar.predictiveHealth;
    const totalHealth = Math.round((battery + engine + tires) / 3);
    
    const carKey = `${currentCar.brand}-${currentCar.model}`.toLowerCase().split(' ')[0];
    const insight = CAR_INSIGHTS[carKey] || CAR_INSIGHTS["toyota-vios"]; 
    
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

export function renderGarage() {
    const currentCar = getCurrentCar();
    const carList = MOCK_CARS.map(car => `
        <div class="garage-car-card ${car.id === currentCar.id ? 'active-car' : ''}" onclick="handleSelectCar('${car.id}')">
            ${car.id === currentCar.id ? '<span class="badge-active">ใช้งานอยู่</span>' : ''}
            <div class="car-info">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🚗</div>
                <h4>${car.nickname}</h4>
                <p>${car.brand} ${car.model}</p>
            </div>
            <div class="car-specs">
                <span><i class="fa-solid fa-calendar"></i> ${car.year}</span>
                <span><i class="fa-solid fa-heart-pulse"></i> ${Math.round((car.predictiveHealth.battery + car.predictiveHealth.engine + car.predictiveHealth.tires)/3)}%</span>
            </div>
            <button class="btn-history" onclick="event.stopPropagation(); handleNavClick('nav-history')">
                <i class="fa-solid fa-clock-rotate-left"></i> ดูประวัติซ่อม
            </button>
        </div>
    `).join('');

    return `
    <div class="view-garage fade-in">
        <div class="garage-header">
            <div><h2>🚗 โรงรถของฉัน</h2><p>จัดการรถทั้งหมดของคุณได้ที่นี่</p></div>
            <button class="btn-add-car" onclick="alert('เฟส 2 เจอกันวัยรุ่น!')"><i class="fa-solid fa-plus"></i> เพิ่มรถ</button>
        </div>
        <div class="car-list-grid">${carList}</div>
    </div>`;
}

export function renderHistory() {
    const currentCar = getCurrentCar();
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
                <small style="color: #888;">(คุณจ่าย${h.cost > estimate.avg ? 'แพงกว่า' : 'ถูกกว่า'}นิดหน่อย)</small>
            </div>
        </div>`;
    }).join('');

    return `
    <div class="view-history fade-in">
        <div class="header-back" style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <button onclick="handleNavClick('nav-garage')" style="background:none; border:none; font-size: 1.5rem; cursor: pointer;">⬅️</button>
            <h2>🛠️ ประวัติการซ่อมบำรุง</h2>
        </div>
        <div class="history-container">
            ${historyList.length > 0 ? historyList : '<p>ยังไม่มีประวัติการซ่อมจ้า รถสุขภาพดีเว่อร์!</p>'}
        </div>
    </div>`;
}

export function renderAIChat() {
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

export function renderCommunity() {
    const topicPills = mockCommunityTopics.map(topic => `
        <div class="topic-pill" onclick="alert('กรองหมวด: ${topic.name}')">#${topic.name}</div>
    `).join('');

    const feedItems = mockFeedPosts.map(post => `
        <div class="feed-card">
            <div class="feed-header">
                <div class="user-avatar-sm" style="background: var(--primary);">📢</div>
                <div class="feed-meta">
                    <h5>${post.authorName} <i class="fa-solid fa-circle-check" style="color: #3B82F6;"></i></h5>
                    <span>${post.timestamp}</span>
                </div>
            </div>
            <div class="feed-content">
                <p>${post.content}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" class="feed-image" alt="Feed Image">` : ''}
            </div>
            <div class="feed-actions">
                <button class="action-btn"><i class="fa-regular fa-heart"></i> ถูกใจ</button>
                <button class="action-btn"><i class="fa-regular fa-comment"></i> คอมเมนต์</button>
            </div>
        </div>
    `).join('');

    const userPosts = mockCommunityPosts.map(post => `
        <div class="feed-card">
            <div class="feed-header">
                <div class="user-avatar-sm">👤</div>
                <div class="feed-meta">
                    <h5>${post.authorName}</h5>
                    <span>โพสต์ใน #${mockCommunityTopics.find(t => t.id === post.topicId)?.name || 'ทั่วไป'}</span>
                </div>
            </div>
            <div class="feed-content"><h4>${post.title}</h4></div>
            <div class="feed-actions">
                <button class="action-btn"><i class="fa-regular fa-comment-dots"></i> ${post.replies} ความคิดเห็น</button>
            </div>
        </div>
    `).join('');

    return `
    <div class="view-community fade-in">
        <div class="header-area" style="margin-bottom: 20px;">
            <h2>💬 ชุมชนคนรักรถ</h2><p>แลกเปลี่ยนความรู้ ขิงรถแต่ง แจ้งปัญหา</p>
        </div>
        <div class="topic-filter-bar">
            <div class="topic-pill active">🔥 ทั้งหมด</div>${topicPills}
        </div>
        <div class="feed-container">${feedItems}${userPosts}</div>
        <button class="fab-create-post" onclick="alert('ฟีเจอร์ตั้งกระทู้ กำลังมาจ้า!')"><i class="fa-solid fa-plus"></i></button>
    </div>`;
}

export function renderMap() {
    return `
    <div class="view-map fade-in" style="height: 100%; display: flex; flex-direction: column;">
        <h2>🗺️ แผนที่ & จุดเสี่ยง</h2>
        <p style="color: #666; margin-bottom: 10px;">ใช้แผนที่ OpenStreetMap (ฟรีตลอดชาติ)</p>
        <div id="real-leaflet-map" style="width: 100%; height: 500px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 0;"></div>
        <div style="margin-top: 15px; text-align: center;">
            <span style="margin-right: 15px;">🔴 จุดเสี่ยง</span>
            <span style="color: #2563EB;">🔵 ช่างซ่อม</span>
        </div>
    </div>`;
}

export function renderMissions() {
    const currentUser = getCurrentUser();
    const missionList = MOCK_MASTER_MISSIONS.map(m => {
        const statusData = MOCK_USER_MISSIONS.find(um => um.missionId === m.id);
        
        let statusText = "ยังไม่ทำ";
        let buttonHTML = `<button style="background: #9CA3AF; color: white; padding: 5px 15px; border-radius: 20px;" disabled>รอทำ</button>`;
        let itemStyle = 'background: #F3F4F6;';
        
        if (statusData) {
            if (statusData.status === 'active') {
                statusText = "✅ พร้อมเคลม";
                itemStyle = 'background: #FFFBEB; border: 2px solid var(--primary);';
                buttonHTML = `<button class="btn-claim" onclick="claimMission('${m.id}')" style="background: var(--primary); color: var(--dark); cursor: pointer; font-weight: bold; padding: 5px 15px; border-radius: 20px;">
                                <i class="fa-solid fa-gift"></i> เคลม ${m.rewardPoints} P
                              </button>`;
            } else if (statusData.status === 'completed') {
                statusText = "🌟 สำเร็จแล้ว";
                itemStyle = 'background: #D1FAE5; border: 2px solid #10B981;';
                buttonHTML = `<button style="background: #10B981; color: white; padding: 5px 15px; border-radius: 20px;" disabled>สำเร็จแล้ว</button>`;
            }
        }

        return `
            <div class="mission-item" style="margin-bottom: 10px; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; ${itemStyle}">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="mission-icon" style="font-size: 1.5rem;">
                        ${m.type === 'daily' ? '📅' : m.type === 'action' ? '🛠️' : '🌟'}
                    </div>
                    <div class="mission-info">
                        <h5 style="margin: 0;">${m.title}</h5>
                        <p style="margin: 0; font-size: 0.8rem; color: #666;">
                            สถานะ: <strong>${statusText}</strong>
                        </p>
                    </div>
                </div>
                ${buttonHTML}
            </div>
        `;
    }).join('');

    return `
    <div class="view-missions fade-in">
        <div style="background: var(--dark); color: var(--white); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h2>🎮 ภารกิจ & รางวัล</h2>
            <p style="margin-top: 5px; color: var(--primary);">แต้มที่มี: ${currentUser.points.toLocaleString()} P</p>
        </div>
        <div class="grid-layout">${missionList}</div>
    </div>
    `;
}

export function renderShop() {
    const currentUser = getCurrentUser();
    const shopItemsHTML = MOCK_SHOP_ITEMS.map(item => {
        const canAfford = currentUser.points >= item.pricePoints;
        
        const redeemButton = `<button class="btn-redeem" ${canAfford ? '' : 'disabled'} onclick="alert('แลก ${item.name} ใช้ ${item.pricePoints.toLocaleString()} P')">
                                <i class="fa-solid fa-coins"></i> แลกเลย
                              </button>`;
        
        const cashPrice = item.priceCash 
            ? `<span class="price-cash">${item.priceCash.toLocaleString()} บาท</span>` 
            : '';

        return `
        <div class="shop-item-card">
            <div class="item-image-area">
                ${item.pricePoints < 2000 ? '🧴' : '🏷️'}
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="item-price">
                    ${item.pricePoints.toLocaleString()} P
                    ${cashPrice}
                </div>
                ${redeemButton}
            </div>
        </div>
        `;
    }).join('');

    return `
    <div class="view-shop fade-in">
        <div class="shop-header">
            <div>
                <h2>🛍️ ร้านค้า</h2>
                <p>ใช้แต้มแลกของรางวัล หรือ ส่วนลด</p>
            </div>
            <div class="shop-points-display">
                <i class="fa-solid fa-coins"></i> ${currentUser.points.toLocaleString()} P
            </div>
        </div>
        
        <h3>🔥 สินค้ายอดนิยม</h3>
        <div class="shop-grid">
            ${shopItemsHTML}
        </div>
    </div>
    `;
}