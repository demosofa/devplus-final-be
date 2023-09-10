import { SelectQueryBuilder } from 'typeorm';

import { PageOptionsDto } from './PageOptions.dto';
import { PageMetaDto } from './PageMeta.dto';
import { PageDto } from './Page.dto';

export async function pagination<T>(
	queryBuilder: SelectQueryBuilder<T>,
	pageOptionsDto: PageOptionsDto
) {
	if (pageOptionsDto.orderBy && pageOptionsDto.order) {
		queryBuilder.orderBy(pageOptionsDto.orderBy, pageOptionsDto.order);
	}

	if (pageOptionsDto.skip) {
		queryBuilder.skip(pageOptionsDto.skip);
	}

	if (pageOptionsDto.take) {
		queryBuilder.take(pageOptionsDto.take);
	}

	const itemCount = await queryBuilder.getCount();
	const { entities } = await queryBuilder.getRawAndEntities();

	const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

	return new PageDto(entities, pageMetaDto);
}
