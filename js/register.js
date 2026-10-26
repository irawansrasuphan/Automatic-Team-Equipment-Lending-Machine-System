/* ==========================================================
   register.js  —  ตรวจฟอร์มหน้าลงทะเบียน
   ========================================================== */

// ----- ค่าที่ปรับได้ -----
const STUDENT_ID_LENGTH = 10; // รหัสนักศึกษากี่หลัก
const PHONE_LENGTH = 10; // เบอร์โทรกี่หลัก

// ----- ดึง element ในหน้าเว็บมาเก็บไว้ในตัวแปร -----
const form = document.getElementById("registerForm");
const nameInput = document.getElementById("fullName");
const studentIdInput = document.getElementById("studentId");
const phoneInput = document.getElementById("phone");
const consentInput = document.getElementById("consent");

// ----- ฟังก์ชันแสดง / ล้างข้อความแจ้งเตือน -----
function showError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.classList.add("input-error");
}

function clearErrors() {
  const errors = document.querySelectorAll(".error");
  errors.forEach(function (p) {
    p.textContent = "";
  });
  const inputs = document.querySelectorAll(".input-error");
  inputs.forEach(function (input) {
    input.classList.remove("input-error");
  });
}

// ----- เมื่อกดปุ่ม "ถัดไป" -----
form.addEventListener("submit", function (event) {
  event.preventDefault(); // ไม่ให้หน้าเว็บรีโหลดเอง
  clearErrors();

  let firstWrong = null; // เก็บช่องแรกที่กรอกผิด ไว้เลื่อนไปโฟกัส

  // 1) ตรวจชื่อ-นามสกุล
  const name = nameInput.value.trim();
  if (name.length < 2) {
    showError(nameInput, "errorName", t("reg.errName"));
    firstWrong = firstWrong || nameInput;
  }

  // 2) ตรวจรหัสนักศึกษา: ต้องเป็นตัวเลขล้วน และครบ 10 หลัก
  const studentId = studentIdInput.value.trim();
  const onlyDigits = /^[0-9]+$/.test(studentId);
  if (!onlyDigits || studentId.length !== STUDENT_ID_LENGTH) {
    showError(
      studentIdInput,
      "errorStudentId",
      t("reg.errStudentId", { n: STUDENT_ID_LENGTH }),
    );
    firstWrong = firstWrong || studentIdInput;
  }

  // 3) ตรวจเบอร์โทร: ตัดขีดและช่องว่างออกก่อน แล้วเช็คว่าเป็นตัวเลข 10 หลักขึ้นต้นด้วย 0
  const phone = phoneInput.value.replace(/[-\s]/g, "");
  const phoneOk =
    /^[0-9]+$/.test(phone) &&
    phone.length === PHONE_LENGTH &&
    phone.startsWith("0");
  if (!phoneOk) {
    showError(phoneInput, "errorPhone", t("reg.errPhone", { n: PHONE_LENGTH }));
    firstWrong = firstWrong || phoneInput;
  }

  // 4) ตรวจว่าติ๊กยินยอมแล้ว
  if (!consentInput.checked) {
    document.getElementById("errorConsent").textContent = t("reg.errConsent");
    firstWrong = firstWrong || consentInput;
  }

  // ถ้ามีช่องที่ผิด: หยุด แล้วเลื่อนไปที่ช่องนั้น
  if (firstWrong !== null) {
    firstWrong.focus();
    return;
  }

  // ผ่านทุกข้อ: บันทึกข้อมูล แล้วไปหน้าหลัก
  saveUser({
    name: name,
    studentId: studentId,
    phone: phone,
    consentAt: new Date().toISOString(), // เวลาที่กดยินยอม
  });
  window.location.href = "home.html";
});

// ----- ปุ่มสลับภาษา TH / EN (มุมขวาบน) -----
const langSwitchEl = document.getElementById("langSwitch");
const langOptEls = document.querySelectorAll(".lang-opt");

// แสดงว่าเลือกภาษาไหนอยู่: ตัวอักษรขาว + เลื่อนแท็บสีน้ำเงินไปฝั่งนั้น
function showLangSwitch() {
  const lang = getLang();
  langSwitchEl.classList.toggle("is-en", lang === "en");
  langOptEls.forEach(function (btn) {
    const isOn = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", isOn);
    btn.setAttribute("aria-checked", isOn ? "true" : "false");
  });
}

// กดเลือกภาษา: บันทึก แปลทั้งหน้าใหม่ และล้างข้อความแจ้งเตือนเดิม
langOptEls.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setLang(btn.dataset.lang);
    applyI18n(); // อยู่ใน i18n.js
    clearErrors();
    showLangSwitch();
  });
});

showLangSwitch();
