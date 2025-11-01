export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
}

export interface RegisterRequest extends AuthRequest {
  confirmPassword: string
}
