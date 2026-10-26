/* ==========================================================
   confirm.js  —  หน้ายืนยันการยืม
   อ่านช่องจากลิงก์ เช่น confirm.html?slot=A1
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้

   ขั้นตอนทั้ง 4 ขั้นจะเดินตาม "สถานะจากตู้" เท่านั้น ไม่เดินเอง
   (ตอนนี้ดึงสถานะจาก getLockerStep() ใน data.js
    ภายหลังเปลี่ยนไปดึงจากตู้จริงที่ฟังก์ชันนั้นที่เดียว)
   ========================================================== */

// ----- ไอคอนติ๊กถูก -----
const ICON_CHECK =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

// ----- ขั้นตอนทั้ง 4 ขั้น -----
// key = ชื่อคีย์ในตารางคำแปล (i18n.js) เช่น "cf.s1" จะใช้ cf.s1.title / .pending / .active / .done
// แต่ละขั้นมีข้อความ 3 แบบ: pending = ยังไม่ถึง, active = กำลังรอ, done = เสร็จแล้ว
// mark = เครื่องหมายในวงกลมตอนที่ขั้นนั้น "กำลังรอ" (ขั้นปิดประตูใช้ "!")
const STEPS = [
  { key: "cf.s1", mark: "" },
  { key: "cf.s2", mark: "" },
  { key: "cf.s3", mark: "!" },
  { key: "cf.s4", mark: "" },
];

// ----- ดึง element ในหน้าเว็บ -----
const itemCardEl = document.getElementById("itemCard");
const confirmBtnEl = document.getElementById("confirmBtn");
const stepListEl = document.getElementById("stepList");
const backBtnEl = document.getElementById("backBtn");

// ----- แสดงความคืบหน้าของขั้นตอน -----
// doneCount = จำนวนขั้นที่เสร็จแล้ว
//   -1 = ยังไม่เริ่ม (ทุกขั้นจาง)   0 = กำลังรอขั้นที่ 1
//    3 = กำลังรอขั้นที่ 4          4 = เสร็จครบทุกขั้น
function showProgress(doneCount) {
  let html = "";

  STEPS.forEach(function (step, index) {
    let stateClass = "pending"; // ยังไม่ถึง
    let mark = "";

    if (index < doneCount) {
      stateClass = "done"; // เสร็จแล้ว
      mark = ICON_CHECK;
    } else if (index === doneCount) {
      stateClass = "active"; // กำลังรอ
      mark = step.mark;
    }

    html =
      html +
      '<li class="step ' +
      stateClass +
      '">' +
      '<div class="step-mark">' +
      mark +
      "</div>" +
      '<div class="step-text">' +
      '<span class="step-title">' +
      t(step.key + ".title") +
      "</span>" +
      '<span class="step-desc">' +
      t(step.key + "." + stateClass) +
      "</span>" +
      "</div>" +
      "</li>";
  });

  stepListEl.innerHTML = html;
}

// ----- คอยดูสถานะจากตู้ทุก 1 วินาที -----
function startWatching() {
  let lastStep = 0;

  const timer = setInterval(function () {
    const step = getLockerStep(); // สถานะล่าสุดจากตู้

    // วาดใหม่เฉพาะตอนสถานะเปลี่ยน
    if (step !== lastStep) {
      lastStep = step;
      showProgress(step);
    }

    // ครบทุกขั้นแล้ว หยุดดู และให้กลับหน้าหลักได้
    if (step >= STEPS.length) {
      clearInterval(timer);
      confirmBtnEl.textContent = t("cf.done");
      backBtnEl.classList.remove("is-disabled");
    }
  }, 1000);
}

// ----- เริ่มทำงาน -----
const user = getUser();

// อ่านชื่อช่องจากลิงก์ เช่น "A1" แล้วหาข้อมูลช่องนั้น
const slotId = new URLSearchParams(window.location.search).get("slot");
const slot = getSlots().find(function (item) {
  return item.id === slotId;
});

if (user === null) {
  // ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน
  window.location.href = "index.html";
} else if (
  slot === undefined || // ลิงก์ผิด
  slot.status !== STATUS.AVAILABLE || // ช่องนี้ไม่ว่าง
  getMyLoan() !== null // ผู้ใช้ยืมของอยู่แล้ว
) {
  window.location.href = "home.html";
} else {
  const equipment = findEquipment(slot.equipmentId);

  // การ์ด "คุณกำลังยืม"
  itemCardEl.innerHTML =
    '<img class="item-img" src="' +
    equipment.image +
    '" alt="">' +
    '<div class="item-text">' +
    '<span class="item-small">' +
    t("cf.borrowing") +
    "</span>" +
    '<h1 class="item-name">' +
    t("cf.itemName", { name: equipName(equipment) }) +
    "</h1>" +
    '<span class="chip chip-orange">' +
    t("cf.chip", { side: slot.side, n: slot.number }) +
    "</span>" +
    '<p class="item-note">' +
    t("cf.reserved") +
    "</p>" +
    "</div>";

  // ก่อนกดยืนยัน: ทุกขั้นเป็นสีจาง
  showProgress(-1);

  // กด "ยืนยันการยืม"
  confirmBtnEl.addEventListener("click", function () {
    // ปิดปุ่ม กันกดซ้ำ และปิดปุ่มกลับหน้าหลักระหว่างรอ
    confirmBtnEl.disabled = true;
    confirmBtnEl.textContent = t("cf.working");
    backBtnEl.classList.add("is-disabled");

    // เริ่มต้นสถานะจากตู้ใหม่ แล้วบันทึกว่ายืมช่องนี้ (ช่องถูกจอง)
    clearLockerStep();
    // borrowedAt = เวลาที่ยืม (ใช้แสดงในหน้าประวัติ)
    setMyLoan({
      slotId: slot.id,
      equipmentId: equipment.id,
      borrowedAt: Date.now(),
    });

    // ขั้นที่ 1 "กำลังรอ" แล้วคอยดูสถานะจากตู้ (ไม่เดินเอง)
    showProgress(0);
    startWatching();
  });
}
