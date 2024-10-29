import { BaseResponse } from './base.response';

export interface SuccessResponse<T> extends BaseResponse {
  data?: T;
}
