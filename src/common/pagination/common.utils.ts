export function calculatePagination(count: number, take: number, page: number) {
	const totalPages = Math.ceil(count / take);
	const currentPage = page;
	return {
		totalPages,
		currentPage,
	};
}
