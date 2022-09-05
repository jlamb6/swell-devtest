import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsCountResponse, ReviewsResponse } from './reviews.types';

@Controller('reviews')
export class ReviewsController {
	constructor(private reviewsService: ReviewsService) {}

	@Get('/')
	async getAllReviews(
		@Query('limit') limit: string,
		@Query('page') page: string,
	): Promise<ReviewsResponse> {
		const reviews = await this.reviewsService.getAllReviews(parseInt(limit), parseInt(page));
		return { reviews };
	}

	@Get('/count')
	async getReviewsCount(): Promise<ReviewsCountResponse> {
		const reviewsCount = await this.reviewsService.getReviewsCount();
		return { reviewsCount };
	}
}
