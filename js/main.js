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