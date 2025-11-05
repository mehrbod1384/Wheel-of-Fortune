"use strict";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.querySelector(".spin-btn");
const clock = document.querySelector(".clock");
const light1 = document.querySelector(".light-1");
const light2 = document.querySelector(".light-2");
const light3 = document.querySelector(".light-3");
const light4 = document.querySelector(".light-4");
const light5 = document.querySelector(".light-5");
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
let operrtunityLeft = 5;
let noOperrtunity = false;
let spining = false;

// clock
let date = new Date();
let hour = `${date.getHours()}`.padStart(2, 0);
let minute = `${date.getMinutes()}`.padStart(2, 0);
let second = `${date.getSeconds()}`.padStart(2, 0);
clock.textContent = `${hour}:${minute}:${second}`;

////////////////////////////////
// functions
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
  ctx.fillStyle = "rgb(41, 40, 40)";
  ctx.beginPath();
  ctx.moveTo(cx * 2 - 50, cy + pinShake);
  ctx.lineTo(cx * 2, cy + 25);
  ctx.lineTo(cx * 2, cy - 25);
  ctx.fill();

  ctx.fillStyle = "black";
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

    // پخش صدای تیک
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

  showClock();
  drawWheel();
  requestAnimationFrame(animation);
};

const showClock = function () {
  setInterval(() => {
    date = new Date();
    hour = `${date.getHours()}`.padStart(2, 0);
    minute = `${date.getMinutes()}`.padStart(2, 0);
    second = `${date.getSeconds()}`.padStart(2, 0);

    const amOrPm = date.getHours() >= 12 ? "PM" : "AM";

    clock.textContent = `${hour} : ${minute} : ${second} ${amOrPm}`;
  });
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
  noOperrtunity === false
    ? setTimeout(() => alert(segments[index]), 200)
    : alert("10 ثانیه منتظر بمانید");
};

const oppertunityLights = function () {
  operrtunityLeft--;

  if (operrtunityLeft === 4) light1.style.backgroundColor = "red";
  if (operrtunityLeft === 3) light2.style.backgroundColor = "red";
  if (operrtunityLeft === 2) light3.style.backgroundColor = "red";
  if (operrtunityLeft === 1) light4.style.backgroundColor = "red";
  if (operrtunityLeft === 0) light5.style.backgroundColor = "red";
  if (operrtunityLeft < 0) noOperrtunity = true;
  if (noOperrtunity) spining = true;
};

const newGame = function () {
  if (spining) {
    setTimeout(() => {
      spining = false;
      noOperrtunity = false;
      operrtunityLeft = 5;

      alert("دوباره بازی کنید");

      light1.style.backgroundColor = "green";
      light2.style.backgroundColor = "green";
      light3.style.backgroundColor = "green";
      light4.style.backgroundColor = "green";
      light5.style.backgroundColor = "green";
    }, 10000);
  }
};

spinBtn.addEventListener("click", function () {
  if (spining === false) {
    oppertunityLights();

    newGame();

    if (!spining) {
      angularVelocity = Math.random() * (0.2 - 0.1) + 0.1; // سرعت اولیه
      spining = true;
    }
  }
});

animation();
