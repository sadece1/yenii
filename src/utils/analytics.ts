// Google Analytics 4 Utility Functions

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  console.log('Google Analytics initialized:', measurementId);
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });

  console.log('GA Page View:', url);
};

// Track custom events
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });

  console.log('GA Event:', { action, category, label, value });
};

// E-commerce tracking - View Item
export const trackViewItem = (item: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'view_item', {
    currency: 'TRY',
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Gear',
        price: item.price,
        quantity: 1,
      },
    ],
  });
};

// E-commerce tracking - Add to Cart
export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  category?: string;
  quantity?: number;
}) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'add_to_cart', {
    currency: 'TRY',
    value: item.price * (item.quantity || 1),
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Gear',
        price: item.price,
        quantity: item.quantity || 1,
      },
    ],
  });
};

// E-commerce tracking - Purchase
export const trackPurchase = (transaction: {
  transactionId: string;
  value: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    category?: string;
    quantity?: number;
  }>;
}) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'purchase', {
    transaction_id: transaction.transactionId,
    currency: 'TRY',
    value: transaction.value,
    items: transaction.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || 'Gear',
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// User signup tracking
export const trackSignup = (method: string = 'email') => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'sign_up', {
    method: method,
  });
};

// User login tracking
export const trackLogin = (method: string = 'email') => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'login', {
    method: method,
  });
};

// Review submission tracking
export const trackReviewSubmit = (rating: number, itemType: 'campsite' | 'gear') => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'review_submit', {
    event_category: 'Engagement',
    event_label: itemType,
    value: rating,
  });
};

// Share tracking
export const trackShare = (method: string, contentType: string, itemId: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
  });
};

// Newsletter subscription tracking
export const trackNewsletterSignup = () => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'newsletter_signup', {
    event_category: 'Engagement',
  });
};

// Contact form submission tracking
export const trackContactForm = () => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'contact_form_submit', {
    event_category: 'Engagement',
  });
};

// Reservation tracking
export const trackReservation = (campsiteId: string, nights: number, totalPrice: number) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'begin_checkout', {
    currency: 'TRY',
    value: totalPrice,
    items: [
      {
        item_id: campsiteId,
        item_category: 'Reservation',
        quantity: nights,
        price: totalPrice / nights,
      },
    ],
  });
};

// Set user properties
export const setUserProperties = (properties: { [key: string]: any }) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('set', 'user_properties', properties);
};

// Timing tracking (for performance monitoring)
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
    event_label: label,
  });
};

// Exception tracking
export const trackException = (description: string, fatal: boolean = false) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return;

  (window as any).gtag('event', 'exception', {
    description: description,
    fatal: fatal,
  });
};





