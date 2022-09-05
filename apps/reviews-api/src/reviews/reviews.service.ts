import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewsService {
	constructor(private prisma: DatabaseService) {}

	getReviewsCount() {
		return this.prisma.review.count();
	}

	getAllReviews(limit: number, page: number) {
		const _limit = isNaN(limit) ? 10 : limit;
		const _page = isNaN(page) ? 1 : page;
		return this.prisma.review.findMany({
			skip: _limit * (_page - 1),
			take: _limit,
			orderBy: {
				createdOn: 'desc',
			},
			include: {
				user: true,
				company: true,
			},
		});
	}
}
