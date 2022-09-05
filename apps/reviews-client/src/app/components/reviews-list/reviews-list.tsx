import { Stack, Typography } from '@mui/material';
import { ReviewProps, ReviewCard } from '../review/review';

export interface ReviewsListProps {
	reviews: ReviewProps[];
}

export function ReviewsList(props: ReviewsListProps) {
	if (props.reviews.length === 0) {
		return <Typography>No reviews found</Typography>;
	}
	return (
		<Stack spacing={1}>
			{props.reviews.map((review) => {
				return <ReviewCard key={review.id} {...review} />;
			})}
		</Stack>
	);
}

export default ReviewsList;
