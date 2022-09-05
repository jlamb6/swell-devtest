import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { Star, StarHalf, StarOutline } from '@mui/icons-material';
import { Review, User, Company } from '@prisma/client';
import moment from 'moment-mini';
import React from 'react';

export interface ReviewProps extends Review {
	user: User;
	company: Company;
}

export function ReviewCard(props: ReviewProps) {
	const getUsersFullName = (user: User): string => {
		const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`;
		if (!user || name.trim().length === 0) return 'Anonymous';
		return name;
	};
	const getRelativeTime = (time: string): string => {
		return moment(time).fromNow();
	};
	const getStarRating = (rating: number | null) => {
		const ratingInStars = [
			<StarOutline />,
			<StarOutline />,
			<StarOutline />,
			<StarOutline />,
			<StarOutline />,
		];
		if (rating) {
			const isHalf = rating - Math.floor(rating) > 0;
			ratingInStars.fill(<Star />, 0, Math.floor(rating - 1));
			if (isHalf) ratingInStars[Math.floor(rating)] = <StarHalf />;
		}

		return (
			<React.Fragment>
				{ratingInStars.map((Star, index) =>
					React.cloneElement(Star, { key: index, fontSize: 'small' }),
				)}
			</React.Fragment>
		);
	};

	return (
		<Card data-testid={'reviewCard'}>
			<CardContent>
				<Typography variant="h2">{getUsersFullName(props.user)}</Typography>
				<Typography variant="subtitle2">{getRelativeTime(props.createdOn)}</Typography>
				<Typography>Company - {props.company.name}</Typography>
				<Typography>{getStarRating(props.rating)}</Typography>
				<Typography>{props.reviewText}</Typography>
			</CardContent>
			<CardActions></CardActions>
		</Card>
	);
}

export default ReviewCard;
