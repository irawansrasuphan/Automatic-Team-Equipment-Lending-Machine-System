/* ==========================================================
   home.js  —  หน้าหลัก: แสดงการ์ดอุปกรณ์จากข้อมูลใน data.js
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้
   ========================================================== */

// ----- ไอคอน (ข้อความ SVG เก็บไว้ในตัวแปร จะได้เรียกใช้ซ้ำได้) -----
const ICON_INFO =
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
  '<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8v.5"/></svg>';

const ICON_LOCK =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
  '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

const ICON_ARROW =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M9 6l6 6-6 6"/></svg>';

// ----- ดึง element ในหน้าเว็บ -----
const greetingEl = document.getElementById("greeting");
const bannerEl = document.getElementById("banner");
const sectionTitleEl = document.getElementById("sectionTitle");
const listEl = document.getElementById("equipmentList");

// ----- สร้างแถบด้านบน -----
// ถ้ายังไม่ได้ยืมอะไร (loan เป็น null) แสดงแถบกฎ  ถ้ายืมอยู่ แสดงกล่องรายการที่ยืม
function makeBanner(loan) {
  if (loan === null) {
    return (
      '<div class="glass rule-banner">' +
      ICON_INFO +
      "<span>" +
      t("home.rule") +
      "</span></div>"
    );
  }

  const equipment = findEquipment(loan.equipmentId);
  const side = loan.slotId.charAt(0); // ตัวอักษรแรกของ "A1" คือ A
  const number = loan.slotId.charAt(1); // ตัวที่สองคือ 1

  return (
    '<div class="glass loan-banner">' +
    '<img src="' +
    equipment.image +
    '" alt="">' +
    '<div class="loan-text">' +
    '<span class="loan-small">' +
    t("home.loanSmall") +
    "</span>" +
    "<strong>" +
    equipName(equipment) +
    " · " +
    t("loc.short", { side: side, n: number }) +
    "</strong>" +
    '<span class="loan-small">' +
    t("home.loanNote") +
    "</span>" +
    "</div>" +
    '<span class="chip chip-red">' +
    t("status.notReturned") +
    "</span>" +
    "</div>"
  );
}

// ----- สร้างการ์ดอุปกรณ์ 1 ใบ -----
// hasLoan = true ถ้าผู้ใช้กำลังยืมของอยู่ (จะยืมเพิ่มไม่ได้)
function makeCard(equipment, hasLoan) {
  const remaining = countAvailable(equipment.id);
  const soldOut = remaining === 0;

  // ป้ายจำนวนที่เหลือ
  let chip =
    '<span class="chip chip-white">' + t("left", { n: remaining }) + "</span>";
  if (soldOut) {
    chip = '<span class="chip chip-red">' + t("soldOut") + "</span>";
  }

  // ส่วนปุ่มด้านล่างการ์ด มี 3 แบบ
  let action = "";
  if (soldOut) {
    action =
      '<div class="btn-disabled btn-soldout">' + t("home.noEquip") + "</div>";
  } else if (hasLoan) {
    action =
      '<div class="btn-disabled">' +
      ICON_LOCK +
      t("home.returnFirst") +
      "</div>";
  } else {
    action =
      '<a class="btn-main btn-borrow" href="equipment.html?type=' +
      equipment.id +
      '">' +
      t("home.borrow") +
      ICON_ARROW +
      "</a>";
  }

  let cardClass = "glass equip-card";
  if (soldOut) {
    cardClass = cardClass + " sold-out";
  }

  return (
    '<article class="' +
    cardClass +
    '">' +
    '<div class="equip-top">' +
    '<img class="equip-img" src="' +
    equipment.image +
    '" alt="">' +
    "<div>" +
    '<h3 class="equip-name">' +
    equipName(equipment) +
    "</h3>" +
    '<div class="equip-meta">' +
    chip +
    '<span class="equip-total">' +
    t("home.totalSlots") +
    "</span></div>" +
    "</div>" +
    "</div>" +
    action +
    "</article>"
  );
}

// ----- วาดหน้าจอทั้งหมดใหม่ -----
function render() {
  const loan = getMyLoan();
  const hasLoan = loan !== null;

  bannerEl.innerHTML = makeBanner(loan);

  if (hasLoan) {
    sectionTitleEl.textContent = t("home.all");
  } else {
    sectionTitleEl.textContent = t("home.pick");
  }

  // วนลูปสร้างการ์ดทีละชนิดอุปกรณ์
  let html = "";
  EQUIPMENT.forEach(function (equipment) {
    html = html + makeCard(equipment, hasLoan);
  });
  listEl.innerHTML = html;
}

// ----- เริ่มทำงาน -----
const user = getUser();

if (user === null) {
  // ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน
  window.location.href = "index.html";
} else {
  // แสดงเฉพาะชื่อต้น (คำแรกของชื่อ-นามสกุล)
  const firstName = user.name.split(" ")[0];
  greetingEl.textContent = t("home.greeting", { name: firstName });
  render();
}

// ----- ปุ่มต่างๆ -----
document.getElementById("menuBtn").addEventListener("click", function () {
  window.location.href = "menu.html";
});

document.getElementById("historyBtn").addEventListener("click", function () {
  window.location.href = "history.html";
});
