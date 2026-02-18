const canvas = document.getElementById("rainfall");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const raindrops = [];
const splashes = [];

// track mouse position
const mouse = { x: -100, y: -100 };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

function createRaindrop() {
  const x = Math.random() * canvas.width;
  const y = -5;
  const speed = Math.random() * 5 + 2;
  const length = Math.random() * 20 + 10;

  raindrops.push({ x, y, speed, length });
}

function updateRaindrop() {
  for (let i = 0; i < raindrops.length; i++) {
    const raindrop = raindrops[i];

    raindrop.y += raindrop.speed;

    // check collision with mouse (treat mouse as a small circle)
    const hitRadius = 10;
    if (
      raindrop.y + raindrop.length >= mouse.y - hitRadius &&
      raindrop.y <= mouse.y + hitRadius &&
      Math.abs(raindrop.x - mouse.x) < hitRadius
    ) {
      // create splash at the point of impact
      createSplash(raindrop.x, raindrop.y + raindrop.length);
      raindrops.splice(i, 1);
      i--;
      continue;
    }

    if (raindrop.y > canvas.height) {
      raindrops.splice(i, 1);
      i--;
    }
  }
}

function drawRaindrops() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw raindrops
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;

  for (let i = 0; i < raindrops.length; i++) {
    const raindrop = raindrops[i];

    ctx.beginPath();
    ctx.moveTo(raindrop.x, raindrop.y);
    ctx.lineTo(raindrop.x, raindrop.y + raindrop.length);
    ctx.stroke();
  }

  // draw splashes
  drawSplashes();
}

function animate() {
  createRaindrop();
  updateRaindrop();
  updateSplashes();
  drawRaindrops();

  requestAnimationFrame(animate);
}

// splash helpers
function createSplash(x, y) {
  const count = 8;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = Math.random() * 3 + 2;
    splashes.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30,
    });
  }
}

function updateSplashes() {
  for (let i = 0; i < splashes.length; i++) {
    const s = splashes[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.1; // gravity
    s.life--;
    if (s.life <= 0) {
      splashes.splice(i, 1);
      i--;
    }
  }
}

function drawSplashes() {
  ctx.fillStyle = "white";
  for (const s of splashes) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

animate();
