"use strict";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.querySelector(".spin-btn");
const tickSound = new Audio("./sound effects/tick.mp3");

const segments = [
  "کتاب",
  "پوچ",
  "شانس مجدد",
  "300 سکه",
  "جاییزه ویژه",
  "پوچ",
  "ساعت",
  "400 سکه",
];
const segCount = segments.length;
const segAngle = (Math.PI * 2) / segCount;

const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = 250;

let angle = 0; // زاویه فعلی
let angularVelocity = 0;
let lastTickSegment = 0;
let pinShake = 0;
let spining = false;

const drawWheel = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  ctx.moveTo(cx * 2 - 50, cy + pinShake);
  ctx.lineTo(cx * 2, cy + 25);
  ctx.lineTo(cx * 2, cy - 25);
  ctx.fill();

  ctx.fillStyle = "rgb(41, 40, 40)";
  ctx.beginPath();
  ctx.moveTo(cx * 2 - 30, cy + pinShake);
  ctx.lineTo(cx * 2, cy + 15);
  ctx.lineTo(cx * 2, cy - 15);
  ctx.fill();
};

const animation = function () {
  if (spining) {
    // کاهش تدریجی سرعت
    angularVelocity *= 0.995;
    angle += angularVelocity;

    const currentSegment = Math.floor((angle % (Math.PI * 2)) / segAngle);
    if (currentSegment !== lastTickSegment) {
      tickSound.currentTime = 0;
      tickSound.play();
      pinShake = 5;
      lastTickSegment = currentSegment;
    } else {
      pinShake = 0;
    }

    if (Math.abs(angularVelocity) < 0.0001) {
      spining = false;
      angularVelocity = 0;
      displayReward();
    }
  }

  drawWheel();
  requestAnimationFrame(animation);
};

const displayReward = function () {
  // زاویه‌ی مبنا را به ۹۰ درجه (سمت راست) تغییر دادیم
  const offset = Math.PI / 2;
  const normalizedAngle =
    (((-angle + offset + Math.PI * 2) % (Math.PI * 2)) + Math.PI * 2) %
    (Math.PI * 2);

  // محاسبه‌ی ایندکس بخش برنده
  let index = Math.floor(normalizedAngle / segAngle);

  index = index > 1 ? index - 2 : index + 6;

  // نمایش برنده
  setTimeout(() => alert(segments[index]), 200);
};

spinBtn.addEventListener("click", function () {
  if (!spining) {
    angularVelocity = Math.random() * 0.22; // سرعت اولیه
    spining = true;
  }
});

animation();
