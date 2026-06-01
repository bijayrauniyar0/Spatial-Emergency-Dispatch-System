import { Model, FindAndCountOptions } from 'sequelize';

interface PaginationOptions {
  page?: number;
  page_size?: number;
}

interface PaginatedResult<T> {
  results: T[];
  total: number;
  page: number;
  next_page: number | null;
}
export async function paginate<T extends Model>(
  model: {
    findAndCountAll(
      // eslint-disable-next-line no-unused-vars
      options?: FindAndCountOptions,
    ): Promise<{ rows: T[]; count: number }>;
  },
  options: FindAndCountOptions,
  pagination: PaginationOptions,
): Promise<PaginatedResult<T>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.page_size ?? 10;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const { rows: results, count: total } = await model.findAndCountAll({
    ...options,
    offset,
    limit,
  });

  const totalPages = Math.ceil(total / pageSize);
  const next_page = page < totalPages ? page + 1 : null;

  return {
    results,
    total,
    page,
    next_page,
  };
}
