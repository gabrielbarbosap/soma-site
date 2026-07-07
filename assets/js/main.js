// SOMA Administradora — interações de front-end
(function () {
  'use strict';

  // ---------- Ícones (Lucide) ----------
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ---------- Config de contato (ajustar com dados reais do cliente) ----------
  var WHATSAPP_NUMBER = '5581900000000'; // formato: 55 + DDD + número, sem símbolos
  var WEB3FORMS_ACCESS_KEY = 'COLOQUE_SUA_CHAVE_DO_WEB3FORMS_AQUI'; // gerar grátis em https://web3forms.com

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

  // ---------- Formulários -> abrem o WhatsApp e enviam por e-mail (Web3Forms) ----------
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      var title = form.getAttribute('data-lead-title') || 'Nova solicitação pelo site';
      lines.push('*' + title + '*');
      data.forEach(function (value, key) {
        if (!value) return;
        lines.push(key + ': ' + value);
      });
      var text = lines.join('\n');
      var status = form.querySelector('.form-status');
      var submitBtn = form.querySelector('button[type="submit"]');

      // Abre o WhatsApp imediatamente — precisa ser síncrono para o navegador não bloquear o pop-up.
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');

      if (status) {
        status.textContent = 'Abrimos o WhatsApp com os dados preenchidos. Enviando também por e-mail...';
        status.classList.add('visible');
      }
      if (submitBtn) submitBtn.disabled = true;

      var emailData = new FormData(form);
      emailData.append('access_key', WEB3FORMS_ACCESS_KEY);
      emailData.append('subject', title);
      emailData.append('from_name', 'Site SOMA Administradora');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: emailData
      })
        .then(function (r) { return r.json(); })
        .then(function (result) {
          if (!status) return;
          status.textContent = result.success
            ? 'Recebemos sua mensagem por e-mail e abrimos o WhatsApp — pode enviar por lá também.'
            : 'Abrimos o WhatsApp com os dados. O envio por e-mail falhou, mas pode continuar por lá.';
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Abrimos o WhatsApp com os dados preenchidos — é só enviar a mensagem por lá.';
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });

      form.reset();
    });
  });

  // ---------- Ano no rodapé ----------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
