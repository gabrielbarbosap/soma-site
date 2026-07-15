// SOMA Administradora — interações de front-end
(function () {
  'use strict';

  // ---------- Ícones (Lucide) ----------
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ---------- Config de contato (ajustar com dados reais do cliente) ----------
  var WHATSAPP_NUMBER = '5581985833635'; // formato: 55 + DDD + número, sem símbolos

  // ---------- Menu mobile ----------
  var toggle = document.querySelector('.nav-toggle');
  var mobileClose = document.querySelector('.mobile-nav-close');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
    });
  }
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
    });
  });

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Link do WhatsApp flutuante e âncoras rápidas ----------
  document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
    var msg = el.getAttribute('data-whatsapp') || 'Olá! Vim pelo site da SOMA e gostaria de mais informações.';
    el.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  // ---------- Formulários -> enviam por e-mail (/api/contact + Resend) ----------
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var title = form.getAttribute('data-lead-title') || 'Nova solicitação pelo site';
      var payload = { title: title };
      data.forEach(function (value, key) {
        if (!value) return;
        payload[key] = value;
      });
      var status = form.querySelector('.form-status');
      var submitBtn = form.querySelector('button[type="submit"]');

      if (status) {
        status.textContent = 'Enviando sua mensagem...';
        status.classList.add('visible');
      }
      if (submitBtn) submitBtn.disabled = true;

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (result) {
          if (!status) return;
          status.textContent = result.success
            ? 'Mensagem enviada com sucesso! Em breve entraremos em contato.'
            : 'Não conseguimos enviar sua mensagem agora. Tente novamente ou fale com a gente pelo WhatsApp.';
          if (result.success) form.reset();
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Não conseguimos enviar sua mensagem agora. Tente novamente ou fale com a gente pelo WhatsApp.';
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });

  // ---------- Ano no rodapé ----------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
