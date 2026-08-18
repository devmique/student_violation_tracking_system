export interface AuthUser {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
  role: "admin" | "general";
}
