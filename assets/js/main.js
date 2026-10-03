(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init Typed.js for Hero Title
   */
  function initTyped() {
    const selectTyped = document.querySelector('.typed');
    if (!selectTyped) return;

    let typed_strings = selectTyped.getAttribute('data-typed-items');
    if (!typed_strings) return;
    typed_strings = typed_strings.split(',').map(s => s.trim());

    if (typeof Typed !== 'undefined') {
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2000
      });
    } else {
      let itemIdx = 0;
      let charIdx = 0;
      let isDeleting = false;

      function typeLoop() {
        const currentItem = typed_strings[itemIdx];
        if (isDeleting) {
          selectTyped.textContent = currentItem.substring(0, charIdx - 1);
          charIdx--;
        } else {
          selectTyped.textContent = currentItem.substring(0, charIdx + 1);
          charIdx++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIdx === currentItem.length) {
          speed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          itemIdx = (itemIdx + 1) % typed_strings.length;
          speed = 300;
        }

        setTimeout(typeLoop, speed);
      }
      typeLoop();
    }
  }

  window.addEventListener('load', initTyped);

  /**
   * Send the contact form directly to Web3Forms.
   */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const loading = form.querySelector('.loading');
    const errorMessage = form.querySelector('.error-message');
    const sentMessage = form.querySelector('.sent-message');
    const submitButton = form.querySelector('button[type="submit"]');

    function showMessage(element) {
      [loading, errorMessage, sentMessage].forEach(message => {
        message.style.display = message === element ? 'flex' : 'none';
      });
    }

    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const accessKey = form.elements.access_key.value.trim();
      if (!accessKey || accessKey === 'TU_ACCESS_KEY') {
        errorMessage.querySelector('span').textContent = 'Falta configurar la clave de envío de Web3Forms.';
        showMessage(errorMessage);
        return;
      }

      showMessage(loading);
      submitButton.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'No pudimos enviar tu consulta. Intentá nuevamente.');
        }

        form.reset();
        showMessage(sentMessage);
      } catch (error) {
        errorMessage.querySelector('span').textContent = error.message || 'No pudimos enviar tu consulta. Intentá nuevamente.';
        showMessage(errorMessage);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  initContactForm();

  /**
   * Vertical scrolling moves the services story horizontally on every viewport.
   */
  function initServicesStory() {
    const story = document.querySelector('.services-story');
    if (!story) return;

    const track = story.querySelector('.services-story__track');
    const background = story.querySelector('.services-story__background');
    const panels = Array.from(story.querySelectorAll('.services-story__panel'));
    const progressLabel = story.querySelector('.services-story__progress span');
    let animationFrame;

    function updateStory() {
      animationFrame = undefined;

      const rect = story.getBoundingClientRect();
      const scrollLength = story.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollLength));
      const activeIndex = Math.min(panels.length - 1, Math.round(progress * (panels.length - 1)));

      track.style.transform = `translate3d(${-progress * (panels.length - 1) * window.innerWidth}px, 0, 0)`;
      background.style.backgroundColor = panels[activeIndex].dataset.color;
      progressLabel.textContent = `0${activeIndex + 1}`;
      panels.forEach((panel, index) => panel.classList.toggle('is-active', index === activeIndex));
    }

    function requestUpdate() {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateStory);
    }

    window.addEventListener('resize', requestUpdate);
    document.addEventListener('scroll', requestUpdate, { passive: true });
    panels[0].classList.add('is-active');
    updateStory();
  }

  window.addEventListener('load', initServicesStory);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
