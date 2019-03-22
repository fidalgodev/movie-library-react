import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import NothingSvg from '../svg/nothing.svg';
import Header from '../components/Header';
import Button from '../components/Button';

import Stars from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as starSolid,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons';
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
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary-light);
  text-transform: uppercase;
  padding: 0.5rem 0rem;
  transition: all 300ms cubic-bezier(0.075, 0.82, 0.165, 1);

  &:not(:last-child) {
    margin-right: 3rem;
  }

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(2px);
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
`;

const MovieWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 120rem;
  margin: 2rem auto;
  opacity: ${props => (props.loaded ? '1' : '0')};
  visibility: ${props => (props.loaded ? 'visible' : 'hidden')};
  transition: all 600ms cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const MovieDetails = styled.div`
  width: 60%;
  padding: 5rem;
  flex: 1 1 60%;
`;

const ImageWrapper = styled.div`
  width: 40%;
  flex: 1 1 40%;
  padding: 5rem;
`;

const MovieImg = styled.img`
  max-height: 100%;
  height: ${props => (props.error ? '58rem' : 'auto')};
  object-fit: ${props => (props.error ? 'contain' : 'cover')};
  padding: ${props => (props.error ? '4rem' : '')};
  max-width: 100%;
  border-radius: 0.8rem;
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

const Heading = styled.h3`
  color: var(--color-primary-dark);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const DetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
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
  color: var(--color-primary-lighter);
  font-size: 1.2rem;
`;

const Text = styled.p`
  font-size: 1.3rem;
  line-height: 1.6;
  color: var(--link-color);
  font-weight: 500;
  margin-bottom: 3rem;
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
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
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
      return (
        <Button solid left to={''} onClick={history.goBack}>
          Back
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      <MovieWrapper loaded={loaded ? 1 : 0}>
        <ImageWrapper>
          <MovieImg
            error={error ? 1 : 0}
            src={`${base_url}original${movie.poster_path}`}
            onLoad={() => setLoaded(true)}
            // If no image, error will occurr, we set error to true
            // And only change the src to the nothing svg if it isn't already, to avoid infinite callback
            onError={e => {
              setError(true);
              if (e.target.src !== `${NothingSvg}`) {
                e.target.src = `${NothingSvg}`;
              }
            }}
          />
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
          <Heading>The Genres</Heading>
          <LinksWrapper>{renderGenres(movie.genres)}</LinksWrapper>
          <Heading>The Synopsis</Heading>
          <Text>{movie.overview}</Text>
          <Heading>The Cast</Heading>
          <Credits cast={movie.cast} baseUrl={base_url} />
          {renderBack()}
        </MovieDetails>
      </MovieWrapper>
      <Header title="Recommended" subtitle="movies" />
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
    <StyledLink to={`/genres/${genre.name}`} key={genre.id}>
      <FontAwesomeIcon
        icon={faDotCircle}
        size="1x"
        style={{ marginRight: '5px' }}
      />
      {genre.name}
    </StyledLink>
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
