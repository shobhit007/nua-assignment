# Nua App Developer Assessment

A React Native product browsing as part of the Nua App Developer assessment.

## Demo

- **Video Demo:** [text](https://drive.google.com/file/d/19bz0ns01fKNyLjJb_8yXjiIApLitJXSb/view?usp=sharing)
- **Test APK:** [text](https://expo.dev/accounts/shobhitsaini79/projects/nua-assignment/builds/8984c7c5-15f6-430d-adc7-a6f312e89fd8)

## Features Implemented

### Product Listing

- Product listing using React Native `FlatList`
- Two-column product grid
- Pagination with infinite scrolling
- Pagination loading and error states
- Empty state handling
- Pull-to-refresh

### Product Search

- Search products using the DummyJSON search API
- Debounced search input to avoid unnecessary API requests
- Search results pagination
- Empty search-result state
- Search loading and error handling
- Stale-response protection using request IDs to prevent older asynchronous responses from overwriting newer search results

### Product Details

- Product detail screen
- Product image carousel
- Product title, description, rating and pricing information
- Discount percentage and discounted price calculation
- Add-to-cart functionality

### Cart

- Add products to cart
- Increase/decrease product quantity
- Remove products from cart
- Calculate cart subtotal
- Persist cart data using `AsyncStorage`
- Restore persisted cart when the application starts

### Return Policy

- Return Policy screen
- Return Policy page rendered using `WebView`

### Analytics

Firebase Analytics events implemented for:

- `product_viewed`
- `add_to_cart`
- `search_performed`
- `app_backgrounded`

## Technical Implementation

### Product Listing State

Product listing state is handled locally using React's `useReducer`.

The reducer manages:

- Products
- Pagination state
- Loading states
- Error states
- Search state
- Request generation for stale-response protection

Derived values such as whether more products are available are calculated from the existing state instead of being stored separately.

### Search Request Handling

Search uses a debounce mechanism so that API requests are only made after the user stops typing.

Because debouncing alone does not guarantee that API responses will arrive in the same order as requests, each search request receives a request ID.

When a response arrives, its request ID is compared with the latest request ID. Stale responses are ignored instead of updating the current product state.

### List Performance

The product list uses React Native's virtualized `FlatList`.

Performance considerations include:

- `React.memo` for product cards
- Stable product keys
- Fixed product card dimensions
- Controlled rendering through FlatList virtualization
- Stable pagination footer layout
- Avoiding unnecessary list state updates

The pagination footer keeps a consistent height while the loading indicator is shown/hidden. This prevents the scrollable content height from changing when pagination completes and avoids visible scroll-position shifts.

## Project Structure

The implementation is organized around feature responsibilities, with product listing/search logic separated from UI components and cart state handled independently.

## Getting Started

### Install dependencies

```bash
npm install
```
