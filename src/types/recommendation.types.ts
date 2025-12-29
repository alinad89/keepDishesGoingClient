export interface RecommendationItem {
  id: string;
  name: string;
}

export interface RecommendationResponse {
  player_id: string;
  recommendations: RecommendationItem[];
}
