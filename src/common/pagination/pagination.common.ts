import { Repository } from 'typeorm';
import { calculatePagination } from './common.utils';

export async function pagination<T>(
	repository: Repository<T>,
	page: number,
	take: number
) {
	const skip = (page - 1) * take;
	const [data, count] = await repository.findAndCount({
		skip,
		take,
	});
	return {
		data,
		count,
		...calculatePagination(count, take, page),
	};
}
