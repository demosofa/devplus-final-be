import { SelectQueryBuilder } from 'typeorm';

export interface PaginationResult<T> {
	data: T[];
	count: number;
	totalPages: number;
	currentPage: number;
}

export async function paginate<T>(
	queryBuilder: SelectQueryBuilder<T>,
	page = 1,
	take = 2
): Promise<PaginationResult<T>> {
	const skip = (page - 1) * take;
	const [data, count] = await queryBuilder
		.skip(skip)
		.take(take)
		.getManyAndCount();

	return {
		data,
		count,
		totalPages: Math.ceil(count / take),
		currentPage: page,
	};
}
