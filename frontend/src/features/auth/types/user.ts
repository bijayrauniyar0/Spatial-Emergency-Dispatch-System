interface User {
  email?: string;
  name?: string;
  [key: string]: any;
}

export type UserProfileUpdate = Partial<Omit<User, "avatar">> & {
  avatar?: File; // Adding the avatar field with File type
};

export type UserProfileParamsProps = {
  params: Promise<{
    user_id: string;
  }>;
};
