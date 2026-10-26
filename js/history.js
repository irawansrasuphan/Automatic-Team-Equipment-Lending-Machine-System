/* ==========================================================
   history.js  —  หน้าประวัติการยืม: แสดงรายการจากข้อมูลใน data.js
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้
   ========================================================== */

// ชื่อเดือนแบบย่อ (เรียงตามเดือน ม.ค. ถึง ธ.ค.) แยกตามภาษา
const MONTHS = {
  th: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

// ----- ดึง element ในหน้าเว็บ -----
const statsEl = document.getElementById("stats");
const listEl = document.getElementById("historyList");
const tabButtons = document.querySelectorAll(".tab-btn");
const returnBtnEl = document.getElementById("returnBtn");

// แท็บที่เลือกอยู่: "all" (ทั้งหมด), "open" (ยังไม่คืน), "returned" (คืนแล้ว)
let currentTab = "all";

// ----- แปลงเวลาเป็นข้อความ ไทย: "18 ต.ค. 2569 · 14:20"  อังกฤษ: "18 Oct 2026 · 14:20" -----
function formatDate(time) {
  const lang = getLang();
  const date = new Date(time);
  const day = date.getDate();
  const month = MONTHS[lang][date.getMonth()];
  let year = date.getFullYear(); // ค.ศ.
  if (lang === "th") {
    year = year + 543; // ภาษาไทยใช้ พ.ศ.
  }

  // เติมเลข 0 ข้างหน้า เช่น 5 กลายเป็น "05"
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return day + " " + month + " " + year + " · " + hour + ":" + minute;
}

// ----- สร้างการ์ดสรุปตัวเลข -----
function makeStats(history) {
  const openCount = history.filter(function (item) {
    return item.returned === false;
  }).length;
  const returnedCount = history.length - openCount;

  return (
    '<div><span class="stat-num">' +
    history.length +
    '</span><span class="stat-label">' +
    t("hs.total") +
    "</span></div>" +
    '<div><span class="stat-num">' +
    openCount +
    '</span><span class="stat-label">' +
    t("status.notReturned") +
    "</span></div>" +
    '<div><span class="stat-num">' +
    returnedCount +
    '</span><span class="stat-label">' +
    t("status.returned") +
    "</span></div>"
  );
}

// ----- สร้างการ์ดรายการยืม 1 ใบ -----
function makeCard(item) {
  const equipment = findEquipment(item.equipmentId);
  const side = item.slotId.charAt(0); // "B3" -> B
  const number = item.slotId.charAt(1); // "B3" -> 3

  let cardClass = "glass history-card";
  let chip =
    '<span class="chip chip-white">' + t("status.returned") + "</span>";
  if (item.returned === false) {
    cardClass = cardClass + " is-open";
    chip = '<span class="chip chip-red">' + t("status.notReturned") + "</span>";
  }

  return (
    '<article class="' +
    cardClass +
    '">' +
    '<img class="history-img" src="' +
    equipment.image +
    '" alt="">' +
    '<div class="history-info">' +
    '<strong class="history-name">' +
    equipName(equipment) +
    "</strong>" +
    '<span class="history-place">' +
    t("loc.dot", { side: side, n: number }) +
    "</span>" +
    '<span class="history-date">' +
    formatDate(item.borrowedAt) +
    "</span>" +
    "</div>" +
    chip +
    "</article>"
  );
}

// ----- วาดรายการตามแท็บที่เลือก -----
function render() {
  const history = getHistory();
  statsEl.innerHTML = makeStats(history);

  // ปุ่มคืนอุปกรณ์: แสดงเมื่อเปิดสวิตช์ใน data.js และกำลังยืมอยู่
  returnBtnEl.hidden = !(SHOW_RETURN_TEST_BUTTON && getMyLoan() !== null);

  // เลือกเฉพาะรายการที่ตรงกับแท็บ
  const shown = history.filter(function (item) {
    if (currentTab === "open") {
      return item.returned === false;
    }
    if (currentTab === "returned") {
      return item.returned === true;
    }
    return true; // "all" แสดงทุกรายการ
  });

  if (shown.length === 0) {
    listEl.innerHTML = '<p class="history-empty">' + t("hs.empty") + "</p>";
    return;
  }

  // วนลูปสร้างการ์ดทีละรายการ
  let html = "";
  shown.forEach(function (item) {
    html = html + makeCard(item);
  });
  listEl.innerHTML = html;
}

// ----- เริ่มทำงาน -----
if (getUser() === null) {
  // ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน
  window.location.href = "index.html";
} else {
  render();
}

// ----- กดปุ่มคืนอุปกรณ์ (จำลองว่าเจ้าหน้าที่รับคืนแล้ว) -----
returnBtnEl.addEventListener("click", function () {
  const ok = confirm(t("hs.returnConfirm"));
  if (ok) {
    returnMyLoan(); // ย้ายรายการที่ยืมอยู่ไปเป็น "คืนแล้ว" (อยู่ใน data.js)
    render(); // วาดหน้าใหม่
  }
});

// ----- กดแท็บเพื่อกรองรายการ -----
tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentTab = button.dataset.tab; // อ่านค่าจาก data-tab ของปุ่มที่กด

    // ย้ายสีน้ำเงินไปที่แท็บที่กด
    tabButtons.forEach(function (other) {
      other.classList.remove("active");
    });
    button.classList.add("active");

    render();
  });
});
