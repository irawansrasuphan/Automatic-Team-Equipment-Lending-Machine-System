/* ==========================================================
   i18n.js  —  ระบบแปลภาษาของทั้งเว็บ (ไทย / English)
   ต้องโหลดต่อจาก common.js (ใช้ getLang) และก่อน js ของแต่ละหน้า

   วิธีใช้
   1) ข้อความคงที่ใน HTML : ใส่ data-i18n="คีย์"            เช่น <h1 data-i18n="reg.title">
                            ใส่ data-i18n-placeholder="คีย์"  สำหรับ placeholder
                            ใส่ data-i18n-aria="คีย์"         สำหรับ aria-label
   2) ข้อความที่ JavaScript สร้าง : เรียก t("คีย์") หรือ t("คีย์", { ตัวแปร: ค่า })
   3) อยากเพิ่ม/แก้คำแปล : แก้ในตาราง DICT ด้านล่างที่เดียว (th = ไทย, en = English)
   ========================================================== */

const DICT = {
  th: {
    "app.name": "ตู้ยืมอุปกรณ์กีฬา",
    "common.back": "ย้อนกลับ",
    "common.backHome": "กลับสู่หน้าหลัก",
    "note.returnDirect":
      "การคืนอุปกรณ์ ต้องนำมาคืนที่เจ้าหน้าที่โดยตรงเท่านั้น",
    "note.returnRemind":
      "ย้ำ: กรุณานำอุปกรณ์ไปคืนที่เจ้าหน้าที่ผู้ดูแลโดยตรง ในเวลาทำการ",
    "status.notReturned": "ยังไม่คืน",
    "status.returned": "คืนแล้ว",
    "loc.short": "ตู้ {side} ช่อง {n}",
    "loc.dot": "ตู้ {side} · ช่อง {n}",
    left: "เหลือ {n} ลูก",
    soldOut: "หมด",

    // อุปกรณ์
    "eq.basketball": "บาสเกตบอล",
    "eq.volleyball": "วอลเลย์บอล",
    "eq.futsal": "ฟุตซอล",

    // ลงทะเบียน
    "reg.title": "ลงทะเบียน",
    "reg.subtitle": "เข้าใช้งานตู้ยืมอุปกรณ์กีฬา",
    "reg.name": "ชื่อ-นามสกุล",
    "reg.namePh": "ชื่อ-นามสกุล",
    "reg.studentId": "รหัสนักศึกษา",
    "reg.studentIdPh": "รหัส 10 หลัก",
    "reg.phone": "เบอร์โทรติดต่อ",
    "reg.phonePh": "08x-xxx-xxxx",
    "reg.consent":
      "ข้าพเจ้ายินยอมให้ใช้ข้อมูลนี้เพื่อบันทึกการยืมและติดต่อกรณีที่ไม่คืนอุปกรณ์เท่านั้น",
    "reg.next": "ถัดไป",
    "reg.errName": "กรุณากรอกชื่อ-นามสกุล",
    "reg.errStudentId": "รหัสนักศึกษาต้องเป็นตัวเลข {n} หลัก",
    "reg.errPhone": "กรุณากรอกเบอร์โทร {n} หลัก ขึ้นต้นด้วย 0",
    "reg.errConsent": "กรุณาติ๊กยินยอมก่อนไปต่อ",

    // หน้าหลัก
    "home.greeting": "สวัสดี {name} วันนี้เล่นอะไรดี?",
    "home.menuAria": "เปิดเมนู",
    "home.rule": "1 บัญชียืมได้ 1 อุปกรณ์ · ต้องคืนก่อนจึงจะยืมใหม่ได้",
    "home.loanSmall": "คุณกำลังยืมอยู่",
    "home.loanNote": "คืนที่เจ้าหน้าที่ก่อน จึงจะยืมใหม่ได้",
    "home.all": "อุปกรณ์ทั้งหมด",
    "home.pick": "เลือกอุปกรณ์ที่ต้องการยืม",
    "home.totalSlots": "ทั้งหมด 3 ช่อง",
    "home.noEquip": "ไม่มีอุปกรณ์ในตอนนี้",
    "home.returnFirst": "คืนอุปกรณ์ก่อนจึงยืมได้",
    "home.borrow": "ยืม",
    "home.title": "หน้าหลัก",

    // เลือกช่อง
    "eq.pageTitle": "เลือกช่อง",
    "eq.position": "ตำแหน่ง {ids}",
    "eq.choose": "เลือกช่องที่ต้องการยืม",
    "eq.freeOf": "ว่างอยู่ {free} จาก {total} ช่อง",
    "eq.tip":
      "เลือกช่องที่ว่างแล้วกด “ยืมช่องนี้” ได้เลย · 1 บัญชียืมได้ 1 อุปกรณ์",
    "slot.free": "ว่าง · พร้อมยืม",
    "slot.borrowed": "ถูกยืมอยู่",
    "slot.waiting": "รอเจ้าหน้าที่เติม",
    "slot.repair": "ปิดซ่อมบำรุง",
    "slot.side": "ตู้ด้าน {side}",
    "slot.number": "ช่อง {n}",
    "slot.borrowBtn": "ยืมช่องนี้",

    // ยืนยันการยืม
    "cf.pageTitle": "ยืนยันการยืม",
    "cf.borrowing": "คุณกำลังยืม",
    "cf.itemName": "ลูก{name}",
    "cf.chip": "ตู้ด้าน {side} · ช่องที่ {n}",
    "cf.reserved": "ช่องนี้ถูกจองให้คุณแล้ว คนอื่นยืมช่องเดียวกันไม่ได้",
    "cf.confirm": "ยืนยันการยืม",
    "cf.working": "กำลังดำเนินการ...",
    "cf.done": "ยืมสำเร็จแล้ว",
    "cf.s1.title": "ปลดล็อกประตู",
    "cf.s1.pending": "รอส่งคำสั่งไปที่ตู้",
    "cf.s1.active": "กำลังส่งคำสั่งไปที่ตู้",
    "cf.s1.done": "ส่งคำสั่งไปที่ตู้แล้ว",
    "cf.s2.title": "หยิบอุปกรณ์",
    "cf.s2.pending": "รอเซนเซอร์ IR ตรวจจับการหยิบ",
    "cf.s2.active": "รอเซนเซอร์ IR ตรวจพบว่าของถูกหยิบ",
    "cf.s2.done": "เซนเซอร์ IR ตรวจพบว่าของถูกหยิบ",
    "cf.s3.title": "กรุณาปิดประตูให้เรียบร้อย",
    "cf.s3.pending": "รอตรวจสอบประตู",
    "cf.s3.active": "MC-38 ตรวจพบว่าประตูยังเปิดอยู่",
    "cf.s3.done": "MC-38 ตรวจพบว่าประตูปิดแล้ว",
    "cf.s4.title": "ยืมสำเร็จ",
    "cf.s4.pending": "รอประตูปิดสนิท",
    "cf.s4.active": "รอประตูปิดสนิท",
    "cf.s4.done": "บันทึกการยืมเรียบร้อยแล้ว",

    // ประวัติการยืม
    "hs.title": "ประวัติการยืม",
    "hs.total": "ยืมทั้งหมด",
    "hs.tabAll": "ทั้งหมด",
    "hs.empty": "ยังไม่มีรายการ",
    "hs.tip": "คืนอุปกรณ์ที่เจ้าหน้าที่ทุกครั้งนะ",
    "hs.returnTest": "คืนอุปกรณ์ (ปุ่มทดสอบ)",
    "hs.returnConfirm": "จำลองว่าเจ้าหน้าที่รับคืนอุปกรณ์แล้ว ใช่ไหม?",

    // เมนู
    "menu.title": "เมนู",
    "menu.close": "ปิดเมนู",
    "menu.studentId": "รหัสนักศึกษา {id}",
    "menu.phone": "โทร {phone}",
    "menu.loanSmall": "กำลังยืมอยู่",
    "menu.historySub": "ดูรายการที่ยืมทั้งหมด",
    "menu.rulesSub": "1 บัญชียืมได้ 1 อุปกรณ์ · คืนก่อนยืมใหม่",
    "menu.contactSub": "เจ้าหน้าที่ผู้ดูแลตู้ ในเวลาทำการ",
    "menu.reportSub": "ประตูไม่เปิด / เซนเซอร์ผิดปกติ",
    "menu.langSub": "ไทย · English",
    "menu.logout": "ออกจากระบบ",
    "menu.logoutConfirm": "ต้องการออกจากระบบใช่ไหม?",

    // วิธีใช้งานและกติกา
    "rules.title": "วิธีใช้งานและกติกา",
    "rules.steps": "ขั้นตอนการยืม",
    "rules.step1": "เลือกอุปกรณ์",
    "rules.step2": "เลือกช่องที่ว่าง",
    "rules.step3": "กดยืม รอประตูปลดล็อก",
    "rules.step4": "หยิบของ ปิดประตู",
    "rules.important": "กติกาสำคัญ",
    "rules.r1": "1 บัญชี ยืมได้ 1 อุปกรณ์",
    "rules.r1s": "ยืมเพิ่มไม่ได้จนกว่าจะคืน",
    "rules.r2": "คืนก่อนจึงยืมใหม่ได้",
    "rules.r2s": "คืนที่เจ้าหน้าที่ แล้วจึงยืมครั้งต่อไป",
    "rules.r3": "ยืมพร้อมกันได้ แต่ห้ามยืมช่องเดียวกัน",
    "rules.r3s": "อุปกรณ์ชนิดเดียวกัน คนละช่องยืมพร้อมกันได้",
    "rules.r4": "ปิดประตูให้สนิททุกครั้ง",
    "rules.r4s": "ไฟเตือนจะกระพริบจนกว่าประตูจะปิด",

    // ติดต่อเจ้าหน้าที่
    "ct.title": "ติดต่อเจ้าหน้าที่",
    "ct.sub": "เจ้าหน้าที่ผู้ดูแลตู้",
    "ct.phone": "โทรศัพท์",
    "ct.call": "โทร",
    "ct.chat": "เปิดแชท",
    "ct.place": "จุดรับคืนอุปกรณ์",
    "ct.hours": "เวลาทำการ",
    "ct.problem": "พบปัญหากับตู้?",
    "ct.problemSub": "แจ้งประตูไม่เปิด / เซนเซอร์ผิดปกติ",
    "ct.phPhone": "[เบอร์โทรเจ้าหน้าที่]",
    "ct.phLine": "[LINE ID]",
    "ct.phPlace": "[ชื่ออาคาร / ห้อง]",
    "ct.phHours": "[วัน-เวลาทำการ]",

    // แจ้งปัญหาตู้
    "rp.title": "แจ้งปัญหาตู้",
    "rp.sub": "เจ้าหน้าที่จะตรวจสอบให้",
    "rp.side": "ตู้ด้านที่มีปัญหา",
    "rp.sideChip": "ด้าน {side}",
    "rp.slot": "ช่อง",
    "rp.slotChip": "ช่อง {n}",
    "rp.slotHint": "ช่อง {n} ใช้เก็บ{name}",
    "rp.type": "ประเภทปัญหา",
    "rp.t.door_stuck": "ประตูไม่เปิด",
    "rp.t.door_loose": "ประตูไม่ล็อก",
    "rp.t.sensor": "เซนเซอร์ผิดปกติ",
    "rp.t.mismatch": "อุปกรณ์ไม่ตรงที่แสดง",
    "rp.t.other": "อื่นๆ",
    "rp.detail": "รายละเอียดเพิ่มเติม",
    "rp.detailPh": "เล่าอาการที่พบ เช่น กดยืมแล้วประตูไม่เปิด",
    "rp.photo": "แนบรูปภาพ (ไม่บังคับ)",
    "rp.photoRemove": "ลบรูปที่แนบ",
    "rp.note": "เจ้าหน้าที่จะติดต่อกลับตามเบอร์ที่ลงทะเบียนไว้",
    "rp.submit": "ส่งเรื่องถึงเจ้าหน้าที่",
    "rp.errSide": "กรุณาเลือกตู้ด้านที่มีปัญหา",
    "rp.errSlot": "กรุณาเลือกช่อง",
    "rp.errType": "กรุณาเลือกประเภทปัญหา",
    "rp.errDetail": "กรุณาเล่าอาการที่พบ",
    "rp.errPhotoType": "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
    "rp.errPhotoSize": "รูปต้องมีขนาดไม่เกิน {n} MB",
    "rp.doneTitle": "ส่งเรื่องเรียบร้อยแล้ว",
    "rp.doneSummary": "ตู้ด้าน {side} · ช่อง {n} · {type}",

    // ภาษา
    "lang.title": "ภาษา",
    "lang.sub": "Language",
    "lang.preview": "ตัวอย่างหน้าจอ",
    "lang.previewLabel": "ไทย",
    "lang.note": "เปลี่ยนภาษาแล้วมีผลทันที",
    "lang.save": "บันทึก",
    "lang.saved": "บันทึกแล้ว",
  },

  en: {
    "app.name": "Sports Equipment Locker",
    "common.back": "Back",
    "common.backHome": "Back to home",
    "note.returnDirect":
      "Equipment must be returned directly to a staff member only",
    "note.returnRemind":
      "Reminder: please return the equipment directly to the staff member in charge during working hours",
    "status.notReturned": "Not returned",
    "status.returned": "Returned",
    "loc.short": "Locker {side} Slot {n}",
    "loc.dot": "Locker {side} · Slot {n}",
    left: "{n} left",
    soldOut: "Out of stock",

    "eq.basketball": "Basketball",
    "eq.volleyball": "Volleyball",
    "eq.futsal": "Futsal",

    "reg.title": "Register",
    "reg.subtitle": "Access the sports equipment locker",
    "reg.name": "Full name",
    "reg.namePh": "Full name",
    "reg.studentId": "Student ID",
    "reg.studentIdPh": "10-digit ID",
    "reg.phone": "Phone number",
    "reg.phonePh": "08x-xxx-xxxx",
    "reg.consent":
      "I consent to my data being used only to record loans and to contact me if equipment is not returned.",
    "reg.next": "Next",
    "reg.errName": "Please enter your full name",
    "reg.errStudentId": "Student ID must be {n} digits",
    "reg.errPhone": "Please enter a {n}-digit phone number starting with 0",
    "reg.errConsent": "Please tick the consent box to continue",

    "home.greeting": "Hi {name}, what are you playing today?",
    "home.menuAria": "Open menu",
    "home.rule":
      "1 account can borrow 1 item · return it before borrowing again",
    "home.loanSmall": "You are currently borrowing",
    "home.loanNote": "Return it to staff before borrowing again",
    "home.all": "All equipment",
    "home.pick": "Choose equipment to borrow",
    "home.totalSlots": "3 slots in total",
    "home.noEquip": "Not available right now",
    "home.returnFirst": "Return your item first",
    "home.borrow": "Borrow",
    "home.title": "Home",

    "eq.pageTitle": "Choose a slot",
    "eq.position": "Positions {ids}",
    "eq.choose": "Choose a slot to borrow",
    "eq.freeOf": "{free} of {total} slots free",
    "eq.tip":
      "Pick a free slot and tap “Borrow this slot” · 1 account can borrow 1 item",
    "slot.free": "Free · ready",
    "slot.borrowed": "Borrowed",
    "slot.waiting": "Waiting for refill",
    "slot.repair": "Under maintenance",
    "slot.side": "Locker {side}",
    "slot.number": "Slot {n}",
    "slot.borrowBtn": "Borrow slot",

    "cf.pageTitle": "Confirm borrowing",
    "cf.borrowing": "You are borrowing",
    "cf.itemName": "{name}",
    "cf.chip": "Locker {side} · Slot {n}",
    "cf.reserved": "This slot is reserved for you. No one else can borrow it.",
    "cf.confirm": "Confirm borrowing",
    "cf.working": "In progress...",
    "cf.done": "Borrowed successfully",
    "cf.s1.title": "Unlock the door",
    "cf.s1.pending": "Waiting to send the command to the locker",
    "cf.s1.active": "Sending the command to the locker",
    "cf.s1.done": "Command sent to the locker",
    "cf.s2.title": "Take the equipment",
    "cf.s2.pending": "Waiting for the IR sensor to detect pickup",
    "cf.s2.active": "Waiting for the IR sensor to detect the item taken",
    "cf.s2.done": "IR sensor detected the item was taken",
    "cf.s3.title": "Please close the door",
    "cf.s3.pending": "Waiting to check the door",
    "cf.s3.active": "MC-38 detected the door is still open",
    "cf.s3.done": "MC-38 detected the door is closed",
    "cf.s4.title": "Borrowed",
    "cf.s4.pending": "Waiting for the door to close fully",
    "cf.s4.active": "Waiting for the door to close fully",
    "cf.s4.done": "Loan recorded",

    "hs.title": "Borrow history",
    "hs.total": "Total borrowed",
    "hs.tabAll": "All",
    "hs.empty": "No records yet",
    "hs.tip": "Always return equipment to staff.",
    "hs.returnTest": "Return equipment (test button)",
    "hs.returnConfirm": "Simulate staff receiving the returned equipment?",

    "menu.title": "Menu",
    "menu.close": "Close menu",
    "menu.studentId": "Student ID {id}",
    "menu.phone": "Tel {phone}",
    "menu.loanSmall": "Currently borrowing",
    "menu.historySub": "View all your loans",
    "menu.rulesSub": "1 account = 1 item · return before borrowing again",
    "menu.contactSub": "Locker staff, during working hours",
    "menu.reportSub": "Door won’t open / sensor fault",
    "menu.langSub": "Thai · English",
    "menu.logout": "Log out",
    "menu.logoutConfirm": "Do you want to log out?",

    "rules.title": "How to use & rules",
    "rules.steps": "Borrowing steps",
    "rules.step1": "Choose equipment",
    "rules.step2": "Choose a free slot",
    "rules.step3": "Tap borrow, wait for unlock",
    "rules.step4": "Take item, close door",
    "rules.important": "Important rules",
    "rules.r1": "1 account, 1 item",
    "rules.r1s": "No more borrowing until it is returned",
    "rules.r2": "Return before borrowing again",
    "rules.r2s": "Return it to staff, then borrow again",
    "rules.r3": "Borrow at the same time, but not the same slot",
    "rules.r3s": "Same equipment type, different slots can be borrowed at once",
    "rules.r4": "Always close the door fully",
    "rules.r4s": "The warning light blinks until the door is closed",

    "ct.title": "Contact staff",
    "ct.sub": "Locker staff",
    "ct.phone": "Phone",
    "ct.call": "Call",
    "ct.chat": "Open chat",
    "ct.place": "Equipment return point",
    "ct.hours": "Working hours",
    "ct.problem": "Problem with the locker?",
    "ct.problemSub": "Report a door that won’t open / sensor fault",
    "ct.phPhone": "[Staff phone number]",
    "ct.phLine": "[LINE ID]",
    "ct.phPlace": "[Building / room]",
    "ct.phHours": "[Days / working hours]",

    "rp.title": "Report a problem",
    "rp.sub": "Staff will look into it",
    "rp.side": "Which locker side has the problem",
    "rp.sideChip": "Side {side}",
    "rp.slot": "Slot",
    "rp.slotChip": "Slot {n}",
    "rp.slotHint": "Slot {n} holds {name}",
    "rp.type": "Problem type",
    "rp.t.door_stuck": "Door won’t open",
    "rp.t.door_loose": "Door won’t lock",
    "rp.t.sensor": "Sensor fault",
    "rp.t.mismatch": "Item doesn’t match display",
    "rp.t.other": "Other",
    "rp.detail": "Additional details",
    "rp.detailPh":
      "Describe what happened, e.g. pressed borrow but the door didn’t open",
    "rp.photo": "Attach a photo (optional)",
    "rp.photoRemove": "Remove photo",
    "rp.note": "Staff will call you back on your registered number",
    "rp.submit": "Send to staff",
    "rp.errSide": "Please select the locker side",
    "rp.errSlot": "Please select a slot",
    "rp.errType": "Please select a problem type",
    "rp.errDetail": "Please describe what happened",
    "rp.errPhotoType": "Please choose an image file",
    "rp.errPhotoSize": "Photo must be no larger than {n} MB",
    "rp.doneTitle": "Report sent",
    "rp.doneSummary": "Locker {side} · Slot {n} · {type}",

    "lang.title": "Language",
    "lang.sub": "ภาษา",
    "lang.preview": "Preview",
    "lang.previewLabel": "English",
    "lang.note": "Changes take effect immediately",
    "lang.save": "Save",
    "lang.saved": "Saved",
  },
};

// ----- แปลคีย์เป็นข้อความตามภาษาที่ระบุ (params = ค่าที่แทนใน {ชื่อ}) -----
function tLang(lang, key, params) {
  let text = DICT[lang][key];
  if (text === undefined) {
    text = DICT.th[key]; // ถ้าคำแปลยังไม่มี ใช้ภาษาไทยแทน
  }
  if (text === undefined) {
    return key; // ไม่มีเลย แสดงชื่อคีย์ให้เห็นว่าลืมใส่
  }
  if (params) {
    Object.keys(params).forEach(function (name) {
      text = text.split("{" + name + "}").join(params[name]);
    });
  }
  return text;
}

// ----- แปลเป็นภาษาที่ผู้ใช้เลือกอยู่ตอนนี้ -----
function t(key, params) {
  return tLang(getLang(), key, params);
}

// ชื่ออุปกรณ์ตามภาษา เช่น equipName(findEquipment("futsal")) -> "ฟุตซอล" / "Futsal"
function equipName(equipment) {
  return t("eq." + equipment.id);
}

// ----- แปลข้อความคงที่ในหน้า HTML ทั้งหน้า -----
function applyI18n() {
  const lang = getLang();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    let text = t(el.dataset.i18n);
    if (el.tagName === "TITLE") {
      text = text + " | " + t("app.name"); // ชื่อแท็บ: "ชื่อหน้า | ชื่อเว็บ"
    }
    el.textContent = text;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

applyI18n(); // แปลทันทีที่โหลดหน้า (สคริปต์อยู่ท้าย body จึงเห็น HTML ครบแล้ว)

// กดปุ่ม "ย้อนกลับ" แล้วเบราว์เซอร์เอาหน้าเก่าที่จำไว้มาแสดง อาจเป็นภาษาเดิม ให้โหลดใหม่
window.addEventListener("pageshow", function (event) {
  if (event.persisted && document.documentElement.lang !== getLang()) {
    window.location.reload();
  }
});
