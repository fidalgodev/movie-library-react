import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalVideo from 'react-modal-video';

import { fetchMovie, fetchCredits, clearMovie } from '../slices/movieSlice';
import { fetchRecommendations, clearRecommendations } from '../slices/recommendationsSlice';
import Rating from '../components/Rating';
import NotFound from '../components/NotFound';
import Header from '../components/Header';
import Cast from '../components/Cast';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';
import Button from '../components/Button';
import NothingSvg from '../svg/nothing.svg';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const MovieWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  margin-bottom: 7rem;
  transition: all 600ms cubic-bezier(0.215, 0.61, 0.355, 1);

  @media ${(props) => props.theme.mediaQueries.largest} {
    max-width: 105rem;
  }

  @media ${(props) => props.theme.mediaQueries.larger} {
    max-width: 110rem;
    margin-bottom: 6rem;
  }

  @media ${(props) => props.theme.mediaQueries.large} {
    max-width: 110rem;
    margin-bottom: 5rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    flex-direction: column;
    margin-bottom: 5rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-primary-light);
  text-transform: uppercase;
  padding: 0.5rem 0rem;
  transition: all 300ms cubic-bezier(0.075, 0.82, 0.165, 1);

  &:not(:last-child) {
    margin-right: 2rem;
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
  flex-wrap: wrap;
`;

const MovieDetails = styled.div`
  width: 100%;
  max-width: 60%;
  padding: 4rem;
  flex: 1 1 60%;

  @media ${(props) => props.theme.mediaQueries.largest} {
    padding: 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.smaller} {
    padding: 1rem;
  }

  @media ${(props) => props.theme.mediaQueries.smallest} {
    padding: 0rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    max-width: 100%;
    flex: 1 1 100%;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 40%;
  flex: 1 1 40%;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 4rem;

  @media ${(props) => props.theme.mediaQueries.largest} {
    padding: 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.smaller} {
    margin-bottom: 2rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    max-width: 60%;
    flex: 1 1 60%;
  }
`;

const MovieImg = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: ${(props) => (props.$error ? 'contain' : 'cover')};
  padding: ${(props) => (props.$error ? '2rem' : '')};
  border-radius: 0.8rem;
  background-color: var(--color-primary-lighter);
  box-shadow: ${(props) =>
    props.$error ? 'none' : '0rem 2rem 5rem var(--shadow-color-dark)'};
`;

const HeaderWrapper = styled.div`
  margin-bottom: 2rem;
`;

const Heading = styled.h3`
  color: var(--color-primary-dark);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
  font-size: 1.4rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    font-size: 1.2rem;
  }
`;

const DetailsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5rem;
`;

const RatingsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;

const RatingNumber = styled.p`
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 700;
  color: var(--color-primary);
`;

const Info = styled.div`
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  color: var(--color-primary-lighter);
  font-size: 1.3rem;
`;

const Text = styled.p`
  font-size: 1.4rem;
  line-height: 1.8;
  color: var(--link-color);
  font-weight: 500;
  margin-bottom: 3rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;

  @media ${(props) => props.theme.mediaQueries.small} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeftButtons = styled.div`
  margin-right: auto;
  display: flex;

  @media ${(props) => props.theme.mediaQueries.small} {
    margin-bottom: 2rem;
  }

  & > *:not(:last-child) {
    margin-right: 2rem;

    @media ${(props) => props.theme.mediaQueries.large} {
      margin-right: 1rem;
    }
  }
`;

const AWrapper = styled.a`
  text-decoration: none;
`;

// Movie Component
const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);

  const { data, cast, loading } = useSelector((state) => state.movie);
  const recommendations = useSelector((state) => state.recommendations);
  const base = useSelector((state) => state.config.base);
  const secure_base_url = base?.images?.secure_base_url ?? '';

  useEffect(() => {
    dispatch(fetchMovie(id));
    dispatch(fetchCredits(id));
    dispatch(fetchRecommendations({ id, page: 1 }));

    return () => {
      dispatch(clearMovie());
      dispatch(clearRecommendations());
    };
  }, [id, dispatch]);

  const canGoBack = window.history.state?.idx > 0;

  // If loading or data not yet available
  if (loading || !data) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{`${data.title} - Movie Library`}</title>
      </Helmet>
      <MovieWrapper>
          <ImageWrapper>
            <MovieImg
              $error={imgError}
              src={`${secure_base_url}w780${data.poster_path}`}
              alt={data.title}
              // If no image, error will occur, we set imgError to true
              // And only change the src to the nothing svg if it isn't already, to avoid infinite callback
              onError={(e) => {
                setImgError(true);
                if (e.target.src !== `${NothingSvg}`) {
                  e.target.src = `${NothingSvg}`;
                }
              }}
            />
          </ImageWrapper>
          <MovieDetails>
            <HeaderWrapper>
              <Header size="2" title={data.title} subtitle={data.tagline} />
            </HeaderWrapper>
            <DetailsWrapper>
              <RatingsWrapper>
                <Rating number={data.vote_average / 2} />
                <RatingNumber>{data.vote_average}</RatingNumber>
              </RatingsWrapper>
              <Info>
                {renderInfo(
                  data.spoken_languages,
                  data.runtime,
                  splitYear(data.release_date)
                )}
              </Info>
            </DetailsWrapper>
            <Heading>The Genres</Heading>
            <LinksWrapper>{renderGenres(data.genres)}</LinksWrapper>
            <Heading>The Synopsis</Heading>
            <Text>
              {data.overview
                ? data.overview
                : 'There is no synopsis available...'}
            </Text>
            <Heading>The Cast</Heading>
            <Cast cast={cast} baseUrl={secure_base_url} />
            <ButtonsWrapper>
              <LeftButtons>
                {renderWebsite(data.homepage)}
                {renderImdb(data.imdb_id)}
                {renderTrailer(
                  data.videos?.results ?? [],
                  modalOpened,
                  setModalOpened
                )}
              </LeftButtons>
              {canGoBack && (
                <div onClick={() => navigate(-1)}>
                  <Button title="Back" solid left icon="arrow-left" />
                </div>
              )}
            </ButtonsWrapper>
          </MovieDetails>
        </MovieWrapper>
      <Header title="Recommended" subtitle="movies" />
      {renderRecommended(recommendations, secure_base_url)}
    </Wrapper>
  );
};

// Render Personal Website button
function renderWebsite(link) {
  if (!link) {
    return null;
  }
  return (
    <AWrapper target="_blank" href={link}>
      <Button title="Website" icon="link" />
    </AWrapper>
  );
}

// Render IMDB button
function renderImdb(id) {
  if (!id) {
    return null;
  }
  return (
    <AWrapper target="_blank" href={`https://www.imdb.com/title/${id}`}>
      <Button title="IMDB" icon={['fab', 'imdb']} />
    </AWrapper>
  );
}

// Render Trailer button. On click triggers state to open modal of trailer
function renderTrailer(videos, modalOpened, setModalOpened) {
  if (!videos || videos.length === 0) {
    return;
  }
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  if (!trailer) {
    return;
  }
  const { key } = trailer;
  return (
    <React.Fragment>
      <div onClick={() => setModalOpened(true)}>
        <Button title="Trailer" icon="play" />
      </div>
      <ModalVideo
        channel="youtube"
        isOpen={modalOpened}
        videoId={key}
        onClose={() => setModalOpened(false)}
      />
    </React.Fragment>
  );
}

// Function to get the year only from the date
function splitYear(date) {
  if (!date) {
    return;
  }
  const [year] = date.split('-');
  return year;
}

// Render info of movie
function renderInfo(languages, time, data) {
  const info = [];
  if (languages && languages.length !== 0) {
    info.push(languages[0].name);
  }
  info.push(time, data);
  return info
    .filter((el) => el !== null && el !== undefined)
    .map((el) => (typeof el === 'number' ? `${el} min.` : el))
    .map((el, i, array) => (i !== array.length - 1 ? `${el} / ` : el));
}

// Render recommended movies
function renderRecommended(recommended, base_url) {
  if (recommended.loading) {
    return <Loader />;
  } else if (recommended.total_results === 0) {
    return (
      <NotFound
        title="Sorry!"
        subtitle={`There are no recommended movies...`}
      />
    );
  } else {
    return (
      <div id="scroll-to-element">
        <MoviesList movies={recommended} baseUrl={base_url} />
      </div>
    );
  }
}

// Render Genres with links
function renderGenres(genres) {
  if (!genres) return null;
  return genres.map((genre) => (
    <StyledLink
      to={`/genres/${genre.name}`}
      key={genre.id}
    >
      <FontAwesomeIcon
        icon="dot-circle"
        size="1x"
        style={{ marginRight: '5px' }}
      />
      {genre.name}
    </StyledLink>
  ));
}

export default Movie;
