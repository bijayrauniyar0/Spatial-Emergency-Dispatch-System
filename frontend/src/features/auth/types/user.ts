interface User {
  id?: number;
  email?: string;
  name?: string;
  role?: "admin" | "responder" | "citizen";
  [key: string]: any;
}

export type UserProfileUpdate = Partial<User>;

export type UserProfileParamsProps = {
  params: Promise<{
    user_id: string;
  }>;
};
