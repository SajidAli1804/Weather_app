// // script.js

// const apiKey = "3c47eaf77a7e4c1132860ec7e2d87be9"
//  // paste your OpenWeatherMap API key

// function getWeather() {
//   const city = document.getElementById("city").value.trim();
//   const result = document.getElementById("result");

//   if (city === "") {
//     result.innerHTML = "⚠️ Please enter a city name";
//     return;
//   }

//   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//   fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error("City not found");
//       }
//       return response.json();
//     })
//     .then(data => {
//       const temp = data.main.temp;
//       const humidity = data.main.humidity;
//       const condition = data.weather[0].description;
//       const wind = data.wind.speed;
//       const country = data.sys.country;

//       result.innerHTML = `
//         <h3>${city.toUpperCase()}, ${country}</h3>
//         🌡️ Temperature: ${temp} °C <br>
//         💧 Humidity: ${humidity}% <br>
//         🌥️ Condition: ${condition} <br>
//         🌬️ Wind Speed: ${wind} m/s
//       `;
//     })
//     .catch(error => {
//       result.innerHTML = "❌ City not found or API error";
//     });
// }
// script.js

/*const apiKey = "3c47eaf77a7e4c1132860ec7e2d87be9";

function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("result");

  if (city === "") {
    result.innerHTML = "<span class='text-danger'>Please enter a city name</span>";
    return;
  }

  result.innerHTML = "⏳ Loading weather data...";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      const now = new Date().toLocaleString();

      result.innerHTML = `
        <h4>${data.name}, ${data.sys.country}</h4>
        <small>${now}</small><br><br>

        <img src="${iconUrl}" alt="Weather icon">

        <p class="mt-2">
          🌡️ <b>Temperature:</b> ${data.main.temp} °C<br>
          🤗 <b>Feels Like:</b> ${data.main.feels_like} °C<br>
          🔻 <b>Min Temp:</b> ${data.main.temp_min} °C<br>
          🔺 <b>Max Temp:</b> ${data.main.temp_max} °C<br>
          💧 <b>Humidity:</b> ${data.main.humidity}%<br>
          🌬️ <b>Wind Speed:</b> ${data.wind.speed} m/s<br>
          🎚️ <b>Pressure:</b> ${data.main.pressure} hPa<br>
          🌥️ <b>Condition:</b> ${data.weather[0].description}
        </p>
      `;
    })
    .catch(error => {
      result.innerHTML = "<span class='text-danger'>City not found or API error</span>";
      console.error(error);
    });
}

*/
  /* ============================================================
   NIMBUS WEATHER APP — SCRIPT.JS
   API · Dynamic theming · Particles · Rain · Stars · Clock
   ============================================================ */

const API_KEY = "3c47eaf77a7e4c1132860ec7e2d87be9";

// ── DOM refs ──────────────────────────────────────────────────
const cityInput      = document.getElementById("cityInput");
const searchBtn      = document.getElementById("searchBtn");
const loaderWrapper  = document.getElementById("loaderWrapper");
const errorCard      = document.getElementById("errorCard");
const errorTitle     = document.getElementById("errorTitle");
const errorSub       = document.getElementById("errorSub");
const weatherResults = document.getElementById("weatherResults");
const bgGradient     = document.getElementById("bgGradient");
const rainContainer  = document.getElementById("rainContainer");
const starsContainer = document.getElementById("starsContainer");
const themeToggle    = document.getElementById("themeToggle");
const themeIcon      = document.getElementById("themeIcon");
const locationBtn    = document.getElementById("locationBtn");

// ── State ─────────────────────────────────────────────────────
let clockInterval   = null;
let particleSystem  = null;
let isDark          = true;

// ── Enter key support ─────────────────────────────────────────
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getWeather();
});

// ── Theme toggle ──────────────────────────────────────────────
themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  themeIcon.className = isDark ? "fas fa-moon" : "fas fa-sun";
});

// ── Location detection ────────────────────────────────────────
locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation Not Supported", "Your browser doesn't support location detection.");
    return;
  }
  showLoader();
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      fetchWeatherByCoords(lat, lon);
    },
    () => {
      showError("Location Denied", "Please enable location access in your browser settings.");
    }
  );
});

// ── Main fetch function ───────────────────────────────────────
function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    cityInput.focus();
    shakeInput();
    return;
  }
  showLoader();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  fetchAndRender(url);
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  fetchAndRender(url);
}

function fetchAndRender(url) {
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        if (res.status === 404) throw new Error("City not found. Check spelling and try again.");
        if (res.status === 401) throw new Error("Invalid API key. Please check your configuration.");
        throw new Error("Unable to fetch weather data. Please try again.");
      }
      return res.json();
    })
    .then((data) => renderWeather(data))
    .catch((err) => {
      const msg = err.message || "Something went wrong.";
      showError("Oops! Something went wrong", msg);
    });
}

// ── Render weather data ───────────────────────────────────────
function renderWeather(data) {
  hideAll();

  // Location
  document.getElementById("cityName").textContent    = data.name;
  document.getElementById("countryName").textContent = `${data.sys.country} · ${getWeatherConditionLabel(data.weather[0].main)}`;

  // Icon
  const iconCode = data.weather[0].icon;
  const iconUrl  = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.getElementById("weatherIconImg").src = iconUrl;

  // Temperature
  document.getElementById("tempMain").textContent   = `${Math.round(data.main.temp)}°`;
  document.getElementById("tempMax").textContent    = `${Math.round(data.main.temp_max)}°`;
  document.getElementById("tempMin").textContent    = `${Math.round(data.main.temp_min)}°`;
  document.getElementById("feelsLike").textContent  = `${Math.round(data.main.feels_like)}°`;
  document.getElementById("weatherDesc").textContent = data.weather[0].description;

  // Stats
  const humidity = data.main.humidity;
  document.getElementById("humidity").textContent   = `${humidity}%`;
  animateBar("humidityBar", humidity);

  const wind = data.wind.speed;
  document.getElementById("windSpeed").textContent  = `${wind} m/s`;
  animateBar("windBar", Math.min(wind / 30 * 100, 100));

  const pressure = data.main.pressure;
  document.getElementById("pressure").textContent   = `${pressure} hPa`;
  const pressurePct = Math.max(0, Math.min(100, ((pressure - 950) / 100) * 100));
  animateBar("pressureBar", pressurePct);

  const vis = data.visibility !== undefined ? (data.visibility / 1000).toFixed(1) + " km" : "N/A";
  document.getElementById("visibility").textContent = vis;
  const visPct = data.visibility ? Math.min(data.visibility / 10000 * 100, 100) : 0;
  animateBar("visibilityBar", visPct);

  // Sunrise / Sunset
  const tzOffset = data.timezone;
  document.getElementById("sunrise").textContent = formatUnixTime(data.sys.sunrise, tzOffset);
  document.getElementById("sunset").textContent  = formatUnixTime(data.sys.sunset,  tzOffset);

  // Clock
  startClock(tzOffset);

  // Dynamic background
  applyWeatherTheme(data.weather[0].main, data.weather[0].icon);

  // Show results
  weatherResults.classList.add("active");
}

// ── Animate stat bars ─────────────────────────────────────────
function animateBar(id, pct) {
  const bar = document.getElementById(id);
  if (!bar) return;
  bar.style.width = "0%";
  requestAnimationFrame(() => {
    setTimeout(() => { bar.style.width = `${Math.round(pct)}%`; }, 80);
  });
}

// ── Clock ─────────────────────────────────────────────────────
function startClock(tzOffset) {
  if (clockInterval) clearInterval(clockInterval);
  updateClock(tzOffset);
  clockInterval = setInterval(() => updateClock(tzOffset), 1000);
}

function updateClock(tzOffset) {
  const utc = new Date();
  const local = new Date(utc.getTime() + (utc.getTimezoneOffset() * 60 + tzOffset) * 1000);

  document.getElementById("currentTime").textContent = local.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });
  document.getElementById("currentDate").textContent = local.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}

// ── Format unix time ──────────────────────────────────────────
function formatUnixTime(unix, tzOffset) {
  const utc   = new Date(unix * 1000);
  const local = new Date(utc.getTime() + (utc.getTimezoneOffset() * 60 + tzOffset) * 1000);
  return local.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ── Weather condition label ───────────────────────────────────
function getWeatherConditionLabel(main) {
  const labels = {
    Clear: "Clear Skies",  Clouds: "Overcast",
    Rain: "Rainfall",      Drizzle: "Drizzle",
    Thunderstorm: "Storm", Snow: "Snowfall",
    Mist: "Misty",         Haze: "Hazy",
    Fog: "Foggy",          Sand: "Dusty",
    Dust: "Dusty",         Smoke: "Smoky",
    Squall: "Squall",      Tornado: "Tornado"
  };
  return labels[main] || main;
}

// ── Dynamic weather theme ─────────────────────────────────────
function applyWeatherTheme(main, iconCode) {
  // Clear gradients / effects first
  bgGradient.className = "bg-gradient";
  rainContainer.classList.remove("active");
  starsContainer.classList.remove("active");

  const isNight = iconCode && iconCode.endsWith("n");

  if (isNight) {
    bgGradient.classList.add("night");
    spawnStars();
    starsContainer.classList.add("active");
    return;
  }

  switch (main) {
    case "Clear":
      bgGradient.classList.add("sunny");
      startParticles("sun");
      break;
    case "Clouds":
      bgGradient.classList.add("cloudy");
      startParticles("cloud");
      break;
    case "Rain":
    case "Drizzle":
      bgGradient.classList.add("rainy");
      spawnRain(main === "Drizzle" ? 60 : 140);
      rainContainer.classList.add("active");
      break;
    case "Thunderstorm":
      bgGradient.classList.add("thunderstorm");
      spawnRain(200);
      rainContainer.classList.add("active");
      break;
    case "Snow":
      bgGradient.classList.add("snow");
      startParticles("snow");
      break;
    case "Mist":
    case "Haze":
    case "Fog":
    case "Smoke":
      bgGradient.classList.add("mist");
      break;
    default:
      bgGradient.classList.add("cloudy");
  }
}

// ── Rain effect ───────────────────────────────────────────────
function spawnRain(count) {
  rainContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";
    const left     = Math.random() * 110 - 5;
    const duration = 0.4 + Math.random() * 0.6;
    const delay    = Math.random() * 2;
    const height   = 12 + Math.random() * 20;
    const opacity  = 0.3 + Math.random() * 0.5;
    Object.assign(drop.style, {
      left:             `${left}%`,
      height:           `${height}px`,
      opacity:          opacity,
      animationDuration:`${duration}s`,
      animationDelay:   `${delay}s`
    });
    rainContainer.appendChild(drop);
  }
}

// ── Stars effect ──────────────────────────────────────────────
function spawnStars() {
  starsContainer.innerHTML = "";
  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size     = 1 + Math.random() * 2.5;
    const duration = 2 + Math.random() * 3;
    const delay    = Math.random() * 4;
    Object.assign(star.style, {
      width:            `${size}px`,
      height:           `${size}px`,
      top:              `${Math.random() * 80}%`,
      left:             `${Math.random() * 100}%`,
      animationDuration:`${duration}s`,
      animationDelay:   `${delay}s`
    });
    starsContainer.appendChild(star);
  }
}

// ── Particle canvas (sun shimmer / snow / clouds) ─────────────
function startParticles(type) {
  const canvas  = document.getElementById("particleCanvas");
  const ctx     = canvas.getContext("2d");
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function Particle() {
    this.reset = function () {
      this.x  = Math.random() * canvas.width;
      this.y  = type === "snow" ? -10 : Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = type === "snow" ? 0.4 + Math.random() * 0.8 : (Math.random() - 0.5) * 0.2;
      this.r  = type === "snow" ? 2 + Math.random() * 3 : 1.5 + Math.random() * 3;
      this.a  = 0.1 + Math.random() * 0.4;
      if (type === "sun")   { this.color = `rgba(255,220,100,${this.a})`; }
      else if (type === "cloud"){ this.color = `rgba(255,255,255,${this.a * 0.5})`; }
      else                  { this.color = `rgba(255,255,255,${this.a})`; }
    };
    this.reset();
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  if (particleSystem) cancelAnimationFrame(particleSystem);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y > canvas.height + 10 || p.x < -10 || p.x > canvas.width + 10) {
        p.reset();
        if (type === "snow") p.y = -10;
      }
    });
    animId = requestAnimationFrame(draw);
    particleSystem = animId;
  }
  draw();
}

// ── UI helpers ────────────────────────────────────────────────
function showLoader() {
  hideAll();
  loaderWrapper.classList.add("active");
}

function showError(title, sub) {
  hideAll();
  errorTitle.textContent = title;
  errorSub.textContent   = sub;
  errorCard.classList.add("active");
}

function hideAll() {
  loaderWrapper.classList.remove("active");
  errorCard.classList.remove("active");
  weatherResults.classList.remove("active");
}

function shakeInput() {
  cityInput.style.animation = "none";
  cityInput.offsetHeight; // reflow
  cityInput.style.animation = "shakeIn 0.4s ease";
  setTimeout(() => { cityInput.style.animation = ""; }, 500);
}

// ── Input focus ring ──────────────────────────────────────────
cityInput.addEventListener("focus", () => {
  cityInput.parentElement.parentElement.style.borderColor = "rgba(96,200,245,0.5)";
});
cityInput.addEventListener("blur", () => {
  cityInput.parentElement.parentElement.style.borderColor = "";
});
