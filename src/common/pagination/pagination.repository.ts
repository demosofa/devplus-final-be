import { Repository } from 'typeorm';
import { pagination } from './pagination.common';

export async function findAllWorkSpace<T>(
	repository: Repository<T>,
	page: number,
	customTake: number
) {
	return pagination(repository, page, customTake);
}

// giả sử em không muốn lấy thằng totalPages và currentpage thì làm theo thế này
export async function findAllCampaign<T>(
	productRepository: Repository<T>,
	page: number,
	customTake: number
) {
	const { data, count } = await pagination(productRepository, page, customTake);
	return {
		data,
		count,
	};
}
