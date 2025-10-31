# Keep Dishes Going Frontend

My Food-ordering platform frontend built with React, TypeScript, and Material-UI, featuring dual-role architecture for restaurant owners and customers.

---

## Challenges & Accomplishments

### Biggest Challenges

1. **Dual Authentication Architecture**
   - Implementing two separate authentication flows: Keycloak OAuth2 for owners and anonymous session-based auth for customers
   - Files: `src/keycloak.ts`, `src/lib/axiosClient.ts`, `src/components/CustomerApp.tsx`
   - Challenge: Managing token refresh for owner routes while maintaining cookie-based sessions for customer routes

2. **Draft-Editing System**
   - Building a UI for editing dishes as drafts without affecting live menu
   - Supporting real-time draft preview, apply, and discard actions
   - Files: `src/pages/owner/EditDishDraftPage.tsx`, `src/hooks/owner/useDishDraft.ts`
   - Challenge: Syncing draft state with backend while showing immediate UI feedback!

3. **Basket State Management with React Query**
   - Implementing optimistic updates and cache invalidation for basket operations
   - Handling basket validation before checkout (out-of-stock, unpublished dishes)
   - Files: `src/hooks/customer/useBasket.ts`, `src/services/customer/basketService.ts`
   - Challenge: Keeping basket in sync across multiple components without global state library

4. **Guesstimated ETA with Geolocation**
   - Integrating browser geolocation API for customer location
   - Displaying real-time delivery estimates based on coordinates
   - Files: `src/hooks/customer/useGeolocation.ts`, `src/hooks/customer/useRestaurantsWithEta.ts`
   - Challenge: Handling geolocation permissions, errors, and fallback states gracefully

6. **Type-Safe API Layer**
   - Creating a clean separation between services (axios calls) and hooks (React Query wrappers)
   - Ensuring type safety across all API interactions
   - Files: `src/types/index.ts`, `src/types/basket.ts`, `src/services/*`, `src/hooks/*`
   - Challenge: Handling backend inconsistencies (e.g., `id` vs `restaurantId` in nested objects)

7. **Material-UI Theme Customization**
   - Implementing custom theme with brand colors, typography, and component overrides
   - Files: `src/App.tsx`
   - Challenge: Balancing design consistency with MUI's default patterns

### Most Proud Of

- **Clean Architecture Pattern**: Services → Hooks → Components separation ensures maintainable, testable code
- **Real-Time Basket Validation**: Prevents checkout with unavailable dishes using backend-driven validation
- **Responsive Design**: Mobile-first approach with MUI's responsive utilities
- **Type Safety**: TypeScript coverage with zero `any` types in domain logic
- **Geolocation UX**: Graceful handling of location permissions with clear user feedback

---

## ✅ Finished Features

### Owner Features
- ✅ Sign up/sign in with Keycloak OAuth2
  - `src/pages/AuthLanding.tsx`
  - `src/components/OwnerRoute.tsx`
- ✅ Create restaurant with address, cuisine type, opening hours
  - `src/pages/owner/CreateRestaurantPage.tsx`
  - `src/services/owner/restaurantApi.ts`: `createRestaurant()`
- ✅ View restaurant details
  - `src/pages/owner/RestaurantDetailsPage.tsx`
- ✅ Edit opening hours
  - `src/components/OpeningEditorComponent.tsx`
  - `src/components/owner/RestaurantOpeningControl.tsx`
- ✅ Create dishes with name, type, tags, description, price
  - `src/pages/owner/CreateDishPage.tsx`
  - `src/components/owner/DishFormFields.tsx`
- ✅ Edit dishes as drafts without affecting live menu
  - `src/pages/owner/EditDishDraftPage.tsx`
  - `src/hooks/owner/useDishDraft.ts`: `updateDishDraft`, `publishDraft`, `discardDraft`
- ✅ Apply all pending dish changes in one action
  - `src/pages/owner/OwnerDishesPage.tsx`: "Publish All Changes" button
  - `src/hooks/owner/usePublishAllDrafts.ts`
- ✅ Schedule publish/unpublish for future time
  - `src/components/owner/ScheduleDishDialog.tsx`
  - `src/hooks/owner/useScheduleDish.ts`
- ✅ Publish/unpublish dishes immediately
  - `src/components/owner/DishListItem.tsx`
  - `src/hooks/owner/useDishes.ts`: `changeDishStatusMutation`
- ✅ View pending orders
  - `src/pages/owner/PendingOrdersPage.tsx`
  - `src/hooks/owner/usePendingOrders.ts`
- ✅ Accept/decline orders with reason
  - `src/services/owner/orderService.ts`: `acceptOrder()`, `declineOrder()`

### Customer Features
- ✅ Anonymous browsing (automatic session creation)
  - `src/components/CustomerApp.tsx`
  - `src/hooks/customer/useAnonymCustomer.ts`
- ✅ Browse restaurants (list and grid views)
  - `src/pages/customer/BrowsePage.tsx`
  - `src/components/restaurant/RestaurantCard.tsx`
- ✅ View restaurant details and full menu
  - `src/pages/customer/RestaurantPage.tsx`
  - `src/hooks/customer/useRestaurantWithEta.ts`
- ✅ Filter restaurants by cuisine type
  - `src/components/restaurant/DishFilters.tsx`
- ✅ Sort dishes by name, price, type
  - `src/components/restaurant/DishSortSelector.tsx`
- ✅ Search restaurants with guesstimated ETA
  - `src/hooks/customer/useRestaurantsWithEta.ts`
  - `src/hooks/customer/useGeolocation.ts`
- ✅ Build basket from single restaurant
  - `src/components/basket/BasketItemList.tsx`
  - `src/hooks/customer/useBasket.ts`: `addToBasket`, `updateQuantity`, `removeItem`
- ✅ View basket summary with live updates
  - `src/components/basket/BasketStatus.tsx`
  - `src/components/layout/NavbarRightCtas.tsx`: basket icon with item count
- ✅ Checkout with customer details
  - `src/pages/customer/CheckoutPage.tsx`
  - `src/components/checkout/CheckoutSummary.tsx`
- ✅ Order tracking
  - `src/hooks/customer/useOrderTracking.ts`
  - Polling mechanism for real-time status updates

### System Features
- ✅ OAuth2 integration with Keycloak (PKCE flow)
  - `src/keycloak.ts`
  - `src/main.tsx`: `ReactKeycloakProvider`
- ✅ Axios client with automatic token refresh
  - `src/lib/axiosClient.ts`
  - Request interceptor for token attachment and refresh
- ✅ React Query for server state management
  - Query caching, invalidation, optimistic updates
  - `src/App.tsx`: `QueryClientProvider`
- ✅ Responsive navigation with mobile drawer
  - `src/components/layout/Navbar.tsx`
  - `src/components/layout/NavbarDesktopNav.tsx`
- ✅ Custom MUI theme with brand colors
- ✅ Error handling with user-friendly messages
  - `src/utils/errors.ts`
  - Toast notifications via MUI Snackbar/Alert
- ✅ Money formatting utilities
  - `src/utils/money.ts`: Euro formatting

---

## ❌ Unfinished / Planned Features

### High Priority

#### 3. Restaurant Filtering Enhancements
**Current State:**
- ✅ Cuisine filter works
- ❌ Price range filter not implemented in UI
- ❌ Distance filter not implemented (backend supports it)
- ❌ ETA filter not implemented

#### 1. Fetch Automatic Decline (5 min) from Owner Restaurant Filtering (User Story #16)


### Medium Priority

#### 5. Map View for Restaurants
**Current State:**
- No map visualization (only list/grid views)


---

## Technologies Used

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **React Router v6** for navigation

### UI & Styling
- **Material-UI (MUI) v7** component library
- **Emotion** for CSS-in-JS styling
- Custom theme with brand colors and typography

### State Management
- **React Query (TanStack Query)** for server state
- **React Hook Form** for form state
- **React Context** (via Keycloak provider)

### API & Authentication
- **Axios** for HTTP requests
- **Keycloak React** for OAuth2/OIDC integration
- Automatic token refresh and request retry

### Utilities
- **TypeScript** for type safety
- **ESLint** for code quality
- **date-fns** (if used) for date formatting

---

## Project Structure

```
src/
├── components/
│   ├── basket/                     # Basket UI components
│   │   ├── BasketItemLine.tsx
│   │   ├── BasketItemList.tsx
│   │   └── BasketStatus.tsx
│   ├── checkout/                   # Checkout flow components
│   │   ├── BasketSection.tsx
│   │   └── CheckoutSummary.tsx
│   ├── common/                     # Shared/reusable components
│   ├── layout/                     # Navigation and layout
│   │   ├── Navbar.tsx
│   │   ├── NavbarDesktopNav.tsx
│   │   └── NavbarRightCtas.tsx
│   ├── owner/                      # Owner-specific components
│   │   ├── DishFormFields.tsx
│   │   ├── DishListItem.tsx
│   │   ├── ScheduleDishDialog.tsx
│   │   └── RestaurantOpeningControl.tsx
│   └── restaurant/                 # Restaurant/dish display
│       ├── DishFilters.tsx
│       ├── DishSortSelector.tsx
│       └── RestaurantCard.tsx
├── hooks/
│   ├── customer/                   # Customer domain hooks
│   │   ├── useAnonymCustomer.ts
│   │   ├── useBasket.ts
│   │   ├── useGeolocation.ts
│   │   ├── useOrderTracking.ts
│   │   ├── useRestaurantWithEta.ts
│   │   └── useRestaurantsWithEta.ts
│   └── owner/                      # Owner domain hooks
│       ├── useDishes.ts
│       ├── useDishDraft.ts
│       ├── useOwner.ts
│       ├── usePendingOrders.ts
│       └── usePublishAllDrafts.ts
├── pages/
│   ├── customer/                   # Customer pages
│   │   ├── BrowsePage.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── RestaurantPage.tsx
│   ├── owner/                      # Owner pages
│   │   ├── CreateDishPage.tsx
│   │   ├── CreateRestaurantPage.tsx
│   │   ├── EditDishDraftPage.tsx
│   │   ├── OwnerDishesPage.tsx
│   │   ├── PendingOrdersPage.tsx
│   │   └── RestaurantDetailsPage.tsx
│   ├── AuthLanding.tsx
│   └── HomePage.tsx
├── services/                       # API service layer
│   ├── customer/
│   │   ├── basketService.ts        # Basket CRUD
│   │   ├── customerDishes.ts       # Dish queries for customers
│   │   └── restaurantService.ts    # Restaurant queries
│   └── owner/
│       ├── dishService.ts          # Dish management
│       ├── orderService.ts         # Order management
│       └── restaurantApi.ts        # Restaurant management
├── types/
│   ├── index.ts                    # Core domain types
│   └── basket.ts                   # Basket-specific types
├── utils/
│   ├── errors.ts                   # Error handling utilities
│   └── money.ts                    # Money formatting
├── lib/
│   └── axiosClient.ts              # Configured axios instance
├── App.tsx                         # App component with theme & routing
├── main.tsx                        # Entry point with Keycloak provider
└── keycloak.ts                     # Keycloak configuration
```

---

## Setup & Running

### Prerequisites
- **Node.js 18+** and npm
- Backend running at `http://localhost:8080`
- Keycloak at `http://localhost:8180`

### Environment Variables

```bash
VITE_API_URL=http://localhost:8080/api
```

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

App available at: `http://localhost:5173` (or auto-assigned port if taken)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Contributors

- Alina Dimova

---

## License

This project is part of the Karel de Grote Hogeschool Programming 6 course.
