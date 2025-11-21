export const CAR_INSIGHTS = {
    "toyota-vios": {
        commonIssues: ["หม้อน้ำรั่ว", "ไดสตาร์ทเสีย", "แบตเตอรี่หมดไว"],
        warningMessage: "Tips: ชาว Vios ระวังเรื่อง 'หม้อน้ำรั่ว' กับ 'ไดสตาร์ท' นะครับ เจอเคสบ่อยมากในเดือน พ.ค.-มิ.ย.!",
        riskLevel: "high"
    },
    "honda-jazz": {
        commonIssues: ["ไดสตาร์ทเสีย", "สตาร์ทไม่ติด"],
        warningMessage: "Tips: รุ่นนี้ถ้าสตาร์ทเงียบ ส่วนใหญ่เป็นที่ 'ไดสตาร์ท' ครับ ไม่ใช่แบตเสมอไปนะ",
        riskLevel: "medium"
    },
    "isuzu-d-max": {
        commonIssues: ["กุญแจสตาร์ท", "ระบบไฟ"],
        warningMessage: "Tips: D-Max สตาร์ทไม่ติด เช็ก 'ดอกกุญแจ' หรือถ่านรีโมทก่อนเลยครับ เคสเส้นผมบังภูเขาเยอะ!",
        riskLevel: "medium"
    },
    "honda-city": {
        commonIssues: ["ความร้อนขึ้น", "พัดลมหม้อน้ำ"],
        warningMessage: "Tips: ขับ City หมั่นดูเกจ์ความร้อนนิดนึงนะครับ ช่วงนี้เจอเคสพัดลมหม้อน้ำไม่ตัดบ่อย",
        riskLevel: "medium"
    },
    "nissan-kicks": {
        commonIssues: ["Inverter ร้อน", "แอร์ไม่เย็น"],
        warningMessage: "Tips: Kicks e-Power ขับสนุก แต่ระวังระบบระบายความร้อน Inverter ด้วยนะครับ",
        riskLevel: "low"
    }
};


export const REPAIR_ESTIMATES = {
    "เปลี่ยนแบตเตอรี่": { min: 2200, max: 3000, avg: 2590, unit: "บาท" },
    "จั๊มแบต": { min: 300, max: 500, avg: 400, unit: "บาท" },
    "เปลี่ยนไดสตาร์ท": { min: 3500, max: 5500, avg: 4500, unit: "บาท" },
    "เช็คระบบไฟ/แอร์": { min: 500, max: 1500, avg: 800, unit: "บาท" },
    "ยางรั่ว/ปะยาง": { min: 200, max: 500, avg: 300, unit: "บาท" },
    "รถสไลด์/รถยก": { min: 1500, max: 3500, avg: 2000, unit: "บาท" }
};


export const AI_KNOWLEDGE = [
    { 
        keywords: ["สตาร์ทไม่ติด", "เงียบ", "แชะๆ", "บิดกุญแจ"], 
        likelyCauses: [
            { cause: "แบตเตอรี่หมด", probability: "70%" },
            { cause: "ไดสตาร์ทเสีย", probability: "20%" },
            { cause: "กุญแจ/ถ่านรีโมท", probability: "10%" }
        ],
        suggestion: "อาการสตาร์ทไม่ติด เป็นไปได้สูงว่าแบตหมดครับ! แต่ถ้าเปิดไฟหน้าติดแต่สตาร์ทเงียบ อาจเป็นที่ไดสตาร์ทครับ"
    },
    { 
        keywords: ["แอร์ไม่เย็น", "ลมออก", "ร้อน"], 
        likelyCauses: [
            { cause: "น้ำยาแอร์หมด", probability: "60%" },
            { cause: "คอมแอร์ตัด", probability: "30%" },
            { cause: "พัดลมหม้อน้ำ", probability: "10%" }
        ],
        suggestion: "แอร์ไม่เย็นมีแต่ลม ลองดูความร้อนเครื่องยนต์ด้วยนะครับ ถ้าความร้อนขึ้นให้จอดทันที! (อาจเป็นพัดลมเสีย)"
    },
    { 
        keywords: ["ไฟโชว์", "รูปเครื่อง", "ไฟแบต"], 
        likelyCauses: [
            { cause: "ไดชาร์จเสีย", probability: "50%" },
            { cause: "เซนเซอร์เครื่องยนต์", probability: "40%" }
        ],
        suggestion: "ไฟโชว์อันตรายครับ! ถ้าเป็นรูปแบตเตอรี่ แปลว่าไดชาร์จอาจไม่ทำงาน รถจะดับในอีกไม่กี่ กม. รีบหาที่จอดปลอดภัยครับ"
    },
    { 
        keywords: ["ยาง", "รั่ว", "แบน"], 
        likelyCauses: [
            { cause: "ยางรั่ว", probability: "90%" },
            { cause: "ลมยางอ่อน", probability: "10%" }
        ],
        suggestion: "ยางแบนอย่าฝืนขับนะครับ! เดี๋ยวล้อแม็กดุ้ง บดยางเสียหาย เปลี่ยนยางอะไหล่เป็นไหมครับ? ให้ผมช่วยเรียกช่างไหม?"
    }
];