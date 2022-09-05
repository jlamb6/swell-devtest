import { Container, Pagination, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import WebFont from 'webfontloader';
import Header from './components/header/header';
import ReviewsList from './components/reviews-list/reviews-list';
import { theme } from './theme';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { PulseLoader } from 'react-spinners';

WebFont.load({
	google: {
		families: ['Montserrat:500,600,700'],
	},
});

export function App() {
	const [count, setCount] = useState(0);
	const [reviews, setReviews] = useState([]);
	const [page, setPage] = useState(1);
	const [loadingReviews, setLoadingReviews] = useState(true);

	const getCount = useCallback(() => {
		axios
			.get('/api/reviews/count')
			.then((res) => res.data)
			.then(({ reviewsCount }) => {
				setCount(reviewsCount);
			});
	}, []);

	const getAllReviews = useCallback(() => {
		setLoadingReviews(true);
		axios
			.get(`/api/reviews?limit=10&page=${page}`)
			.then((res) => res.data)
			.then(async ({ reviews }) => {
				setReviews(reviews);
			})
			.catch((err) => {
				setReviews([]);
			})
			.finally(() => setLoadingReviews(false));
	}, [page]);

	const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	useEffect(() => {
		getCount();
		getAllReviews();
	}, [getCount, getAllReviews]);

	return (
		<ThemeProvider theme={theme}>
			<Header />
			<Container sx={{ mt: 2, typography: 'body1' }}>
				{loadingReviews ? (
					<Box
						alignItems={'center'}
						justifyContent="center"
						width={'100%'}
						height="100%"
						mt={'calc(40vh)'}
					>
						<PulseLoader color="#e11979" css={{ margin: 'auto', width: 'fit-content' }} />
					</Box>
				) : (
					<>
						<ReviewsList reviews={reviews} />
						<Pagination sx={{ mt: 2 }} count={count / 10} page={page} onChange={handleChange} />
					</>
				)}
			</Container>
		</ThemeProvider>
	);
}

export default App;
