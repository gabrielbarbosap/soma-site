# SOMA Administradora — Site Institucional

Site institucional estático (HTML/CSS/JS puro, sem build) para a SOMA Administradora e Gestão Contábil.

## Estrutura

- `index.html` — Início
- `quem-somos.html` — Quem Somos
- `servicos.html` — Serviços
- `solicitar-proposta.html` — Solicitar Proposta (formulário)
- `contato.html` — Contato (formulário)
- `boletos.html` — Pagamento de Boletos
- `assets/css/style.css` — estilos (design system, mobile-first)
- `assets/js/main.js` — menu mobile, scroll reveal, integração com WhatsApp
- `assets/img/` — logos e imagens

## Rodar localmente

Qualquer servidor estático funciona, por exemplo:

```bash
npx serve .
```

## Pendências para ajustar antes de publicar para o cliente

Esses dados estão como placeholder e precisam ser trocados pelos reais:

- Número de WhatsApp em `assets/js/main.js` (`WHATSAPP_NUMBER`)
- Telefone e e-mail no rodapé e nas páginas de contato/proposta
- Link real da plataforma de pagamento de boletos em `boletos.html`
- Fotos reais nos espaços marcados com "Foto (substituir)" em `assets/img/foto-placeholder.avif`

## Deploy

Site estático — compatível com deploy direto na [Vercel](https://vercel.com) sem configuração adicional (framework preset "Other").
