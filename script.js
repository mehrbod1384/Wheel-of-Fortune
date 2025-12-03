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

class Wheel_Of_Fortune {
  // Properties
  segments = [
    "کتاب",
    "پوچ",
    "شانس مجدد",
    "300 سکه",
    "جاییزه ویژه",
    "پوچ",
    "ساعت",
    "400 سکه",
  ];

  segCount = this.segments.length;
  segAngle = (Math.PI * 2) / this.segCount;

  cx = canvas.width / 2;
  cy = canvas.height / 2;
  radius = 250;

  angle = 0; // زاویه فعلی
  angularVelocity = 0;
  lastTickSegment = 0;
  pinShake = 0;
  operrtunityLeft = 5;
  noOperrtunity = false;
  spining = false;

  // Consttructor
  constructor() {
    this.animation();
    spinBtn.addEventListener("click", this.play.bind(this));
  }

  // Methods
  drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.segCount; i++) {
      this.start = this.angle + i * this.segAngle;
      this.end = this.start + this.segAngle;

      // رنگ متناوب
      if (this.segments[i] === "پوچ") {
        ctx.fillStyle = "#944848ff";
      } else if (this.segments[i].includes("سکه")) {
        ctx.fillStyle = "#e58432";
      } else if (i % 4 === 0) {
        ctx.fillStyle = "#88bbf7";
      } else {
        ctx.fillStyle = "#9ccf57";
      }

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.arc(this.cx, this.cy, this.radius, this.start, this.end);
      ctx.fill();

      // متن
      ctx.save();
      ctx.translate(this.cx, this.cy);
      ctx.rotate(this.start + this.segAngle / 2);
      ctx.fillStyle = "#f7f7f7";
      ctx.alignText = "right";
      ctx.font = "3rem sans-serif";
      ctx.fillText(this.segments[i], this.radius - 130, 10);
      ctx.restore();
    }

    // نشانگر سمت راست
    ctx.fillStyle = "rgb(41, 40, 40)";
    ctx.beginPath();
    ctx.moveTo(this.cx * 2 - 50, this.cy + this.pinShake);
    ctx.lineTo(this.cx * 2, this.cy + 25);
    ctx.lineTo(this.cx * 2, this.cy - 25);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.cx * 2 - 30, this.cy + this.pinShake);
    ctx.lineTo(this.cx * 2, this.cy + 15);
    ctx.lineTo(this.cx * 2, this.cy - 15);
    ctx.fill();
  }

  animation() {
    if (this.spining) {
      // کاهش تدریجی سرعت
      this.angularVelocity *= 0.995;
      this.angle += this.angularVelocity;

      // پخش صدای تیک
      this.currentSegment = Math.floor(
        (this.angle % (Math.PI * 2)) / this.segAngle
      );
      if (this.currentSegment !== this.lastTickSegment) {
        tickSound.currentTime = 0;
        tickSound.play();
        this.pinShake = 5;
        this.lastTickSegment = this.currentSegment;
      } else {
        this.pinShake = 0;
      }

      if (Math.abs(this.angularVelocity) < 0.0001) {
        this.spining = false;
        this.angularVelocity = 0;
        this.displayReward();
      }
    }

    this.showClock();
    this.drawWheel();
    requestAnimationFrame(this.animation.bind(this));
  }

  displayReward() {
    // زاویه‌ی مبنا را به ۹۰ درجه (سمت راست) تغییر دادیم
    this.offset = Math.PI / 2;
    this.normalizedAngle =
      (((-this.angle + this.offset + Math.PI * 2) % (Math.PI * 2)) +
        Math.PI * 2) %
      (Math.PI * 2);

    // محاسبه‌ی ایندکس بخش برنده
    this.index = Math.floor(this.normalizedAngle / this.segAngle);

    this.reward = this.index > 1 ? this.index - 2 : this.index + 6;

    // نمایش برنده
    this.noOperrtunity === false
      ? setTimeout(() => alert(this.segments[this.reward]), 200)
      : alert("10 ثانیه منتظر بمانید");
  }

  showClock() {
    setInterval(() => {
      this.date = new Date();
      this.hour = `${this.date.getHours()}`.padStart(2, 0);
      this.minute = `${this.date.getMinutes()}`.padStart(2, 0);
      this.second = `${this.date.getSeconds()}`.padStart(2, 0);

      this.amOrPm = this.date.getHours() >= 12 ? "PM" : "AM";

      clock.textContent = `${this.hour} : ${this.minute} : ${this.second} ${this.amOrPm}`;
    }, 500);
  }

  oppertunityLights() {
    this.operrtunityLeft--;

    if (this.operrtunityLeft === 4) light1.style.backgroundColor = "red";
    if (this.operrtunityLeft === 3) light2.style.backgroundColor = "red";
    if (this.operrtunityLeft === 2) light3.style.backgroundColor = "red";
    if (this.operrtunityLeft === 1) light4.style.backgroundColor = "red";
    if (this.operrtunityLeft === 0) light5.style.backgroundColor = "red";
    if (this.operrtunityLeft < 0) this.noOperrtunity = true;
    if (this.noOperrtunity) this.spining = true;
  }

  play() {
    // وقتی گردونه درحال چرخشه بازیکن نتونه کلیک کنه
    if (this.spining === false) {
      this.oppertunityLights();

      this.newGame();

      if (!this.spining) {
        this.angularVelocity = Math.random() * (0.2 - 0.1) + 0.1; // سرعت اولیه
        this.spining = true;
      }
    }
  }

  newGame() {
    // بعد از 10 ثانیه بازیکن میتونه دوباره بازی کنه
    if (this.noOperrtunity) {
      setTimeout(() => {
        this.spining = false;
        this.noOperrtunity = false;
        this.operrtunityLeft = 5;

        alert("دوباره بازی کنید");

        light1.style.backgroundColor = "green";
        light2.style.backgroundColor = "green";
        light3.style.backgroundColor = "green";
        light4.style.backgroundColor = "green";
        light5.style.backgroundColor = "green";
      }, 10000);
    }
  }
}

const game = new Wheel_Of_Fortune();
