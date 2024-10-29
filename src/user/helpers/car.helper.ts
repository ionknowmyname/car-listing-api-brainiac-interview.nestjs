import { CarDto, createFromEntity } from "../dto/car.dto";
import { FilterRequest, PAGE_ORDER } from "../dto/filter.dto";
import { PaginationResponse } from "../dto/response/pagination.response";

export class CarHelper {
  private constructor() {}

  static carListPipeline(filter: FilterRequest): any[] {
    const {
      keyword,
      from,
      to,
      pageNumber,
      pageSize,
      pageOrder = PAGE_ORDER.DESC,
      pageSort, // price/mileage/year
      status,
      // orgId = '',
    } = filter;

    const keywordRegex = keyword ? new RegExp(keyword, 'i') : undefined;
    const pipeline: any[] = [
      {
        $match: {
          $or: [
            keywordRegex ? { make: keywordRegex } : {},
            keywordRegex ? { model: keywordRegex } : {},
            keywordRegex ? { year: keywordRegex } : {},
          ],
          ...(status && { status: status }),
          ...(from &&
            to && [
              {
                [pageSort]: { $gte: from, $lte: to },
              },
            ]),
        },
      },
    ];

    pipeline.push(
      ...this.genericPaginationPipeline(
        pageNumber,
        pageSize,
        pageOrder,
        pageSort,
      ),
    );
    return pipeline;
  }

  static carsPagedMapper(
    data: any[],
    pageNumber: number = 1,
    pageSize: number = 10,
    // isAdmin: boolean = false,
  ): PaginationResponse<CarDto[]> {
    return {
      data:
        data.map((car: any) => {
          return createFromEntity(car);
        }) ?? [],
      pageNumber,
      pageSize,
      total: data.length ?? 0,
    };
  }

  static genericPaginationPipeline(
    pageNumber: number,
    pageSize: number,
    pageOrder: PAGE_ORDER,
    pageSort: string,
  ): any[] {
    return [
      {
        $facet: {
          data: [
            { $sort: { [pageSort]: pageOrder === PAGE_ORDER.ASC ? 1 : -1 } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
          ],
          count: [{ $count: 'total' }],
        },
      },
    ];
  }
}