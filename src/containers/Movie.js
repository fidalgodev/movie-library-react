import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import Stars from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as starSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as starRegular } from '@fortawesome/free-regular-svg-icons';

import {
  getMovie,
  getRecommendations,
  clearRecommendations,
  clearMovie,
} from '../actions';
import Credits from '../components/Credits';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1;
  opacity: 0.6;
  color: var(--color-primary-light);

  &:not(:last-child) {
    margin-right: 2rem;
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MovieWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 2rem;
`;

const MovieDetails = styled.div`
  width: 100%;
  padding: 2rem;
  flex: 1;
`;

const ImageWrapper = styled.div`
  flex: 1;
  padding: 2rem;
`;

const MovieImg = styled.img`
  max-height: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 0.8rem;
  object-fit: cover;
  box-shadow: 0rem 2rem 5rem var(--shadow-color-dark);
`;

const HeaderWrapper = styled.div`
  margin: 2rem 0rem;
`;

const Title = styled.h1`
  text-transform: uppercase;
  font-weight: 300;
  font-size: 3rem;
  line-height: 1;
  color: var(--color-primary);
`;

const SubTitle = styled.h2`
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--color-primary);
`;

const DetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4rem;
`;

const RatingsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

const Rating = styled(Stars)`
  line-height: 1;
`;

const RatingNumber = styled.p`
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 700;
  color: var(--color-primary);
`;

const FontAwesome = styled(FontAwesomeIcon)`
  color: var(--color-primary);
`;

const Info = styled.div`
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  color: var(--color-primary-light);
  font-size: 1.1rem;
`;

const Movie = ({
  location,
  geral,
  match,
  movie,
  getMovie,
  clearMovie,
  recommended,
  getRecommendations,
  clearRecommendations,
}) => {
  const { base_url } = geral.base.images;
  const params = queryString.parse(location.search);

  // Fetch movie id when id on url changes
  useEffect(() => {
    getMovie(match.params.id);
    return () => clearMovie();
  }, [match.params.id]);

  // Fetch recommended movies everytime recommendations page change
  useEffect(() => {
    getRecommendations(match.params.id, params.page);
    return () => clearRecommendations();
  }, [params.page]);

  // If loading
  if (movie.loading) {
    return <Loader />;
  }

  function renderBack() {
    if (history.action === 'PUSH') {
      return <button onClick={history.goBack}>Back</button>;
    }
  }

  return (
    <React.Fragment>
      <MovieWrapper>
        <ImageWrapper>
          <MovieImg src={`${base_url}original${movie.poster_path}`} />
        </ImageWrapper>
        <MovieDetails>
          <HeaderWrapper>
            <Title>{movie.title}</Title>
            <SubTitle>{movie.tagline}</SubTitle>
          </HeaderWrapper>
          <DetailsWrapper>
            <RatingsWrapper>
              <Rating
                emptySymbol={
                  <FontAwesome
                    icon={starRegular}
                    size="lg"
                    style={{ marginRight: '10px' }}
                  />
                }
                fullSymbol={
                  <FontAwesome
                    icon={starSolid}
                    size="lg"
                    style={{ marginRight: '10px' }}
                  />
                }
                initialRating={movie.vote_average / 2}
                readonly
              />
              <RatingNumber>{movie.vote_average} </RatingNumber>
            </RatingsWrapper>
            <Info>
              {`${movie.spoken_languages[0].name} / ${
                movie.runtime
              } min / ${splitYear(movie.release_date)}`}
            </Info>
          </DetailsWrapper>
          <LinksWrapper>{renderGenres(movie.genres)}</LinksWrapper>
          <p>{movie.overview}</p>
          <Credits cast={movie.cast} baseUrl={base_url} />
          {renderBack()}
        </MovieDetails>
      </MovieWrapper>
      <h1> Recommended movies based on this:</h1>
      {recommended.loading ? (
        <Loader />
      ) : (
        <MoviesList movies={recommended} baseUrl={base_url} />
      )}
    </React.Fragment>
  );
};

// Function to get the year only from the date
function splitYear(date) {
  const [year] = date.split('-');
  return year;
}

function renderGenres(genres) {
  return genres.map(genre => (
    <StyledLink to={`/genres/${genre.name}`}>{genre.name}</StyledLink>
  ));
}

const mapStateToProps = ({ movie, geral, recommended }) => ({
  movie,
  geral,
  recommended,
});

export default connect(
  mapStateToProps,
  { getMovie, clearMovie, getRecommendations, clearRecommendations }
)(Movie);
