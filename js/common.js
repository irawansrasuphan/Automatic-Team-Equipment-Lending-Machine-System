/* ==========================================================
   common.js  —  ฟังก์ชันที่ทุกหน้าใช้ร่วมกัน
   (ตอนนี้เก็บข้อมูลไว้ในเบราว์เซอร์ก่อน
    ภายหลังจะเปลี่ยนไปเก็บในฐานข้อมูลจริง)
   ========================================================== */

// ชื่อกล่องที่ใช้เก็บข้อมูลผู้ใช้ในเบราว์เซอร์
const USER_KEY = "locker_user";

// บันทึกข้อมูลผู้ใช้ (ชื่อ, รหัสนักศึกษา, เบอร์โทร)
function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// อ่านข้อมูลผู้ใช้ ถ้ายังไม่เคยลงทะเบียนจะได้ค่า null
function getUser() {
  const text = localStorage.getItem(USER_KEY);
  if (text === null) {
    return null;
  }
  return JSON.parse(text);
}

// ออกจากระบบ: ลบข้อมูลผู้ใช้ แล้วกลับไปหน้าลงทะเบียน
function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.href = "index.html";
}

// ----- ภาษาของเว็บ -----

// ชื่อกล่องที่ใช้เก็บภาษาที่เลือกในเบราว์เซอร์
const LANG_KEY = "locker_lang";

// อ่านภาษาที่เลือกไว้ ("th" หรือ "en") ถ้ายังไม่เคยเลือกจะได้ "th"
function getLang() {
  const lang = localStorage.getItem(LANG_KEY);
  if (lang === "en") {
    return "en";
  }
  return "th";
}

// บันทึกภาษาที่เลือก (รับเฉพาะ "th" หรือ "en")
function setLang(lang) {
  if (lang !== "th" && lang !== "en") {
    return;
  }
  localStorage.setItem(LANG_KEY, lang);
}
