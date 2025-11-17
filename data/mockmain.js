export const MOCK_USER = {
  id: "u_mon_001",
  name: "mon",
  level: 12,
  points: 1500,
  profilePicUrl: "https://media.discordapp.net/attachments/1033755067263762484/1439983414035087451/Gemini_Generated_Image_vpxvwvpxvwvpxvwv.jpg?ex=691c808f&is=691b2f0f&hm=f7ceb61555e0a34b54c0813ecb54cc99d3d04ccd21879f622a7eb47264aaa1cd&=&format=webp"
};


export const MOCK_CARS = [
  { 
    id: "car_001", 
    ownerId: "u_mon_001", 
    nickname: "kicks",
    brand: "nison",
    model: "kicks e-power",
    year: 2020,
    predictiveHealth: { 
      battery: 65,
      engine: 90, 
      tires: 80 
    },
    repairHistory: [
      { date: "2025-05-10", service: "Battery Change", cost: 2500 }
    ]
  },

];


export const MOCK_MASTER_MISSIONS = [
  { id: "m_001", title: "Check-in", rewardPoints: 10, type: "daily" },
  { id: "m_002", title: "check battery with ai", rewardPoints: 50, type: "action" },
  { id: "m_003", title: "post on community", rewardPoints: 100, type: "action" },
  { id: "m_004", title: "Beat the Stats: kicks 2020", rewardPoints: 200, type: "special" }
];


export const MOCK_USER_MISSIONS = [
  { userId: "u_mon_001", missionId: "m_001", status: "completed" },
  { userId: "u_mon_001", missionId: "m_002", status: "active" }
];


export const MOCK_SHOP_ITEMS = [
  { id: "item_001", name: "car shampoo", pricePoints: 1000, priceCash: 299 },
  { id: "item_002", name: "discount 67%", pricePoints: 2000, priceCash: null }
];