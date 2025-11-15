// Frontend-only mode - reviews stored in localStorage
export interface Review {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  campsite_id?: string;
  gear_id?: string;
  campsite_name?: string;
  gear_name?: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  visit_date?: string;
  would_recommend?: boolean;
  is_approved: boolean;
  is_featured: boolean;
  helpful_count: number;
  admin_response?: string;
  admin_response_date?: string;
  created_at: string;
  updated_at: string;
  review_type?: 'campsite' | 'gear';
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
  recommend_count?: number;
}

export interface CreateReviewData {
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  visit_date?: string;
  would_recommend?: boolean;
}

const STORAGE_KEY = 'camp_reviews_storage';

const loadReviews = (): Review[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.error('Failed to load reviews from storage:', error);
  }
  return [];
};

const saveReviews = (reviews: Review[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }
  } catch (error) {
    console.error('Failed to save reviews to storage:', error);
  }
};

const calculateStats = (reviews: Review[]): ReviewStats => {
  const total = reviews.length;
  if (total === 0) {
    return {
      total_reviews: 0,
      average_rating: 0,
      five_star: 0,
      four_star: 0,
      three_star: 0,
      two_star: 0,
      one_star: 0,
      recommend_count: 0,
    };
  }

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const recommendCount = reviews.filter(r => r.would_recommend).length;

  return {
    total_reviews: total,
    average_rating: parseFloat(avgRating.toFixed(1)),
    five_star: ratingCounts[5],
    four_star: ratingCounts[4],
    three_star: ratingCounts[3],
    two_star: ratingCounts[2],
    one_star: ratingCounts[1],
    recommend_count: recommendCount,
  };
};

// Kamp alanı yorumu oluştur
export const createCampsiteReview = async (
  campsiteId: string,
  data: CreateReviewData
): Promise<{ message: string; reviewId: string }> => {
  // Frontend-only mode: save to localStorage
  const reviews = loadReviews();
  const authStorage = localStorage.getItem('auth-storage');
  let userId = 'anonymous';
  let userName = 'Anonim Kullanıcı';

  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.user) {
        userId = state.user.id;
        userName = state.user.name;
      }
    } catch (error) {
      // Use anonymous
    }
  }

  const reviewId = `review-${Date.now()}`;
  const newReview: Review = {
    id: reviewId,
    user_id: userId,
    user_name: userName,
    campsite_id: campsiteId,
    ...data,
    is_approved: true, // Auto-approve in frontend mode
    is_featured: false,
    helpful_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    review_type: 'campsite',
  };

  reviews.push(newReview);
  saveReviews(reviews);

  return {
    message: 'Yorum başarıyla eklendi',
    reviewId,
  };
};

// Ekipman yorumu oluştur
export const createGearReview = async (
  gearId: string,
  data: CreateReviewData
): Promise<{ message: string; reviewId: string }> => {
  const reviews = loadReviews();
  const authStorage = localStorage.getItem('auth-storage');
  let userId = 'anonymous';
  let userName = 'Anonim Kullanıcı';

  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.user) {
        userId = state.user.id;
        userName = state.user.name;
      }
    } catch (error) {
      // Use anonymous
    }
  }

  const reviewId = `review-${Date.now()}`;
  const newReview: Review = {
    id: reviewId,
    user_id: userId,
    user_name: userName,
    gear_id: gearId,
    ...data,
    is_approved: true, // Auto-approve in frontend mode
    is_featured: false,
    helpful_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    review_type: 'gear',
  };

  reviews.push(newReview);
  saveReviews(reviews);

  return {
    message: 'Yorum başarıyla eklendi',
    reviewId,
  };
};

// Kamp alanı yorumlarını getir
export const getCampsiteReviews = async (
  campsiteId: string,
  approvedOnly: boolean = true
): Promise<{ reviews: Review[]; stats: ReviewStats | null }> => {
  const allReviews = loadReviews();
  let filtered = allReviews.filter(r => r.campsite_id === campsiteId);
  
  if (approvedOnly) {
    filtered = filtered.filter(r => r.is_approved);
  }

  const stats = calculateStats(filtered);
  
  return {
    reviews: filtered,
    stats,
  };
};

// Ekipman yorumlarını getir
export const getGearReviews = async (
  gearId: string,
  approvedOnly: boolean = true
): Promise<{ reviews: Review[]; stats: ReviewStats | null }> => {
  const allReviews = loadReviews();
  let filtered = allReviews.filter(r => r.gear_id === gearId);
  
  if (approvedOnly) {
    filtered = filtered.filter(r => r.is_approved);
  }

  const stats = calculateStats(filtered);
  
  return {
    reviews: filtered,
    stats,
  };
};

// Admin: Tüm yorumları getir
export const getAllReviews = async (
  type: 'all' | 'campsite' | 'gear' = 'all',
  status: 'all' | 'pending' | 'approved' = 'pending'
): Promise<{ reviews: Review[] }> => {
  let reviews = loadReviews();

  if (type !== 'all') {
    reviews = reviews.filter(r => r.review_type === type);
  }

  if (status === 'pending') {
    reviews = reviews.filter(r => !r.is_approved);
  } else if (status === 'approved') {
    reviews = reviews.filter(r => r.is_approved);
  }

  return { reviews };
};

// Admin: Yorum durumunu güncelle
export const updateReviewStatus = async (
  reviewId: string,
  type: 'campsite' | 'gear',
  data: {
    is_approved: boolean;
    admin_response?: string;
  }
): Promise<{ message: string }> => {
  const reviews = loadReviews();
  const index = reviews.findIndex(r => r.id === reviewId);

  if (index === -1) {
    throw new Error('Yorum bulunamadı');
  }

  reviews[index] = {
    ...reviews[index],
    is_approved: data.is_approved,
    admin_response: data.admin_response,
    admin_response_date: data.admin_response ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
  };

  saveReviews(reviews);

  return { message: 'Yorum durumu güncellendi' };
};

// Yorumu faydalı bul
export const markReviewHelpful = async (
  reviewId: string,
  type: 'campsite' | 'gear'
): Promise<{ message: string }> => {
  const reviews = loadReviews();
  const index = reviews.findIndex(r => r.id === reviewId);

  if (index === -1) {
    throw new Error('Yorum bulunamadı');
  }

  reviews[index].helpful_count += 1;
  saveReviews(reviews);

  return { message: 'Yorum faydalı olarak işaretlendi' };
};

// Yorum şikayet et
export const reportReview = async (
  reviewId: string,
  type: 'campsite' | 'gear',
  reason: 'spam' | 'offensive' | 'fake' | 'irrelevant' | 'other',
  description?: string
): Promise<{ message: string }> => {
  // Frontend-only mode: just log the report
  console.log('Review reported:', { reviewId, type, reason, description });
  
  return { message: 'Yorum şikayeti alındı' };
};



