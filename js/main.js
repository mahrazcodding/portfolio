// ------- منوی موبایل -------
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');

navToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  overlay.classList.toggle('on');
});
overlay.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  overlay.classList.remove('on');
});
document.querySelectorAll('.mobile-nav a').forEach((a) =>
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    overlay.classList.remove('on');
  })
);

// ------- انیمیشن ورود موقع اسکرول -------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ------- فرم تماس (EmailJS) -------
(function () {
  emailjs.init('neOMlnopv8_rDo560'); // Public Key

  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'در حال ارسال...';
    submitBtn.disabled = true;

    emailjs
      .sendForm('service_fsbb3op', 'template_caz5n3y', contactForm)
      .then(function () {
        submitBtn.textContent = 'ارسال شد ✓';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      })
      .catch(function (error) {
        submitBtn.textContent = 'خطا، دوباره تلاش کن';
        submitBtn.disabled = false;
        console.error('EmailJS error:', error);
      });
  });
})();
// ----------افکت تایپ زنده
const codeLines = [
  `<span class="c-kw">const</span> developer = {`,
  `&nbsp;&nbsp;name: <span class="c-str">'Amirhossein Rasouli'</span>,`,
  `&nbsp;&nbsp;role: <span class="c-str">'Front-End Developer'</span>,`,
  `&nbsp;&nbsp;stack: [<span class="c-str">'HTML'</span>, <span class="c-str">'CSS'</span>, <span class="c-str">'JS'</span>],`,
  `&nbsp;&nbsp;approach: <span class="c-str">'pixel-perfect, fast'</span>,`,
  `&nbsp;&nbsp;available: <span class="c-kw">true</span>`,
  `};`,
];

function typeCode() {
  const el = document.getElementById('typedCode');
  if (!el) return;
  let i = 0;
  function nextLine() {
    if (i < codeLines.length) {
      el.innerHTML += (i > 0 ? '\n' : '') + codeLines[i];
      i++;
      setTimeout(nextLine, 260);
    }
  }
  nextLine();
}
typeCode();