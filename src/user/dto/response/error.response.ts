import { BaseResponse } from './base.response';

export interface ErrorResponse<T> extends BaseResponse {
  error?: T;
}
