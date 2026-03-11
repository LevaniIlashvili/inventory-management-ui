export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface UserDto {
  id: string;
  userName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: UserDto;
}
