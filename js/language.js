/* ==========================================================
   language.js  —  หน้าภาษา: กดเลือกแล้วเปลี่ยนภาษาทั้งเว็บทันที
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้

   - กดการ์ดภาษา  -> บันทึกภาษา (setLang) และแปลหน้านี้ใหม่ทันที
   - หน้าอื่นๆ จะแสดงภาษาใหม่เองตอนเปิดหน้านั้น (อ่านจาก getLang())
   - ปุ่ม "บันทึก" ใช้ยืนยันและกลับหน้าเมนู
   ========================================================== */

// ----- ดึง element ในหน้าเว็บ -----
const cardEls = document.querySelectorAll(".lang-card");
const saveBtnEl = document.getElementById("saveBtn");
const previewNameEl = document.getElementById("previewName");
const previewChipEl = document.getElementById("previewChip");

// ----- ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน -----
if (getUser() === null) {
  window.location.href = "index.html";
}

// ----- แสดงว่าเลือกภาษาไหนอยู่ -----
function showChosen() {
  const lang = getLang();
  cardEls.forEach(function (card) {
    const isOn = card.dataset.lang === lang;
    card.classList.toggle("selected", isOn);
    card.setAttribute("aria-checked", isOn ? "true" : "false");
  });
}

// ----- ตัวอย่างหน้าจอ: ใช้ข้อความภาษาที่เลือกอยู่ -----
function renderPreview() {
  previewNameEl.textContent = equipName(findEquipment("basketball"));
  previewChipEl.textContent = t("left", { n: 2 });
}

// ----- วาดหน้านี้ใหม่ตามภาษาปัจจุบัน -----
function refresh() {
  applyI18n(); // แปลข้อความคงที่ทั้งหน้า (อยู่ใน i18n.js)
  renderPreview();
  showChosen();
}

// ----- กดเลือกภาษา: เปลี่ยนทันที -----
cardEls.forEach(function (card) {
  card.addEventListener("click", function () {
    setLang(card.dataset.lang);
    refresh();
  });
});

// ----- กดบันทึก: แสดงข้อความ "บันทึกแล้ว" แล้วกลับหน้าเมนู -----
saveBtnEl.addEventListener("click", function () {
  saveBtnEl.textContent = t("lang.saved");
  saveBtnEl.disabled = true;

  setTimeout(function () {
    window.location.href = "menu.html";
  }, 600);
});

// ----- เริ่มต้น -----
refresh();
