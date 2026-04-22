# PixelShop — Meta Pixel Event Tester

A lightweight Vite + React e-commerce demo built specifically for testing Meta Pixel events end-to-end. Every standard pixel event is wired up and displayed in a live Event Log panel on the right side of the screen.

---

## Events covered

| Event | Triggered when |
|---|---|
| `PageView` | Any page is visited |
| `ViewContent` | Product detail page opens |
| `AddToCart` | "Add to Cart" button clicked |
| `AddToWishlist` | Wishlist ♡ button clicked |
| `InitiateCheckout` | "Proceed to Checkout" clicked |
| `AddPaymentInfo` | Payment form submitted |
| `Purchase` | Order placed (payment step) |
| `Search` | Search form submitted |
| `CompleteRegistration` | Button on the Order Success page |

---

## Local development

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Clone the repo

```bash
git clone https://github.com/Gabrieloxe/gab-meta-pixel-tester.git
cd gab-meta-pixel-tester
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your Pixel ID (optional for local testing)

Copy the example env file and add your Pixel ID:

```bash
cp .env.example .env
```

Open `.env` and set your ID:

```
VITE_PIXEL_ID=1234567890
```

> You can also skip this entirely and enter the Pixel ID directly in the **Event Log panel** on the right side of the running app — it saves to `localStorage`.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploy to Vercel

### Option A — Vercel dashboard (recommended)

1. Push the repo to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import `Gabrieloxe/gab-meta-pixel-tester`.
4. Framework will be auto-detected as **Vite** — no changes needed.
5. Under **Environment Variables**, add:
   - **Name:** `VITE_PIXEL_ID`
   - **Value:** your Meta Pixel ID (e.g. `1234567890`)
6. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

When prompted, set the `VITE_PIXEL_ID` environment variable or configure it later in the Vercel project settings.

---

## Testing pixel events

### Using the built-in Event Log panel

The panel on the right side of every page shows every event that fires, along with its parameters, in real time — no browser extension needed.

1. Enter your Pixel ID in the panel and click **Apply** (or set it via `.env`).
2. Interact with the shop — add products, wishlist, search, checkout.
3. Each action logs the event name, timestamp, and exact params sent to Meta.

### Using Facebook Events Manager

1. Open [Facebook Events Manager](https://www.facebook.com/events_manager2).
2. Select your pixel → **Test Events** tab.
3. Enter your deployed Vercel URL.
4. Interact with the site — events appear in real time in Events Manager.

### Using Meta Pixel Helper (Chrome extension)

Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) extension. A green badge will show on the extension icon whenever a pixel event fires on the page.

---

## Project structure

```
gab-meta-pixel-tester/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navbar with search (fires Search event)
│   │   ├── ProductCard.jsx     # Grid card with Add to Cart + Wishlist
│   │   └── PixelEventLog.jsx   # Live event log sidebar
│   ├── context/
│   │   ├── CartContext.jsx     # Cart state (useReducer)
│   │   └── PixelContext.jsx    # Pixel init + event log state
│   ├── data/
│   │   └── products.js         # 6 sample products
│   ├── pages/
│   │   ├── Home.jsx            # Product grid + filters
│   │   ├── ProductDetail.jsx   # Single product (ViewContent)
│   │   ├── CartPage.jsx        # Cart (InitiateCheckout)
│   │   ├── CheckoutPage.jsx    # 2-step checkout (AddPaymentInfo + Purchase)
│   │   └── OrderSuccess.jsx    # Confirmation + CompleteRegistration
│   ├── utils/
│   │   └── pixel.js            # All fbq() wrappers + local event log
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind v4 + DaisyUI (night theme)
├── index.html
├── vercel.json                 # SPA rewrite rule
├── vite.config.js
└── .env.example
```

---

## Stack

- **Vite** — build tool
- **React 18** + **React Router v6** — UI and routing
- **Tailwind CSS v4** + **DaisyUI v5** — styling (night theme)
- **Meta Pixel** — loaded via the standard fbevents.js snippet
