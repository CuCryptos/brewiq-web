// User types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  level: number;
  xp: number;
  tier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  stats: UserStats;
  achievements: Achievement[];
  recentReviews: Review[];
  savedBeers: Beer[];
}

export interface UserStats {
  beersScanned: number;
  reviewsWritten: number;
  sightingsReported: number;
  recipesCreated: number;
  followersCount: number;
  followingCount: number;
}

export type SubscriptionTier = "free" | "enthusiast" | "connoisseur" | "brewmaster";

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Beer types
export interface Beer {
  id: string;
  slug: string;
  name: string;
  brewery: Brewery;
  style: BeerStyle;
  abv: number;
  ibu?: number;
  description?: string;
  imageUrl?: string;
  iqScore?: number;
  iqTier?: IQTier;
  flavorProfile?: FlavorProfile;
  tastingNotes?: string[];
  foodPairings?: string[];
  averageRating: number;
  reviewCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BeerStyle {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export type IQTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface FlavorProfile {
  hoppy: number;
  malty: number;
  bitter: number;
  sweet: number;
  roasted: number;
  fruity: number;
  spicy: number;
  sour: number;
}

// Brewery types
export interface Brewery {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  beersCount: number;
  averageRating: number;
  isVerified: boolean;
  createdAt: string;
}

// Review types
export interface Review {
  id: string;
  user: User;
  beer: Beer;
  rating: number;
  content: string;
  flavorTags?: string[];
  imageUrl?: string;
  helpfulCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Scan types
export interface Scan {
  id: string;
  user: User;
  imageUrl: string;
  scanType: ScanType;
  status: ScanStatus;
  results?: ScanResult[];
  createdAt: string;
}

export type ScanType = "single" | "menu" | "shelf";
export type ScanStatus = "processing" | "completed" | "failed";

export interface ScanResult {
  beer: Beer;
  confidence: number;
  boundingBox?: BoundingBox;
  iqAnalysis?: IQAnalysis;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IQAnalysis {
  score: number;
  tier: IQTier;
  breakdown: {
    quality: number;
    complexity: number;
    balance: number;
    uniqueness: number;
  };
  tastingNotes: string[];
  flavorProfile: FlavorProfile;
  foodPairings: string[];
  tryNext: Beer[];
}

// Sighting types
export interface Sighting {
  id: string;
  user: User;
  beer: Beer;
  locationName: string;
  latitude: number;
  longitude: number;
  format: BeerFormat;
  price?: number;
  notes?: string;
  imageUrl?: string;
  confirmedCount: number;
  reportedMissingCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BeerFormat = "draft" | "can" | "bottle" | "crowler" | "growler";

// Recipe types
export interface Recipe {
  id: string;
  slug: string;
  user: User;
  name: string;
  style: BeerStyle;
  description?: string;
  batchSize: number;
  batchSizeUnit: "gallons" | "liters";
  originalGravity: number;
  finalGravity: number;
  abv: number;
  ibu: number;
  srm: number;
  fermentables: Fermentable[];
  hops: Hop[];
  yeast: Yeast;
  mashSteps?: MashStep[];
  instructions?: string;
  clonedFromBeer?: Beer;
  isPublic: boolean;
  brewCount: number;
  forkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Fermentable {
  name: string;
  amount: number;
  unit: "lb" | "kg" | "oz" | "g";
  type?: string;
  color?: number;
}

export interface Hop {
  name: string;
  amount: number;
  unit: "oz" | "g";
  timing: number;
  use: "boil" | "dry_hop" | "whirlpool";
  alphaAcid?: number;
}

export interface Yeast {
  name: string;
  brand?: string;
  amount?: number;
  attenuation?: number;
}

export interface MashStep {
  name: string;
  temperature: number;
  duration: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

// Notification types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType =
  | "scan_complete"
  | "review_liked"
  | "new_follower"
  | "sighting_confirmed"
  | "achievement_unlocked"
  | "recipe_forked"
  | "level_up";

// Subscription types
export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: "active" | "canceled" | "past_due";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Search and filter types
export interface BeerSearchParams {
  query?: string;
  style?: string;
  breweryId?: string;
  minAbv?: number;
  maxAbv?: number;
  minIbu?: number;
  maxIbu?: number;
  iqTier?: IQTier;
  sortBy?: "name" | "iqScore" | "abv" | "ibu" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface SightingSearchParams {
  beerId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  format?: BeerFormat;
  page?: number;
  limit?: number;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  change?: number;
}

export type LeaderboardType = "weekly" | "monthly" | "allTime";
export type LeaderboardCategory = "scans" | "reviews" | "sightings" | "xp";
