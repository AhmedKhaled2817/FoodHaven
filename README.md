# Food Haven 🍴

**Food Haven** is a beautiful, modern food discovery application built with Angular. Discover recipes from around the world, save your favorites, manage your cart, and customize your theme with an elegant glass-morphism UI!

## Features ✨

- 📱 **Responsive Design**: Works perfectly on all devices from mobile to desktop
- 🎨 **Theme Customization**: Switch between light and dark themes
- 🔍 **Search & Filtering**:
  - Search meals by name
  - Filter by category
  - Filter by area (cuisine origin)
- ❤️ **Favorites**: Save your favorite meals
- 🛒 **Shopping Cart**: Add meals to cart and manage quantities
- 🔐 **Authentication**: Register & login system with localStorage persistence
- � **User Profile**: View your profile, statistics, and settings
- 📦 **Order History**: Track your past orders
- �📄 **Meal Details**: View complete instructions, ingredients, and YouTube links
- ✨ **Smooth Animations**: Powered by AOS (Animate On Scroll) and Animate.css
- ⚡ **Signals-based State**: Using Angular's modern Signals API for reactivity
- 🚀 **Server-Side Rendering (SSR)**: Improved performance and SEO
- 📱 **Progressive Web App (PWA)**: Installable on devices for native-like experience

## Tech Stack 🛠️

- **Angular 21+**: Modern standalone components and Signals API
- **Angular SSR**: Server-side rendering for better performance
- **Angular Service Worker**: PWA support
- **Bootstrap 5**: Responsive grid system & components
- **Angular Material CDK**: UI utilities
- **TypeScript**: Type-safe development
- **SCSS**: Custom styling & variables
- **Themealdb API**: Source for all meal data
- **AOS**: Scroll animations
- **Animate.css**: Predefined animations
- **ngx-toastr**: Toast notifications
- **Swiper**: Carousel/slider component

## Getting Started 🚀

### Prerequisites

- Node.js (v20+ recommended)
- npm or yarn package manager

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run start
# or
ng serve -o
```

The app will automatically open in your browser at `http://localhost:4200`!

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/food-haven/` folder.

### Serve SSR

To run the SSR version of the app:

```bash
npm run build
npm run serve:ssr:food-haven
```

## Project Structure 📁

```
food-haven/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Authentication guards
│   │   │   ├── interceptors/    # HTTP interceptors
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   └── services/        # Business logic (Auth, Cart, Meals, Theme, etc.)
│   │   ├── pages/               # Main pages (Home, Login, Register, Cart, Favorites, Meal Details, Profile, Order History)
│   │   ├── shared/
│   │   │   └── components/      # Reusable components (Navbar, Meal Card)
│   │   ├── app.config.ts        # App configuration
│   │   ├── app.routes.ts        # Routing setup
│   │   └── app.ts               # Root component
│   ├── environments/            # Environment configurations
│   ├── styles.scss              # Global styles & variables
│   └── index.html
├── public/                      # Static assets (icons, favicon, manifest)
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies and scripts
├── ngsw-config.json             # PWA service worker configuration
└── README.md
```

## API Used 🌐

This app uses the free [Themealdb API](https://www.themealdb.com/) to fetch meal data.

## License 📝

MIT License - feel free to use this project for learning or building your own apps!
