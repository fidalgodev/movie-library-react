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
import Cast from '../components/Cast';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';
import Button from '../components/Button';
import NothingSvg from '../svg/nothing.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: minmax(26rem, 34rem) 1fr;
  gap: 5rem;
  margin-bottom: 6rem;
  align-items: start;

  @media ${(props) => props.theme.mediaQueries.large} {
    gap: 3.5rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    grid-template-columns: 1fr;
    max-width: 52rem;
    margin-left: auto;
    margin-right: auto;
    gap: 3rem;
  }
`;

const PosterWrapper = styled.div`
  width: 100%;
  position: sticky;
  top: 2rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    position: static;
    max-width: 34rem;
    margin: 0 auto;
  }
`;

const MovieImg = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: ${(props) => (props.$error ? 'contain' : 'cover')};
  padding: ${(props) => (props.$error ? '2rem' : '0')};
  border-radius: 1rem;
  background-color: var(--color-primary-lighter);
  box-shadow: ${(props) =>
    props.$error ? 'none' : '0 2rem 4rem var(--shadow-color-dark)'};
  display: block;
`;

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TitleBlock = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3.6rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-primary-dark);
  margin-bottom: 0.8rem;

  @media ${(props) => props.theme.mediaQueries.large} {
    font-size: 3.2rem;
  }

  @media ${(props) => props.theme.mediaQueries.medium} {
    font-size: 2.8rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  color: var(--color-primary-light);
  line-height: 1.4;
`;

const MetaBar = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.6rem 0;
  margin-bottom: 2.8rem;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
`;

const RatingBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-primary);
`;

const RatingNumber = styled.span`
  font-weight: 700;
  font-size: 1.3rem;
`;

const Info = styled.span`
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--color-primary-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Section = styled.section`
  margin-bottom: 2.8rem;
`;

const SectionHeading = styled.h3`
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-primary-light);
  opacity: 0.75;
  margin-bottom: 1.2rem;
`;

const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const GenreChip = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.7rem 1.4rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  background-color: rgba(38, 50, 56, 0.06);
  border-radius: 2rem;
  text-decoration: none;
  transition: all 200ms ease;

  &:hover {
    background-color: var(--color-primary-dark);
    color: var(--text-color);
    transform: translateY(-2px);
  }
`;

const Synopsis = styled.p`
  font-size: 1.4rem;
  line-height: 1.75;
  color: var(--link-color);
`;

const ButtonBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 1rem;
`;

const BackButtonWrap = styled.div`
  margin-left: auto;

  @media ${(props) => props.theme.mediaQueries.small} {
    margin-left: 0;
  }
`;

const AWrapper = styled.a`
  text-decoration: none;
`;

const RecommendedHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 2rem;

  span {
    color: var(--color-primary-light);
    font-weight: 500;
  }
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
      <Hero>
        <PosterWrapper>
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
        </PosterWrapper>
        <DetailsColumn>
          <TitleBlock>
            <Title>{data.title}</Title>
            {data.tagline && <Tagline>{data.tagline}</Tagline>}
          </TitleBlock>
          <MetaBar>
            <RatingBlock>
              <Rating number={data.vote_average / 2} />
              <RatingNumber>{data.vote_average?.toFixed(1)}</RatingNumber>
            </RatingBlock>
            <Info>{renderInfo(data.spoken_languages, data.runtime, splitYear(data.release_date))}</Info>
          </MetaBar>

          {data.genres && data.genres.length > 0 && (
            <Section>
              <SectionHeading>Genres</SectionHeading>
              <GenreList>
                {data.genres.map((genre) => (
                  <GenreChip to={`/genres/${genre.name}`} key={genre.id}>
                    {genre.name}
                  </GenreChip>
                ))}
              </GenreList>
            </Section>
          )}

          <Section>
            <SectionHeading>Synopsis</SectionHeading>
            <Synopsis>
              {data.overview ? data.overview : 'There is no synopsis available...'}
            </Synopsis>
          </Section>

          {cast && cast.length > 0 && (
            <Section>
              <SectionHeading>Cast</SectionHeading>
              <Cast cast={cast} baseUrl={secure_base_url} />
            </Section>
          )}

          <ButtonBar>
            {renderWebsite(data.homepage)}
            {renderImdb(data.imdb_id)}
            {renderTrailer(
              data.videos?.results ?? [],
              modalOpened,
              setModalOpened
            )}
            {canGoBack && (
              <BackButtonWrap onClick={() => navigate(-1)}>
                <Button title="Back" solid left icon="arrow-left" />
              </BackButtonWrap>
            )}
          </ButtonBar>
        </DetailsColumn>
      </Hero>

      <RecommendedHeading>
        Recommended <span>movies</span>
      </RecommendedHeading>
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
    <AWrapper target="_blank" rel="noopener noreferrer" href={link}>
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
    <AWrapper
      target="_blank"
      rel="noopener noreferrer"
      href={`https://www.imdb.com/title/${id}`}
    >
      <Button title="IMDB" icon={['fab', 'imdb']} />
    </AWrapper>
  );
}

// Render Trailer button. On click triggers state to open modal of trailer
function renderTrailer(videos, modalOpened, setModalOpened) {
  if (!videos || videos.length === 0) {
    return null;
  }
  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  if (!trailer) {
    return null;
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
    return null;
  }
  const [year] = date.split('-');
  return year;
}

// Render info of movie — language / runtime / year, joined by dots
function renderInfo(languages, time, year) {
  const info = [];
  if (languages && languages.length !== 0) {
    info.push(languages[0].name);
  }
  if (typeof time === 'number') {
    info.push(`${time} min`);
  }
  if (year) {
    info.push(year);
  }
  return info.join(' • ');
}

// Render recommended movies
function renderRecommended(recommended, base_url) {
  if (recommended.loading) {
    return <Loader />;
  } else if (recommended.total_results === 0) {
    return (
      <NotFound
        title="Sorry!"
        subtitle="There are no recommended movies..."
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

export default Movie;
