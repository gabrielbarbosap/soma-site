// Vercel Serverless Function — envia o lead dos formulários do site por e-mail via Resend.
// Variáveis de ambiente necessárias (Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY     - chave da API do Resend (resend.com)
//   CONTACT_NOTIFY_TO  - e-mail que deve receber os leads (ex: contato@somaadministradora.com)
//   CONTACT_FROM_EMAIL - remetente verificado no Resend (ex: "Site SOMA <contato@somaadministradora.com>")

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido' });
    return;
  }

  var body = req.body || {};
  var title = body.title;
  var botcheck = body.botcheck;

  // honeypot anti-spam: se preenchido, finge sucesso e não envia nada
  if (botcheck) {
    res.status(200).json({ success: true });
    return;
  }

  var RESEND_API_KEY = process.env.RESEND_API_KEY;
  var NOTIFY_TO = process.env.CONTACT_NOTIFY_TO;
  var FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Site SOMA <onboarding@resend.dev>';

  if (!RESEND_API_KEY || !NOTIFY_TO) {
    res.status(500).json({ success: false, error: 'Configuração de e-mail ausente no servidor.' });
    return;
  }

  var fields = {};
  Object.keys(body).forEach(function (key) {
    if (key === 'title' || key === 'botcheck') return;
    if (!body[key]) return;
    fields[key] = body[key];
  });

  var rows = Object.keys(fields)
    .map(function (key) {
      return (
        '<tr>' +
        '<td style="padding:12px 0;border-bottom:1px solid #f1d2cd;">' +
        '<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#491023;font-weight:700;margin-bottom:4px;font-family:Arial,sans-serif;">' +
        escapeHtml(key) +
        '</div>' +
        '<div style="font-size:15px;color:#241814;font-family:Georgia,\'Times New Roman\',serif;">' +
        escapeHtml(String(fields[key])).replace(/\n/g, '<br>') +
        '</div>' +
        '</td>' +
        '</tr>'
      );
    })
    .join('');

  var subject = title || 'Nova mensagem pelo site SOMA';

  var html =
    '<div style="background:#faf5f1;padding:32px 16px;">' +
    '<div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #f1d2cd;font-family:Georgia,\'Times New Roman\',serif;">' +
    '<div style="background:#0d2a4a;padding:24px 28px;">' +
    '<div style="color:#ffffff;font-size:20px;letter-spacing:.04em;font-weight:bold;">SOMA</div>' +
    '<div style="color:#d6b1a7;font-size:11px;letter-spacing:.12em;text-transform:uppercase;margin-top:2px;font-family:Arial,sans-serif;">Administradora &amp; Gestão Contábil</div>' +
    '</div>' +
    '<div style="padding:28px;">' +
    '<div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#491023;font-weight:700;margin-bottom:10px;font-family:Arial,sans-serif;">' +
    escapeHtml(subject) +
    '</div>' +
    '<h1 style="font-size:21px;color:#0d2a4a;margin:0 0 20px;font-weight:normal;">Você recebeu um novo contato pelo site</h1>' +
    '<table style="width:100%;border-collapse:collapse;">' +
    rows +
    '</table>' +
    '</div>' +
    '<div style="padding:16px 28px;background:#f3e8e2;font-size:12px;color:#5a453f;text-align:center;font-family:Arial,sans-serif;">' +
    'Enviado automaticamente pelo formulário do site somaadministradora.com' +
    '</div>' +
    '</div>' +
    '</div>';

  try {
    var resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_TO],
        reply_to: fields['E-mail'] || undefined,
        subject: subject,
        html: html
      })
    });

    var result = await resendResp.json();

    if (!resendResp.ok) {
      res.status(500).json({ success: false, error: result && result.message ? result.message : 'Falha ao enviar e-mail.' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erro interno ao enviar e-mail.' });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
