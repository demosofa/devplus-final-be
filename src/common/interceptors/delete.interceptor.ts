import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	HttpStatus,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class DeleteInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> | Promise<Observable<any>> {
		//those code before next will run first before route handler

		return next.handle().pipe(
			map((responseBody) => {
				if (typeof responseBody == 'boolean') {
					if (responseBody)
						return {
							message: 'Delete successfully',
							statusCode: HttpStatus.OK,
						};

					throw new BadRequestException('Delete unsuccessfully');
				}

				return responseBody;
			})
		);
	}
}
