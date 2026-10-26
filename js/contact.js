/* ==========================================================
   contact.js  —  หน้าติดต่อเจ้าหน้าที่: ใส่ข้อมูลติดต่อจาก CONTACT (data.js)
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้
   ========================================================== */

// ----- ดึง element ในหน้าเว็บ -----
const phoneTextEl = document.getElementById("phoneText");
const lineTextEl = document.getElementById("lineText");
const placeTextEl = document.getElementById("placeText");
const hoursTextEl = document.getElementById("hoursText");
const callBtnEl = document.getElementById("callBtn");
const chatBtnEl = document.getElementById("chatBtn");

// ----- ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน -----
if (getUser() === null) {
  window.location.href = "index.html";
}

// ----- ใส่ข้อความ -----
// ถ้ายังไม่ได้กรอกใน data.js ให้แสดงข้อความแทนที่ตามภาษา (คีย์ ct.ph... ใน i18n.js)
function showValue(element, value, placeholderKey) {
  if (isPlaceholder(value)) {
    element.textContent = t(placeholderKey);
  } else {
    element.textContent = value;
  }
}

showValue(phoneTextEl, CONTACT.phone, "ct.phPhone");
showValue(lineTextEl, CONTACT.lineId, "ct.phLine");
showValue(placeTextEl, CONTACT.place, "ct.phPlace");
showValue(hoursTextEl, CONTACT.hours, "ct.phHours");

// ----- ปุ่มโทร: เปิดแอปโทรศัพท์ -----
if (isPlaceholder(CONTACT.phone)) {
  callBtnEl.setAttribute("aria-disabled", "true");
} else {
  // เอาเฉพาะตัวเลขและเครื่องหมาย + (ตัดขีดและช่องว่างออก)
  const number = CONTACT.phone.replace(/[^0-9+]/g, "");
  callBtnEl.href = "tel:" + number;
}

// ----- ปุ่มเปิดแชท: เปิด LINE -----
if (isPlaceholder(CONTACT.lineId)) {
  chatBtnEl.setAttribute("aria-disabled", "true");
} else {
  // ID ที่ขึ้นต้นด้วย @ (LINE Official) ต้องใช้ลิงก์รูปแบบ /R/ti/p/@ ; ID ทั่วไปใช้ ~
  const id = CONTACT.lineId;
  if (id.charAt(0) === "@") {
    chatBtnEl.href = "https://line.me/R/ti/p/" + encodeURIComponent(id);
  } else {
    chatBtnEl.href = "https://line.me/R/ti/p/~" + encodeURIComponent(id);
  }
  chatBtnEl.target = "_blank";
  chatBtnEl.rel = "noopener";
}
