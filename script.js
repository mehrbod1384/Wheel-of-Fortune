"use strict";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.querySelector(".spin-btn");

const segments = [
  "کتاب",
  "پوچ",
  "شانس مجدد",
  "300 سکه",
  "جاییزه ویزه",
  "پوچ",
  "سایت",
  "400 سکه",
];
const segCount = segments.length;

const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = 250;

let angle = 0; // زاویه فعلی
let angularVelocity = 0;
let spining = false;

const drawWheel = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const segAngle = (Math.PI * 2) / segCount;

  for (let i = 0; i < segCount; i++) {
    const start = angle + i * segAngle;
    const end = start + segAngle;

    // رنگ متناوب
    if (segments[i] === "پوچ") {
      ctx.fillStyle = "#944848ff";
    } else if (segments[i].includes("سکه")) {
      ctx.fillStyle = "#e58432";
    } else if (i % 4 === 0) {
      ctx.fillStyle = "#88bbf7";
    } else {
      ctx.fillStyle = "#9ccf57";
    }

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, end);
    ctx.fill();

    // متن
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + segAngle / 2);
    ctx.fillStyle = "#f7f7f7";
    ctx.alignText = "right";
    ctx.font = "3rem sans-serif";
    ctx.fillText(segments[i], radius - 130, 10);
    ctx.restore();
  }

  // نشانگر سمت راست
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(cx * 2 - 50, cy);
  ctx.lineTo(cx * 2, cy + 25);
  ctx.lineTo(cx * 2, cy - 25);
  ctx.fill();
};

const animation = function () {
  if (spining) {
    // کاهش تدریجی سرعت
    angularVelocity *= 0.995;
    angle += angularVelocity;

    if (Math.abs(angularVelocity) < 0.0001) {
      spining = false;
      angularVelocity = 0;
      reward();
    }
  }

  drawWheel();
  requestAnimationFrame(animation);
};

const reward = function () {
  const segAngle = (Math.PI * 2) / segCount;

  // زاویه‌ی مبنا را به ۹۰ درجه (سمت راست) تغییر دادیم
  const offset = Math.PI / 2;
  const normalizedAngle =
    (((-angle + offset + Math.PI * 2) % (Math.PI * 2)) + Math.PI * 2) %
    (Math.PI * 2);

  // محاسبه‌ی ایندکس بخش برنده
  let index = Math.floor(normalizedAngle / segAngle);

  index =
    index > 2
      ? ((segCount + index) % segCount) - 2
      : (segCount + (index + 6)) % segCount;

  // نمایش برنده
  setTimeout(() => alert(segments[index]), 200);
};

spinBtn.addEventListener("click", function () {
  if (!spining) {
    angularVelocity = Math.random() * 0.4; // سرعت اولیه
    spining = true;
  }
});

animation();
