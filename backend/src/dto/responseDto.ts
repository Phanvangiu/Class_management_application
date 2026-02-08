export interface ResponseDto<T = any> {
  status: number;
  data: T | null;
  message: string;
}
