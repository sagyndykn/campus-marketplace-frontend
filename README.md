# Campus Marketplace — Frontend

A mobile-first React web app for a student marketplace at SDU University. Students can browse, swipe, and post listings for items they want to buy or sell on campus.

---

## Problem Statement

SDU University students lack a dedicated platform to trade items within the campus. Existing apps are not student-verified and not campus-focused. This frontend provides a simple, engaging experience — restricted to verified `@sdu.edu.kz` accounts — where students can discover and post listings in a Tinder-style swipe feed.

---

## Features

- **Swipe feed** — browse listings with swipe-left / swipe-right interaction
- **Create listing** — post items for sale with photos, price, and category
- **User profile** — view and edit personal info, upload avatar, see own listings
- **OTP verification** — email confirmation on registration
- **Wishlist** — save liked listings (in-memory)
- **Responsive design** — mobile-first with desktop header nav

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |
| Routing | React Router v7 |

---

## Installation

### Prerequisites
- Node.js 18+
- npm
- Backend API running at `http://localhost:8080`

### Steps

**1. Clone the repository**
```bash
git clone <repository-url>
cd campus-marketplace-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment (optional)**

Create a `.env` file if the backend runs on a different port:
```env
VITE_API_URL=http://localhost:8080/api
```

**4. Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5174`.

---

## Usage

1. Open the app — you will see the login/register screen
2. Register with your `@sdu.edu.kz` email — an OTP code will be sent
3. Enter the 6-digit OTP to verify your account
4. Browse listings by swiping right (like) or left (skip)
5. Tap **+** to post a new listing with photos
6. Visit **Profile** to edit your info or see your listings

---

## Project Structure

```
src/
├── api/              # Fetch wrappers per resource (auth.js, listings.js, users.js)
├── components/
│   └── layout/       # Header (desktop), MobileNav (bottom tab bar)
├── context/          # MarketContext — wishlist state
├── data/             # Category labels and constants
├── pages/
│   ├── auth/         # AuthPage (login/register), OtpPage
│   ├── Index.jsx     # Swipe feed
│   ├── AddListing.jsx
│   ├── Profile.jsx
│   ├── Wishlist.jsx
│   ├── Chat.jsx
│   └── ChatDialog.jsx
├── App.jsx           # Auth gate + routing
├── main.jsx
└── index.css         # Tailwind + CSS variables (--primary, --accent)
```

---

## Pages

| Route | Description | Status |
|---|---|---|
| `/` | Swipe feed — browse all listings | Done |
| `/add` | Create a new listing | Done |
| `/profile` | User profile and settings | Done |
| `/wishlist` | Saved/liked listings | Placeholder |
| `/chat` | Messages list | Placeholder |
| `/chat/:id` | Individual chat dialog | Placeholder |

---

## Brand Colors

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `#082673` | SDU Navy Blue |
| `--accent` | `#9e2629` | SDU Red |
