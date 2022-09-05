import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
	const user1Id = 'user-1';
	const user2Id = 'user-2';
	const company1Id = 'company-1';
	const company2Id = 'company-2';

	let app: INestApplication;
	let prisma: DatabaseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DatabaseModule],
			controllers: [ReviewsController],
			providers: [ReviewsService],
		}).compile();

		app = module.createNestApplication();
		prisma = module.get<DatabaseService>(DatabaseService);
		await app.init();

		await prisma.$transaction([
			prisma.user.create({
				data: { id: user1Id, email: 'user1@example.com' },
			}),
			prisma.user.create({
				data: { id: user2Id, email: 'user2@example.com' },
			}),
			prisma.company.create({
				data: { id: company1Id, name: 'Test Company' },
			}),
			prisma.company.create({
				data: { id: company2Id, name: 'Test Company 2' },
			}),
			prisma.review.create({
				data: {
					id: '1',
					reviewerId: user1Id,
					companyId: company1Id,
					createdOn: '2020-01-01T00:00:00.000Z',
				},
			}),
			prisma.review.create({
				data: {
					id: '3',
					reviewerId: user2Id,
					companyId: company1Id,
					createdOn: '2022-01-01T00:00:00.000Z',
				},
			}),
			prisma.review.create({
				data: {
					id: '2',
					reviewerId: user2Id,
					companyId: company2Id,
					createdOn: '2021-01-01T00:00:00.000Z',
				},
			}),
		]);
	});

	afterEach(async () => {
		await prisma.review.deleteMany({ where: {} });
		await prisma.user.deleteMany({ where: {} });
		await prisma.company.deleteMany({ where: {} });
	});

	describe('getReviewsCount()', () => {
		it('should return number of reviews', async () => {
			const response = await request(app.getHttpServer()).get('/reviews/count');
			expect(response.status).toBe(200);
			expect(response.body.reviewsCount).toBe(3);
		});
	});

	describe('getReviews()', () => {
		it('should fetch all reviews', async () => {
			const response = await request(app.getHttpServer()).get('/reviews');
			expect(response.status).toBe(200);
			expect(response.body.reviews.length).toBe(3);
		});

		it('should fetch reviews in descending order by date', async () => {
			const response = await request(app.getHttpServer()).get('/reviews');
			expect(response.status).toBe(200);
			let inOrder = true;
			let lastDate = new Date();
			for (const review of response.body.reviews) {
				if (lastDate > new Date(review.createdOn)) {
					lastDate = new Date(review.createdOn);
				} else {
					inOrder = false;
					break;
				}
			}
			expect(inOrder).toBeTruthy();
		});

		it('should include user data with review', async () => {
			const response = await request(app.getHttpServer()).get('/reviews');
			expect(response.status).toBe(200);
			expect(response.body.reviews[0].user).toHaveProperty('firstName');
		});

		it('should include company data with review', async () => {
			const response = await request(app.getHttpServer()).get('/reviews');
			expect(response.status).toBe(200);
			expect(response.body.reviews[0].company).toHaveProperty('name');
		});

		// Feel free to add any additional tests you think are necessary
		it('should fetch 2 reviews', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?limit=2&page=1');
			expect(response.status).toBe(200);
			expect(response.body.reviews.length).toBe(2);
		});
	});
});
