export interface FilterRequest {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  pageOrder?: PAGE_ORDER;
  pageSort?: string;
  from?: string;
  to?: string;
  id?: string;
  status?: string;
}

export enum PAGE_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}
