# Campus Marketplace — Frontend

A mobile-first React web app for a student marketplace at SDU University. Students can browse, swipe, and post listings for items they want to buy or sell on campus.

---

## Problem Statement

SDU University students lack a dedicated platform to trade items within the campus. Existing apps are not student-verified and not campus-focused. This frontend provides a simple, engaging experience — restricted to verified `@sdu.edu.kz` accounts — where students can discover and post listings in a Tinder-style swipe feed.

---

## Features

- **Swipe feed** — smooth Tinder-style swipe with drag, velocity threshold, and spring snap-back
- **4 view modes** — gallery, list, tile, and swipe
- **Listing detail page** — photo carousel with swipe gestures, author info, similar listings
- **Create listing** — post items for sale with up to 5 photos, price, and category
- **Favorites** — save/unsave listings synced with the backend
- **Real-time chat** — messaging between users via WebSocket
- **User profile** — edit personal info, upload avatar, view own listings
- **Public seller profile** — view any seller's listings
- **OTP verification** — email confirmation on registration
- **Forgot password** — OTP-based password reset flow
- **Dark theme** — persistent dark/light mode with system preference detection
- **Multilingual** — Russian, Kazakh, and English (react-i18next)
- **Mobile-first** — bottom nav, safe-area support, iOS viewport fix

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
| i18n | react-i18next |

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
├── api/              # Fetch wrappers (auth.js, listings.js, users.js, chat.js)
├── components/
│   ├── common/       # Pagination
│   ├── feed/         # FeedHeader, FiltersModal, FeedSkeletonLoader
│   ├── layout/       # Header (desktop), MobileNav (bottom tab bar), Layout
│   ├── listing/      # AuthorListings, SimilarListings
│   ├── listings/     # ListingCard, ListingSwipe, ListingGrid, ListingList, ListingTileGrid
│   ├── marketplace/  # SwipePagination
│   ├── settings/     # LanguageSwitcher
│   └── wishlist/     # EmptyState, SkeletonLoader
├── context/          # MarketContext — wishlist state
├── data/             # Category labels and constants
├── hooks/            # useTheme, useListingNavigation, useWishlist
├── i18n/             # i18next config + locales (ru, en, kk)
├── pages/
│   ├── auth/         # AuthPage, OtpPage, ForgotPasswordPage
│   ├── Index.jsx     # Marketplace feed
│   ├── ListingDetails.jsx
│   ├── AddListing.jsx
│   ├── Profile.jsx
│   ├── ProfileListings.jsx
│   ├── Wishlist.jsx
│   ├── Chat.jsx
│   └── ChatDialog.jsx
├── App.jsx           # Auth gate + routing
├── main.jsx
└── index.css         # Tailwind + CSS variables (--primary, --accent)
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Marketplace feed — gallery / list / tile / swipe |
| `/listings/:id` | Listing detail with photo carousel |
| `/add` | Create a new listing |
| `/profile` | User profile and settings |
| `/profile/:sellerId/listings` | Public seller profile |
| `/wishlist` | Saved/favorited listings |
| `/chat` | Conversations list |
| `/chat/:id` | Individual chat dialog |

---

## Brand Colors

| Variable | Value | Usage |
|---|---|---|
| `--primary` | `#082673` | SDU Navy Blue |
| `--accent` | `#9e2629` | SDU Red |

---

## Team

| Student ID | Name |
|---|---|
| 230110056 | Aknur Buktash |
| 230103136 | Akmaral Adilbek |
| 230103243 | Nurmuhammed Sagyndyk |
| 230103225 | Danial Makssatuly |
