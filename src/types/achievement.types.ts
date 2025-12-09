// ========================================
// Achievement Types (Developer BC)
// ========================================

export interface Achievement {
  id: string;
  name: string;
  iconUrl: string;
  instructions: string;
}

export interface CreateAchievementRequest {
  name: string;
  icon: File;
  instructions: string;
}

export interface CreateAchievementResponse {
  id: string;
}

export interface UpdateAchievementRequest {
  name?: string;
  icon?: File;
  instructions?: string;
}
