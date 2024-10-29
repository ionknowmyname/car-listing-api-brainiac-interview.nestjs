export class PaginationResponse<T> {
  pageNumber?: number;
  pageSize?: number;
  total?: number;
  data: T;
}

export class NoPaginationResponse<T> {
  data: T;
}