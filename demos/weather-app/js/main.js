// ------- نگاشت کد آب‌وهوا (WMO) به ایموجی و توضیح فارسی -------
const weatherCodeMap = {
  0: { icon: '☀️', desc: 'آفتابی' },
  1: { icon: '🌤️', desc: 'کمی ابری' },
  2: { icon: '⛅', desc: 'نیمه‌ابری' },
  3: { icon: '☁️', desc: 'ابری' },
  45: { icon: '🌫️', desc: 'مه‌آلود' },
  48: { icon: '🌫️', desc: 'مه یخ‌زده' },
  51: { icon: '🌦️', desc: 'نم‌نم باران' },
  53: { icon: '🌦️', desc: 'نم‌نم باران' },
  55: { icon: '🌧️', desc: 'باران ریز' },
  61: { icon: '🌧️', desc: 'بارانی' },
  63: { icon: '🌧️', desc: 'باران متوسط' },
  65: { icon: '🌧️', desc: 'باران شدید' },
  71: { icon: '🌨️', desc: 'برفی' },
  73: { icon: '🌨️', desc: 'برف متوسط' },
  75: { icon: '❄️', desc: 'برف شدید' },
  80: { icon: '🌦️', desc: 'رگبار' },
  81: { icon: '🌧️', desc: 'رگبار شدید' },
  82: { icon: '⛈️', desc: 'رگبار خیلی شدید' },
  95: { icon: '⛈️', desc: 'رعدوبرق' },
  96: { icon: '⛈️', desc: 'رعدوبرق با تگرگ' },
  99: { icon: '⛈️', desc: 'طوفان شدید' },
};

function getWeatherInfo(code) {
  return weatherCodeMap[code] || { icon: '🌡️', desc: 'نامشخص' };
}

const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

// ------- عناصر DOM -------
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  resultEl.classList.add('hidden');
  statusEl.classList.remove('error');
  statusEl.textContent = 'در حال جستجو...';

  try {
    // مرحله ۱: پیدا کردن مختصات جغرافیایی شهر
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fa&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      statusEl.textContent = 'شهری با این اسم پیدا نشد. اسم دیگه‌ای امتحان کن.';
      statusEl.classList.add('error');
      return;
    }

    const place = geoData.results[0];
    const { latitude, longitude, name, country } = place;

    // مرحله ۲: گرفتن اطلاعات آب‌وهوا
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true&hourly=relative_humidity_2m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    renderWeather(weatherData, `${name}${country ? '، ' + country : ''}`);
    statusEl.textContent = '';
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'خطا در دریافت اطلاعات. دوباره امتحان کن.';
    statusEl.classList.add('error');
  }
});

function renderWeather(data, cityLabel) {
  const current = data.current_weather;
  const info = getWeatherInfo(current.weathercode);

  document.getElementById('cityName').textContent = cityLabel;
  document.getElementById('currentTemp').textContent = Math.round(current.temperature);
  document.getElementById('currentIcon').textContent = info.icon;
  document.getElementById('currentDesc').textContent = info.desc;
  document.getElementById('wind').textContent = Math.round(current.windspeed);

  // نزدیک‌ترین مقدار رطوبت به ساعت فعلی
  const nowHourIndex = data.hourly.time.findIndex((t) => t === current.time);
  const humidity = nowHourIndex >= 0 ? data.hourly.relative_humidity_2m[nowHourIndex] : '--';
  document.getElementById('humidity').textContent = humidity;

  // پیش‌بینی ۵ روز آینده
  const forecastEl = document.getElementById('forecast');
  forecastEl.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const date = new Date(data.daily.time[i]);
    const dayName = dayNames[date.getDay()];
    const dayInfo = getWeatherInfo(data.daily.weathercode[i]);
    const max = Math.round(data.daily.temperature_2m_max[i]);
    const min = Math.round(data.daily.temperature_2m_min[i]);

    const dayCard = document.createElement('div');dayCard.className = 'forecast-day';
    dayCard.innerHTML = `
      <div class="fd-name">${dayName}</div>
      <div class="fd-icon">${dayInfo.icon}</div>
      <div class="fd-temp">${max}° <span class="low">${min}°</span></div>
    `;
    forecastEl.appendChild(dayCard);
  }

  resultEl.classList.remove('hidden');
}