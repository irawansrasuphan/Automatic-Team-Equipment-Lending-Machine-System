/* ==========================================================
   data.js  —  ข้อมูลจำลอง (ใช้ทดสอบก่อนต่อฐานข้อมูลจริง)
   ภายหลังจะเปลี่ยนไปดึงจากฐานข้อมูล แต่หน้าเว็บยังเรียกใช้ฟังก์ชันชื่อเดิม
   ========================================================== */

// สถานะของช่อง
const STATUS = {
  AVAILABLE: "available", // ว่าง พร้อมยืม
  BORROWED: "borrowed", // ถูกยืมอยู่
  EMPTY: "empty", // รอเจ้าหน้าที่เติม
  REPAIR: "repair", // ปิดซ่อมบำรุง
};

// อุปกรณ์ 3 ชนิด (เรียงตามลำดับที่แสดงในหน้าหลัก)
const EQUIPMENT = [
  { id: "basketball", name: "บาสเกตบอล", image: "images/ball-basketball.png" },
  { id: "volleyball", name: "วอลเลย์บอล", image: "images/ball-volleyball.png" },
  { id: "futsal", name: "ฟุตซอล", image: "images/ball-futsal.png" },
];

// ช่องทั้ง 9 ช่อง  (ช่อง 1 = บาส, ช่อง 2 = วอลเลย์บอล, ช่อง 3 = ฟุตซอล ของทุกด้าน A B C)
// เริ่มต้น "ว่างครบทั้ง 9 ช่อง" เพราะยังไม่มีใครยืม
// ถ้าอยากทดสอบสถานะอื่น ให้แก้ status ของช่องนั้นชั่วคราว เช่น
// STATUS.BORROWED (ถูกยืม) / STATUS.EMPTY (รอเติม) / STATUS.REPAIR (ซ่อม)
const SLOTS = [
  {
    id: "A1",
    side: "A",
    number: 1,
    equipmentId: "basketball",
    status: STATUS.AVAILABLE,
  },
  {
    id: "B1",
    side: "B",
    number: 1,
    equipmentId: "basketball",
    status: STATUS.AVAILABLE,
  },
  {
    id: "C1",
    side: "C",
    number: 1,
    equipmentId: "basketball",
    status: STATUS.AVAILABLE,
  },

  {
    id: "A2",
    side: "A",
    number: 2,
    equipmentId: "volleyball",
    status: STATUS.AVAILABLE,
  },
  {
    id: "B2",
    side: "B",
    number: 2,
    equipmentId: "volleyball",
    status: STATUS.AVAILABLE,
  },
  {
    id: "C2",
    side: "C",
    number: 2,
    equipmentId: "volleyball",
    status: STATUS.AVAILABLE,
  },

  {
    id: "A3",
    side: "A",
    number: 3,
    equipmentId: "futsal",
    status: STATUS.AVAILABLE,
  },
  {
    id: "B3",
    side: "B",
    number: 3,
    equipmentId: "futsal",
    status: STATUS.AVAILABLE,
  },
  {
    id: "C3",
    side: "C",
    number: 3,
    equipmentId: "futsal",
    status: STATUS.AVAILABLE,
  },
];

// ----- ของที่ผู้ใช้คนนี้ยืมอยู่ (เก็บในเบราว์เซอร์ก่อน) -----
const LOAN_KEY = "locker_my_loan";

// อ่านรายการที่ยืมอยู่ ถ้าไม่ได้ยืมอะไรอยู่จะได้ null
function getMyLoan() {
  const text = localStorage.getItem(LOAN_KEY);
  if (text === null) {
    return null;
  }
  return JSON.parse(text);
}

// บันทึกว่ากำลังยืมอะไร เช่น { slotId: "A1", equipmentId: "basketball" }
function setMyLoan(loan) {
  localStorage.setItem(LOAN_KEY, JSON.stringify(loan));
}

// ลบรายการที่ยืมอยู่ (เหมือนคืนของแล้ว)
function clearMyLoan() {
  localStorage.removeItem(LOAN_KEY);
}

// ได้รายการช่องทั้ง 9 ช่อง โดยช่องที่ผู้ใช้ยืมอยู่จะถูกเปลี่ยนเป็น "ถูกยืม"
function getSlots() {
  const loan = getMyLoan();
  return SLOTS.map(function (slot) {
    if (loan !== null && loan.slotId === slot.id) {
      return Object.assign({}, slot, { status: STATUS.BORROWED });
    }
    return slot;
  });
}

// หาอุปกรณ์จาก id เช่น findEquipment("futsal")
function findEquipment(id) {
  return EQUIPMENT.find(function (item) {
    return item.id === id;
  });
}

// นับว่าอุปกรณ์ชนิดนี้เหลือกี่ลูก (นับเฉพาะช่องที่ว่าง)
function countAvailable(equipmentId) {
  return getSlots().filter(function (slot) {
    return slot.equipmentId === equipmentId && slot.status === STATUS.AVAILABLE;
  }).length;
}

// ----- สถานะการยืมจากตู้ (จำลอง) -----
// ค่า 0 = รอตู้ปลดล็อก, 1 = ปลดล็อกแล้ว, 2 = หยิบของแล้ว,
//       3 = ปิดประตูแล้ว, 4 = ยืมสำเร็จ
// ภายหลังเมื่อต่อตู้จริง ให้แก้ getLockerStep() ให้ดึงสถานะจากตู้/ฐานข้อมูล
// หน้าเว็บเรียกใช้ฟังก์ชันชื่อเดิม จึงไม่ต้องแก้หน้าอื่น
const STEP_KEY = "locker_step";

// อ่านสถานะล่าสุดจากตู้ ถ้ายังไม่มีสัญญาณจะได้ 0
function getLockerStep() {
  const text = localStorage.getItem(STEP_KEY);
  if (text === null) {
    return 0;
  }
  return Number(text);
}

// จำลองสัญญาณจากตู้ (ใช้ทดสอบใน Console เท่านั้น)
function setLockerStep(step) {
  localStorage.setItem(STEP_KEY, String(step));
}

// ล้างสถานะกลับเป็นเริ่มต้น
function clearLockerStep() {
  localStorage.removeItem(STEP_KEY);
}

// ----- ประวัติการยืม -----
// true = แสดงประวัติตัวอย่าง 4 รายการ (ไว้ดูหน้าตาเท่านั้น)
// false = แสดงเฉพาะประวัติจริงของผู้ใช้ (ค่าปกติ)
const SHOW_SAMPLE_HISTORY = false;

// true = แสดงปุ่ม "คืนอุปกรณ์ (ปุ่มทดสอบ)" ท้ายหน้าประวัติ ไว้จำลองว่าเจ้าหน้าที่รับคืน
// ก่อนใช้งานจริงต้องเปลี่ยนเป็น false เพราะผู้ใช้ต้องคืนกับเจ้าหน้าที่เท่านั้น
const SHOW_RETURN_TEST_BUTTON = true;

// ประวัติตัวอย่างที่คืนแล้ว (new Date(ปี ค.ศ., เดือน-1, วัน, ชั่วโมง, นาที))
const SAMPLE_HISTORY = [
  {
    equipmentId: "futsal",
    slotId: "B3",
    borrowedAt: new Date(2026, 9, 11, 16, 5).getTime(),
    returned: true,
  },
  {
    equipmentId: "volleyball",
    slotId: "C2",
    borrowedAt: new Date(2026, 9, 4, 12, 30).getTime(),
    returned: true,
  },
  {
    equipmentId: "basketball",
    slotId: "A1",
    borrowedAt: new Date(2026, 8, 27, 15, 10).getTime(),
    returned: true,
  },
  {
    equipmentId: "futsal",
    slotId: "B3",
    borrowedAt: new Date(2026, 8, 20, 13, 45).getTime(),
    returned: true,
  },
];

// ชื่อกล่องที่เก็บรายการ "คืนแล้ว" ในเบราว์เซอร์
const HISTORY_KEY = "locker_history";

// อ่านรายการที่คืนแล้วทั้งหมด (ถ้ายังไม่มีจะได้ [])
function getReturnedList() {
  const text = localStorage.getItem(HISTORY_KEY);
  if (text === null) {
    return [];
  }
  return JSON.parse(text);
}

// บันทึกว่า "คืนอุปกรณ์แล้ว" : ย้ายของที่ยืมอยู่ไปเก็บในประวัติ แล้วเคลียร์รายการที่ยืมอยู่
// ผู้ใช้กดคืนเองในเว็บไม่ได้ ต้องนำของไปคืนที่เจ้าหน้าที่ แล้วเจ้าหน้าที่เป็นคนกดรับคืน
// ตอนนี้ยังไม่มีเว็บเจ้าหน้าที่ จึงเรียกจาก Console เพื่อทดสอบ: returnMyLoan()
// ภายหลังเว็บเจ้าหน้าที่จะทำหน้าที่นี้ผ่านฐานข้อมูล
function returnMyLoan() {
  const loan = getMyLoan();
  if (loan === null) {
    console.log("ตอนนี้ไม่ได้ยืมอะไรอยู่");
    return;
  }

  const list = getReturnedList();
  list.push({
    equipmentId: loan.equipmentId,
    slotId: loan.slotId,
    borrowedAt: loan.borrowedAt || Date.now(),
    returnedAt: Date.now(),
    returned: true,
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));

  clearMyLoan(); // ไม่ได้ยืมอยู่แล้ว ยืมใหม่ได้
  clearLockerStep();
  console.log("บันทึกการคืนแล้ว รีเฟรชหน้าเพื่อดูผล");
}

// ล้างประวัติที่คืนแล้วทั้งหมด (ใช้ล้างข้อมูลทดสอบ)
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// ได้รายการประวัติทั้งหมด เรียงใหม่สุดขึ้นก่อน
// ภายหลังเมื่อมีฐานข้อมูล ให้แก้ฟังก์ชันนี้ให้ดึงจากฐานข้อมูลแทน
function getHistory() {
  let list = [];

  if (SHOW_SAMPLE_HISTORY) {
    list = SAMPLE_HISTORY.slice(); // ทำสำเนา จะได้ไม่แก้ของเดิม
  }

  // รายการที่คืนแล้ว
  list = list.concat(getReturnedList());

  // ของที่ยืมอยู่ตอนนี้ = รายการ "ยังไม่คืน"
  const loan = getMyLoan();
  if (loan !== null) {
    list.push({
      equipmentId: loan.equipmentId,
      slotId: loan.slotId,
      borrowedAt: loan.borrowedAt || Date.now(),
      returned: false,
    });
  }

  // เรียงจากใหม่ไปเก่า
  list.sort(function (a, b) {
    return b.borrowedAt - a.borrowedAt;
  });
  return list;
}

// ==========================================================
// ข้อมูลติดต่อเจ้าหน้าที่ (หน้า contact.html อ่านจากตรงนี้)
// ใส่ข้อมูลจริงในเครื่องหมายคำพูด ถ้ายังไม่ใส่ (ปล่อยว่าง "") หน้าเว็บจะแสดง
// ข้อความแทนที่ เช่น "[เบอร์โทรเจ้าหน้าที่]" และปุ่มโทร/แชทจะกดไม่ได้
// ==========================================================
const CONTACT = {
  phone: "", // เบอร์โทร เช่น "081-234-5678"
  lineId: "", // LINE ID เช่น "@sportslocker"
  place: "", // จุดรับคืนอุปกรณ์ เช่น "อาคารกีฬา ห้อง 101"
  hours: "", // เวลาทำการ เช่น "จันทร์-ศุกร์ 08:30-16:30"
};

// ตรวจว่าช่องนั้นยังไม่ได้กรอก (ว่างอยู่) หรือไม่
function isPlaceholder(value) {
  return value === undefined || value.trim() === "";
}

// ==========================================================
// เรื่องที่ผู้ใช้แจ้งปัญหาตู้ (หน้า report.html)
// ตอนนี้เก็บไว้ในเบราว์เซอร์ก่อน ภายหลังเปลี่ยนไปเก็บในฐานข้อมูลที่ฟังก์ชันนี้ที่เดียว
// type เก็บเป็นรหัส: door_stuck, door_loose, sensor, mismatch, other
// ==========================================================
const REPORT_KEY = "locker_reports";

// อ่านรายการแจ้งปัญหาทั้งหมด (ใหม่สุดอยู่ท้ายสุด)
function getReports() {
  const text = localStorage.getItem(REPORT_KEY);
  if (text === null) {
    return [];
  }
  return JSON.parse(text);
}

// บันทึกเรื่องที่แจ้งเพิ่ม 1 รายการ
function saveReport(report) {
  const list = getReports();
  list.push(report);
  localStorage.setItem(REPORT_KEY, JSON.stringify(list));
}
