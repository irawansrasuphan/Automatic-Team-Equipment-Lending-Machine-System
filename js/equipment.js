/* ==========================================================
   equipment.js  —  หน้าเลือกช่อง: แสดงช่องของอุปกรณ์ 1 ชนิด
   อ่านชนิดอุปกรณ์จากลิงก์ เช่น equipment.html?type=basketball
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้
   ========================================================== */

// ----- ไอคอน (ข้อความ SVG เก็บไว้ในตัวแปร) -----
const ICON_LOCK =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
  '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

const ICON_WRENCH =
  '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/></svg>';

// ----- ดึง element ในหน้าเว็บ -----
const equipNameEl = document.getElementById("equipName");
const equipPositionEl = document.getElementById("equipPosition");
const summaryEl = document.getElementById("summary");
const slotListEl = document.getElementById("slotList");

// ----- สร้างการ์ดสรุปด้านบน -----
function makeSummary(equipment, slots) {
  // นับช่องที่ว่าง
  const free = slots.filter(function (slot) {
    return slot.status === STATUS.AVAILABLE;
  }).length;

  // ป้ายจำนวนที่เหลือ (ถ้าไม่เหลือเลยเป็น "หมด")
  let chip =
    '<span class="chip chip-white">' + t("left", { n: free }) + "</span>";
  if (free === 0) {
    chip = '<span class="chip chip-red">' + t("soldOut") + "</span>";
  }

  return (
    '<img class="summary-img" src="' +
    equipment.image +
    '" alt="">' +
    '<div class="summary-text">' +
    '<span class="summary-title">' +
    t("eq.choose") +
    "</span>" +
    chip +
    '<span class="summary-free">' +
    t("eq.freeOf", { free: free, total: slots.length }) +
    "</span>" +
    "</div>"
  );
}

// ----- สร้างการ์ดช่อง 1 ใบ -----
// hasLoan = true ถ้าผู้ใช้กำลังยืมของอยู่ (จะยืมเพิ่มไม่ได้)
function makeSlotCard(slot, equipment, hasLoan) {
  let cardClass = "glass slot-card";
  let picture = '<img class="slot-img" src="' + equipment.image + '" alt="">';
  let chip = "";
  let action = "";

  if (slot.status === STATUS.AVAILABLE) {
    // ว่าง
    chip = '<span class="chip chip-white">' + t("slot.free") + "</span>";
    if (hasLoan) {
      action =
        '<div class="slot-locked">' +
        ICON_LOCK +
        t("home.returnFirst") +
        "</div>";
    } else {
      action =
        '<a class="btn-main btn-slot" href="confirm.html?slot=' +
        slot.id +
        '">' +
        t("slot.borrowBtn") +
        "</a>";
    }
  } else if (slot.status === STATUS.BORROWED) {
    // ถูกยืมอยู่
    cardClass = cardClass + " slot-borrowed";
    chip = '<span class="chip chip-gray">' + t("slot.borrowed") + "</span>";
    action = '<span class="slot-lock">' + ICON_LOCK + "</span>";
  } else if (slot.status === STATUS.EMPTY) {
    // รอเจ้าหน้าที่เติม
    cardClass = cardClass + " slot-empty";
    picture = '<div class="slot-circle"></div>';
    chip = '<span class="chip chip-gray">' + t("slot.waiting") + "</span>";
  } else {
    // ปิดซ่อมบำรุง
    cardClass = cardClass + " slot-repair";
    picture = '<div class="slot-icon">' + ICON_WRENCH + "</div>";
    chip = '<span class="chip chip-red">' + t("slot.repair") + "</span>";
  }

  return (
    '<article class="' +
    cardClass +
    '">' +
    picture +
    '<div class="slot-info">' +
    '<span class="slot-side">' +
    t("slot.side", { side: slot.side }) +
    "</span>" +
    '<strong class="slot-number">' +
    t("slot.number", { n: slot.number }) +
    "</strong>" +
    chip +
    "</div>" +
    action +
    "</article>"
  );
}

// ----- เริ่มทำงาน -----
const user = getUser();

// อ่านค่า type จากลิงก์ เช่น "basketball" (ถ้าไม่มี หรือพิมพ์ผิด จะหาอุปกรณ์ไม่เจอ)
const type = new URLSearchParams(window.location.search).get("type");
const equipment = findEquipment(type);

if (user === null) {
  // ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน
  window.location.href = "index.html";
} else if (equipment === undefined) {
  // ลิงก์ไม่ถูกต้อง ให้กลับหน้าหลัก
  window.location.href = "home.html";
} else {
  // เอาเฉพาะช่องของอุปกรณ์ชนิดนี้ (ได้ 3 ช่อง)
  const slots = getSlots().filter(function (slot) {
    return slot.equipmentId === equipment.id;
  });
  const hasLoan = getMyLoan() !== null;

  // ส่วนหัว: ชื่ออุปกรณ์ และ "ตำแหน่ง A1 · B1 · C1"
  const ids = slots.map(function (slot) {
    return slot.id;
  });
  equipNameEl.textContent = equipName(equipment);
  equipPositionEl.textContent = t("eq.position", { ids: ids.join(" · ") });
  document.title = equipName(equipment) + " | " + t("app.name");

  // การ์ดสรุป
  summaryEl.innerHTML = makeSummary(equipment, slots);

  // วนลูปสร้างการ์ดช่องทีละใบ
  let html = "";
  slots.forEach(function (slot) {
    html = html + makeSlotCard(slot, equipment, hasLoan);
  });
  slotListEl.innerHTML = html;
}
