/**
 * ნოვა ბანკი (Nova Bank) - კლიენტის ინტერაქტიული ლოგიკა (script.js)
 * 1. მობილური მენიუ (Hamburger toggle)
 * 2. Sticky Header & Back-to-top ღილაკი
 * 3. აქტიური ლინკების ავტომატური მონიშვნა სქროლისას
 * 4. 3D საბანკო ბარათის Tilt ეფექტი
 * 5. საკონტაქტო ფორმის ვალიდაცია და გაგზავნის სიმულაცია
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM ელემენტების ინიციალიზაცია
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const cardScene = document.getElementById('cardScene');
  const interactiveCard = document.getElementById('interactiveCard');

  /* ==========================================================================
     1. ჰედერისა და Back to Top ღილაკის მართვა სქროლზე
     ========================================================================== */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // ჰედერის ჩრდილი და დაბინდვა 40px სქროლის შემდეგ
    if (scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top ღილაკის გამოჩენა 400px სქროლის შემდეგ
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    updateActiveNavLink();
  });

  // გვერდის თავში ასვლა ღილაკზე დაჭერით
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /* ==========================================================================
     2. მობილური ნავიგაციის მენიუ (Hamburger Menu)
     ========================================================================== */
  hamburgerBtn.addEventListener('click', () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    hamburgerBtn.classList.toggle('active');
    navMenuWrapper.classList.toggle('open');
  });

  // მენიუს დახურვა ნავიგაციის რომელიმე ლინკზე დაჭერისას
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      navMenuWrapper.classList.remove('open');
    });
  });

  /* ==========================================================================
     3. აქტიური სექციის ლინკის მონიშვნა სქროლისას
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ==========================================================================
     4. 3D საბანკო ბარათის Tilt ეფექტი მაუსის მოძრაობაზე
     ========================================================================== */
  if (cardScene && interactiveCard && window.innerWidth > 768) {
    cardScene.addEventListener('mousemove', (e) => {
      const rect = cardScene.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);

      // დახრის კუთხეები X და Y ღერძებზე
      const rotateX = (-y / (rect.height / 2)) * 14;
      const rotateY = (x / (rect.width / 2)) * 16;

      interactiveCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });

    cardScene.addEventListener('mouseleave', () => {
      interactiveCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ==========================================================================
     5. საკონტაქტო ფორმის ვალიდაცია და გაგზავნა
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const successAlert = document.getElementById('formSuccessAlert');
  const errorAlert = document.getElementById('formErrorAlert');
  const errorMessageText = document.getElementById('errorMessageText');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const btnText = document.getElementById('btnText');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const message = document.getElementById('userMessage').value.trim();

      // შემოწმება: ცარიელი ველები
      if (!name || !phone || !email || !message) {
        showError('გთხოვთ შეავსოთ ყველა აუცილებელი ველი (*)');
        return;
      }

      // ელ-ფოსტის ფორმატის ვალიდაცია
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showError('გთხოვთ მიუთითოთ სწორი ელ-ფოსტის მისამართი');
        return;
      }

      // ტელეფონის ნომრის მინიმალური ვალიდაცია
      const phoneClean = phone.replace(/[\s\-\(\)\+]/g, '');
      if (phoneClean.length < 9) {
        showError('გთხოვთ მიუთითოთ ვალიდური ტელეფონის ნომერი');
        return;
      }

      // გაგზავნის იმიტაცია და ანიმაცია
      errorAlert.style.display = 'none';
      btnText.textContent = 'იგზავნება...';
      contactSubmitBtn.style.opacity = '0.7';
      contactSubmitBtn.disabled = true;

      setTimeout(() => {
        btnText.textContent = 'შეტყობინების გაგზავნა';
        contactSubmitBtn.style.opacity = '1';
        contactSubmitBtn.disabled = false;

        // წარმატების შეტყობინების ჩვენება
        successAlert.style.display = 'flex';
        contactForm.reset();

        // 6 წამის შემდეგ ავტომატური გაქრობა
        setTimeout(() => {
          successAlert.style.display = 'none';
        }, 6000);
      }, 900);
    });
  }

  function showError(text) {
    successAlert.style.display = 'none';
    errorMessageText.textContent = text;
    errorAlert.style.display = 'flex';
  }
});
