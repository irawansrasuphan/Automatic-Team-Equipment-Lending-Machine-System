/* ==========================================================
   report.js  —  หน้าแจ้งปัญหาตู้: เลือกตัวเลือก ตรวจข้อมูล แล้วบันทึกเรื่อง
   ต้องโหลด common.js, i18n.js และ data.js มาก่อนไฟล์นี้
   ========================================================== */

// ----- ดึง element ในหน้าเว็บ -----
const formEl = document.getElementById("reportForm");
const doneEl = document.getElementById("reportDone");
const doneTextEl = document.getElementById("doneText");
const slotHintEl = document.getElementById("slotHint");
const detailEl = document.getElementById("detail");
const photoEl = document.getElementById("photo");
const photoTextEl = document.getElementById("photoText");
const photoRemoveEl = document.getElementById("photoRemove");

const PHOTO_MAX_MB = 5; // รูปใหญ่สุดที่รับ (MB)

// ----- ยังไม่ได้ลงทะเบียน ให้กลับไปหน้าลงทะเบียน -----
const user = getUser();
if (user === null) {
  window.location.href = "index.html";
}

// ----- ค่าที่ผู้ใช้เลือกไว้ตอนนี้ -----
const chosen = { side: "", slot: "", type: "" };

// ----- ใส่ข้อความบนปุ่มเลือกด้านและช่อง ("ด้าน A" / "Side A", "ช่อง 1" / "Slot 1") -----
// (ปุ่มประเภทปัญหาใช้ data-i18n ใน HTML จึงแปลเองอยู่แล้ว)
function showChipLabels() {
  document.querySelectorAll('[data-group="side"]').forEach(function (btn) {
    btn.textContent = t("rp.sideChip", { side: btn.dataset.value });
  });
  document.querySelectorAll('[data-group="slot"]').forEach(function (btn) {
    btn.textContent = t("rp.slotChip", { n: btn.dataset.value });
  });
}

// ----- เลือก/เปลี่ยนตัวเลือกในกลุ่ม (ด้าน / ช่อง / ประเภท) -----
function selectChip(group, value) {
  chosen[group] = value;

  const buttons = document.querySelectorAll('[data-group="' + group + '"]');
  buttons.forEach(function (btn) {
    const isOn = btn.dataset.value === value;
    btn.classList.toggle("selected", isOn);
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", isOn ? "true" : "false");
  });

  if (group === "slot") {
    updateSlotHint();
  }
}

// บอกว่าช่องที่เลือกใส่อุปกรณ์อะไร (ช่อง 1 = บาส, 2 = วอลเลย์บอล, 3 = ฟุตซอล)
function updateSlotHint() {
  const slot = SLOTS.find(function (s) {
    return String(s.number) === chosen.slot;
  });
  if (slot === undefined) {
    slotHintEl.textContent = "";
    return;
  }
  slotHintEl.textContent = t("rp.slotHint", {
    n: slot.number,
    name: equipName(findEquipment(slot.equipmentId)),
  });
}

// ----- แสดง/ล้างข้อความ error -----
function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(function (p) {
    p.textContent = "";
  });
  detailEl.classList.remove("input-error");
}

// ----- กดเลือกตัวเลือก -----
document.querySelectorAll(".chip-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    selectChip(btn.dataset.group, btn.dataset.value);
    // เลือกแล้วให้ข้อความแดงของกลุ่มนั้นหายไป
    const errorIds = {
      side: "errorSide",
      slot: "errorSlot",
      type: "errorType",
    };
    showError(errorIds[btn.dataset.group], "");
    if (btn.dataset.group === "type") {
      showError("errorDetail", "");
      detailEl.classList.remove("input-error");
    }
  });
});

// ----- เลือกรูปภาพ -----
photoEl.addEventListener("change", function () {
  showError("errorPhoto", "");
  const file = photoEl.files[0];
  if (file === undefined) {
    return;
  }

  if (file.type.indexOf("image/") !== 0) {
    resetPhoto();
    showError("errorPhoto", t("rp.errPhotoType"));
    return;
  }
  if (file.size > PHOTO_MAX_MB * 1024 * 1024) {
    resetPhoto();
    showError("errorPhoto", t("rp.errPhotoSize", { n: PHOTO_MAX_MB }));
    return;
  }

  photoTextEl.textContent = file.name;
  photoRemoveEl.hidden = false;
});

function resetPhoto() {
  photoEl.value = "";
  photoTextEl.textContent = t("rp.photo");
  photoRemoveEl.hidden = true;
}

photoRemoveEl.addEventListener("click", function () {
  resetPhoto();
  showError("errorPhoto", "");
});

detailEl.addEventListener("input", function () {
  detailEl.classList.remove("input-error");
  showError("errorDetail", "");
});

// ----- ตรวจข้อมูลก่อนส่ง (คืน true ถ้าครบ) -----
function validate() {
  clearErrors();
  let ok = true;

  if (chosen.side === "") {
    showError("errorSide", t("rp.errSide"));
    ok = false;
  }
  if (chosen.slot === "") {
    showError("errorSlot", t("rp.errSlot"));
    ok = false;
  }
  if (chosen.type === "") {
    showError("errorType", t("rp.errType"));
    ok = false;
  }
  // ถ้าเลือก "อื่นๆ" (รหัส other) ต้องเล่ารายละเอียด เพราะเจ้าหน้าที่ไม่รู้ว่าเกิดอะไรขึ้น
  if (chosen.type === "other" && detailEl.value.trim() === "") {
    showError("errorDetail", t("rp.errDetail"));
    detailEl.classList.add("input-error");
    ok = false;
  }
  return ok;
}

// ----- กดส่งเรื่อง -----
formEl.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validate()) {
    // เลื่อนไปที่ข้อความแดงอันแรก ผู้ใช้จะได้เห็นว่าขาดอะไร
    const firstError = document.querySelector(".error:not(:empty)");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const file = photoEl.files[0];
  const slotId = chosen.side + chosen.slot;

  saveReport({
    id: "R" + Date.now(),
    slotId: slotId, // เช่น "A2"
    type: chosen.type, // รหัส เช่น "door_stuck" (ไม่เปลี่ยนตามภาษา)
    detail: detailEl.value.trim(),
    // ตอนนี้เก็บเฉพาะชื่อไฟล์ (รูปจริงใหญ่เกินกว่าจะเก็บในเบราว์เซอร์)
    // ภายหลังเมื่อมีฐานข้อมูล ให้อัปโหลดรูปไปเก็บที่เซิร์ฟเวอร์
    photoName: file ? file.name : "",
    reporter: {
      name: user.name,
      studentId: user.studentId,
      phone: user.phone,
    },
    createdAt: Date.now(),
    status: "new", // new = รอเจ้าหน้าที่ตรวจสอบ
  });

  // แสดงหน้าจอส่งสำเร็จ แทนฟอร์ม
  doneTextEl.textContent = t("rp.doneSummary", {
    side: chosen.side,
    n: chosen.slot,
    type: t("rp.t." + chosen.type),
  });
  formEl.hidden = true;
  doneEl.hidden = false;
  window.scrollTo(0, 0);
});

// ----- เริ่มต้น -----
showChipLabels();
// ถ้ากำลังยืมอยู่ ปัญหามักเกิดกับช่องที่ยืม จึงเลือกให้ก่อน (เปลี่ยนเองได้)
const loan = getMyLoan();
if (loan !== null) {
  selectChip("side", loan.slotId.charAt(0));
  selectChip("slot", loan.slotId.charAt(1));
} else {
  selectChip("side", "");
  selectChip("slot", "");
}
selectChip("type", "");
