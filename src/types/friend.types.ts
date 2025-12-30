export interface Friend {
  id: string;
  email: string;
  username: string;
}

export interface FriendUser {
  username: string;
  email: string;
  id: string;
}

export interface FriendRequest {
  id: string;
  sender: FriendUser;
  receiver: FriendUser;
  issuedAt: string;
}

export interface SendFriendRequestBody {
  receiverId: string;
}

export interface SendFriendRequestResponse {
  id: string;
}

export interface Player {
  id: string;
  username: string;
}
