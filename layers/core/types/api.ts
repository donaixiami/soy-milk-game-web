export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export type AppErrorKind =
  | 'network'
  | 'business'
  | 'validation'
  | 'auth'
  | 'server';
