/* ==========================================================
   menu.js  —  หน้าเมนู: แสดงข้อมูลผู้ใช้ รายการที่ยืมอยู่ และปุ่มออกจากระบบ
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้
   ========================================================== */

// ----- ดึง element ในหน้าเว็บ -----
const userCardEl = document.getElementById("userCard");
const loanBoxEl = document.getElementById("loanBox");
const historyCountEl = document.getElementById("historyCount");
const logoutBtnEl = document.getElementById("logoutBtn");

// ----- สร้างการ์ดข้อมูลผู้ใช้ -----
function makeUserCard(user) {
  const firstLetter = user.name.charAt(0); // ตัวอักษรแรกของชื่อ ใส่ในวงกลม

  return (
    '<div class="avatar">' +
    firstLetter +
    "</div>" +
    '<div class="user-info">' +
    '<span class="user-name">' +
    user.name +
    "</span>" +
    '<span class="user-detail">' +
    t("menu.studentId", { id: user.studentId }) +
    "</span>" +
    '<span class="user-detail">' +
    t("menu.phone", { phone: user.phone }) +
    "</span>" +
    "</div>"
  );
}

// ----- สร้างกล่อง "กำลังยืมอยู่" -----
function makeLoanBox(loan) {
  const equipment = findEquipment(loan.equipmentId);
  const side = loan.slotId.charAt(0); // ตัวอักษรแรกของ "A1" คือ A
  const number = loan.slotId.charAt(1); // ตัวที่สองคือ 1

  return (
    '<div class="glass menu-loan">' +
    '<img src="' +
    equipment.image +
    '" alt="">' +
    '<div class="menu-loan-text">' +
    '<span class="menu-loan-small">' +
    t("menu.loanSmall") +
    "</span>" +
    "<strong>" +
    equipName(equipment) +
    " · " +
    t("loc.short", { side: side, n: number }) +
    "</strong>" +
    "</div>" +
    '<span class="chip chip-red">' +
    t("status.notReturned") +
    "</span>" +
    "</div>"
  );
}

// ----- เริ่มทำงาน -----
const user = getUser();

if (user === null) {
  // ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน
  window.location.href = "index.html";
} else {
  userCardEl.innerHTML = makeUserCard(user);

  // ถ้ากำลังยืมอยู่ ให้แสดงกล่องรายการที่ยืม (ถ้าไม่ ปล่อยว่างไว้)
  const loan = getMyLoan();
  if (loan !== null) {
    loanBoxEl.innerHTML = makeLoanBox(loan);
  }

  // ตัวเลขจำนวนรายการในประวัติ
  historyCountEl.textContent = getHistory().length;
}

// ----- ปุ่มออกจากระบบ -----
logoutBtnEl.addEventListener("click", function () {
  const ok = confirm(t("menu.logoutConfirm"));
  if (ok) {
    logout(); // อยู่ใน common.js: ลบข้อมูลผู้ใช้ แล้วกลับหน้าลงทะเบียน
  }
});
