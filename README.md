# HayBTech.js (Browser SDK)

The official HayBTech browser library for building modern, secure checkout experiences -- accept mobile money payments directly from your website.

[![CDN](https://img.shields.io/badge/CDN-js.haybtech.com-blue.svg)](https://js.haybtech.com/v1/haybtech.js)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Intégration par IA (Prompt pour Marchands)

Si vous utilisez un assistant IA (comme Cursor, GitHub Copilot, ChatGPT, Claude, etc.), vous pouvez copier-coller le prompt suivant pour intégrer ce SDK de A à Z dans votre projet :

```text
Agis en tant qu'expert en intégration frontend JavaScript. Je souhaite intégrer la passerelle de paiement HayBTech sur mon site web statique ou Single Page Application (SPA) avec la bibliothèque browser `haybtech.js` (ou `@haybtech/browser`).

Voici ma stack technique actuelle :
- Framework Frontend : [ex: Vanilla JS, React, Vue, Angular]
- Backend : [ex: API REST Node.js, PHP, Laravel, ou serverless]

*Note de sécurité : L'initiation de paiement doit s'effectuer via votre serveur backend. Le code frontend sert à appeler votre backend et à rediriger ou afficher le guichet de paiement.*

Tâches à accomplir dans le code généré :
1. **Déclenchement du paiement** : Créer une fonction JS qui intercepte le clic sur le bouton "Payer", envoie les détails du panier à votre backend via une requête `fetch` et reçoit l'URL de paiement `payment_url`.
2. **Redirection ou Modal intégrée** : Rediriger l'utilisateur vers cette URL de manière transparente avec `haybtech.redirectToCheckout({ paymentUrl })` ou en ouvrant un popup avec `haybtech.openPopup(...)`.
3. **Écran d'attente et de retour** : Gérer les pages de destination `success_url` et `failed_url`. Sur la page de succès, afficher un écran d'attente pendant que le backend valide la commande par webhook, puis confirmer visuellement l'achat.
4. **Gestion des pannes** : Afficher des messages d'erreur clairs en cas d'échec réseau ou de refus de paiement sans exposer de détails techniques inutiles.

Génère le code frontend complet, moderne, commenté et optimisé.
```

---

## SECURITY WARNING

**NEVER use your Secret Key (`sk_...`) in client-side code.**
Any key included in your JavaScript can be viewed by anyone inspecting your website's source code.

This SDK only accepts **Public Keys (`pk_...`)**. All sensitive operations (creating a payment) must be performed on your backend server.

---

## Installation

### CDN (recommended)

Include the script in your HTML:

```html
<script src="https://js.haybtech.com/v1/haybtech.js"></script>
```

### NPM

```bash
npm install @haybtech/browser
```

```javascript
import HayBTech from '@haybtech/browser';
```

---

## Secure Workflow

```
Browser (Client)                Your Backend                  HayBTech API
    |                               |                            |
    |-- 1. Send order details ----->|                            |
    |   (AJAX / fetch)              |-- 2. Create payment ------>|
    |                               |<--- paymentUrl ------------|
    |<-- 3. Return paymentUrl ------|                            |
    |                               |                            |
    |-- 4. Redirect or Popup ------>|                            |
    |   (haybtech.js)               |                            |
```

1. Your frontend sends order info to **your backend**.
2. Your backend creates the payment via the HayBTech API (using your Secret Key).
3. Your backend returns the `paymentUrl` to the frontend.
4. The browser SDK handles the checkout via redirect or popup.

---

## Usage

### 1. Initialize

```javascript
const haybtech = new HayBTech('pk_test_your_public_key');
```

### 2. Redirect to Checkout (recommended)

The most secure and reliable method. The entire page redirects to the HayBTech payment page:

```javascript
document.getElementById('pay-btn').addEventListener('click', async () => {
  // 1. Call your backend to create a payment
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 5000, currency: 'XOF' })
  });
  const { paymentUrl } = await response.json();

  // 2. Redirect to checkout
  haybtech.redirectToCheckout({ paymentUrl });
});
```

### 3. Popup Checkout (optional)

Opens the payment page in a popup window, keeping your page in the background:

```javascript
document.getElementById('pay-btn').addEventListener('click', async () => {
  const response = await fetch('/api/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 5000, currency: 'XOF' })
  });
  const { paymentUrl } = await response.json();

  haybtech.openPopup({
    paymentUrl,
    onSuccess: (data) => {
      // Payment succeeded -- update the UI
      document.getElementById('status').textContent = 'Payment successful!';
      window.location.href = '/thank-you';
    },
    onCancel: () => {
      document.getElementById('status').textContent = 'Payment cancelled.';
    },
    onFailure: (data) => {
      document.getElementById('status').textContent = 'Payment failed.';
    }
  });
});
```

---


---

## API Reference

### `new HayBTech(publicKey)`

Creates a new HayBTech instance.

| Parameter   | Type     | Description                |
|:------------|:---------|:---------------------------|
| `publicKey` | `string` | Your public key (`pk_...`) |

### `haybtech.redirectToCheckout(options)`

Redirects the browser to the HayBTech payment page.

| Option       | Type     | Required | Description              |
|:-------------|:---------|:---------|:-------------------------|
| `paymentUrl` | `string` | Yes      | URL from your backend    |

### `haybtech.openPopup(options)`

Opens the payment page in a popup window.

| Option       | Type       | Required | Description                 |
|:-------------|:-----------|:---------|:----------------------------|
| `paymentUrl` | `string`   | Yes      | URL from your backend       |
| `onSuccess`  | `function` | No       | Called on successful payment |
| `onCancel`   | `function` | No       | Called when cancelled        |
| `onFailure`  | `function` | No       | Called on failure             |

---

## Security Features

- **Public Key Enforcement**: Throws an error if an `sk_` key is used.
- **Origin Validation**: Uses `window.postMessage` with strict origin checks for popup communication.
- **No Local Persistence**: Sensitive data is never stored in `localStorage`, `sessionStorage`, or cookies.
- **Content Security Policy**: Compatible with strict CSP configurations.

---

## Browser Support

| Browser         | Version |
|:----------------|:--------|
| Chrome          | 60+     |
| Firefox         | 60+     |
| Safari          | 12+     |
| Edge            | 79+     |
| Mobile Chrome   | 60+     |
| Mobile Safari   | 12+     |

MIT License

