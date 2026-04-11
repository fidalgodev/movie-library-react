import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { fetchPerson, clearPerson } from '../slices/personSlice';
import { fetchMoviesForPerson, clearMoviesForPerson } from '../slices/moviesForPersonSlice';
import SortBy from '../components/SortBy';
import NotFound from '../components/NotFound';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';
import Button from '../components/Button';
import PersonAvatar from '../svg/person.svg';

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

const PortraitWrapper = styled.div`
  width: 100%;
  position: sticky;
  top: 2rem;

  @media ${(props) => props.theme.mediaQueries.medium} {
    position: static;
    max-width: 34rem;
    margin: 0 auto;
  }
`;

const PersonImg = styled.img`
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

const Name = styled.h1`
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

const KnownFor = styled.p`
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

const MetaItem = styled.span`
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

const Biography = styled.p`
  font-size: 1.4rem;
  line-height: 1.75;
  color: var(--link-color);
  white-space: pre-line;
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

const FilmographyHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 2rem;

  span {
    color: var(--color-primary-light);
    font-weight: 500;
  }
`;

const FilmographyControls = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

// Person Component
const Person = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgError, setImgError] = useState(false);
  const [option, setOption] = useState({
    value: 'popularity.desc',
    label: 'Popularity',
  });

  const { data: personData, loading } = useSelector((state) => state.person);
  const moviesForPerson = useSelector((state) => state.moviesForPerson);
  const base = useSelector((state) => state.config.base);
  const secure_base_url = base?.images?.secure_base_url ?? '';

  // Fetch person when id on url changes
  useEffect(() => {
    dispatch(fetchPerson(id));

    return () => {
      dispatch(clearPerson());
    };
  }, [id, dispatch]);

  // Fetch movies where person appears (re-fetch when sort option changes)
  useEffect(() => {
    dispatch(fetchMoviesForPerson({ id, page: 1, sort: option.value }));

    return () => {
      dispatch(clearMoviesForPerson());
    };
  }, [id, option, dispatch]);

  const canGoBack = window.history.state?.idx > 0;

  if (loading || !personData) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{`${personData.name} - Movie Library`}</title>
      </Helmet>
      <Hero>
        <PortraitWrapper>
          <PersonImg
            $error={imgError}
            src={`${secure_base_url}w780${personData.profile_path}`}
            alt={personData.name}
            // If no image, error will occur, we set imgError to true
            // And only change the src to the avatar svg if it isn't already, to avoid infinite callback
            onError={(e) => {
              setImgError(true);
              if (e.target.src !== `${PersonAvatar}`) {
                e.target.src = `${PersonAvatar}`;
              }
            }}
          />
        </PortraitWrapper>
        <DetailsColumn>
          <TitleBlock>
            <Name>{personData.name}</Name>
            {personData.known_for_department && (
              <KnownFor>Known for {personData.known_for_department}</KnownFor>
            )}
          </TitleBlock>

          {(personData.birthday || personData.place_of_birth) && (
            <MetaBar>
              {renderDate(personData.birthday, personData.deathday) && (
                <MetaItem>
                  {renderDate(personData.birthday, personData.deathday)}
                </MetaItem>
              )}
              {personData.place_of_birth && (
                <MetaItem>{personData.place_of_birth}</MetaItem>
              )}
            </MetaBar>
          )}

          <Section>
            <SectionHeading>Biography</SectionHeading>
            <Biography>
              {personData.biography
                ? personData.biography
                : 'There is no biography available...'}
            </Biography>
          </Section>

          <ButtonBar>
            {renderWebsite(personData.homepage)}
            {renderImdb(personData.imdb_id)}
            {canGoBack && (
              <BackButtonWrap onClick={() => navigate(-1)}>
                <Button title="Back" solid left icon="arrow-left" />
              </BackButtonWrap>
            )}
          </ButtonBar>
        </DetailsColumn>
      </Hero>

      <FilmographyHeading>
        Filmography <span>movies this person appears in</span>
      </FilmographyHeading>
      {renderPersonMovies(moviesForPerson, secure_base_url, option, setOption)}
    </Wrapper>
  );
};

function renderDate(birthday, deathday) {
  if (!birthday) {
    return null;
  } else if (birthday && deathday) {
    return `${birthday} — ${deathday}`;
  } else {
    return birthday;
  }
}

// Render website of person
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

// Render imdb profile of person
function renderImdb(id) {
  if (!id) {
    return null;
  }
  return (
    <AWrapper
      target="_blank"
      rel="noopener noreferrer"
      href={`https://www.imdb.com/name/${id}`}
    >
      <Button title="IMDB" icon={['fab', 'imdb']} />
    </AWrapper>
  );
}

// Render movies where person appears
function renderPersonMovies(moviesForPerson, base_url, option, setOption) {
  if (moviesForPerson.loading) {
    return <Loader />;
  } else if (moviesForPerson.total_results === 0) {
    return <NotFound title="Sorry!" subtitle="There are no more movies..." />;
  } else {
    return (
      <React.Fragment>
        <FilmographyControls>
          <SortBy option={option} setOption={setOption} />
        </FilmographyControls>
        <div id="scroll-to-element">
          <MoviesList movies={moviesForPerson} baseUrl={base_url} />
        </div>
      </React.Fragment>
    );
  }
}

export default Person;
