import apiClient from "./client";

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
}

export async function signup(data: SignupData): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/api/v1/auth/signup", data);
  return response.data;
}
