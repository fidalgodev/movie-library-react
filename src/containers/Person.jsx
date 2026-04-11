import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Element, animateScroll as scroll } from 'react-scroll';

import { fetchPerson, clearPerson } from '../slices/personSlice';
import { fetchMoviesForPerson, clearMoviesForPerson } from '../slices/moviesForPersonSlice';
import SortBy from '../components/SortBy';
import NotFound from '../components/NotFound';
import Header from '../components/Header';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';
import Button from '../components/Button';
import PersonAvatar from '../svg/person.svg';
import Loading from '../components/Loading';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const PersonWrapper = styled.div`
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

const PersonDetails = styled.div`
  width: 60%;
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
    width: 100%;
    flex: 1 1 100%;
  }
`;

const ImageWrapper = styled.div`
  width: 40%;
  flex: 1 1 40%;
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
    width: 60%;
    flex: 1 1 60%;
  }
`;

const MovieImg = styled.img`
  max-height: 100%;
  height: ${(props) => (props.$error ? '58rem' : 'auto')};
  object-fit: ${(props) => (props.$error ? 'contain' : 'cover')};
  padding: ${(props) => (props.$error ? '2rem' : '')};
  max-width: 100%;
  border-radius: 0.8rem;
  box-shadow: ${(props) =>
    props.$error ? 'none' : '0rem 2rem 5rem var(--shadow-color-dark)'};
`;

const ImgLoading = styled.div`
  width: 100%;
  max-width: 40%;
  flex: 1 1 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: all 100ms cubic-bezier(0.645, 0.045, 0.355, 1);

  @media ${(props) => props.theme.mediaQueries.smaller} {
    height: 28rem;
  }
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
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 700;
  color: var(--color-primary);
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

// Person Component
const Person = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
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
    scroll.scrollToTop({
      smooth: true,
      delay: 500,
    });
    dispatch(fetchPerson(id));

    return () => {
      dispatch(clearPerson());
      setLoaded(false);
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

  // If loading or data not yet available
  if (loading || !personData) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Helmet>
        <title>{`${personData.name} - Movie Library`}</title>
      </Helmet>
      <PersonWrapper>
          {!loaded ? (
            <ImgLoading>
              <Loading />
            </ImgLoading>
          ) : null}
          <ImageWrapper style={!loaded ? { display: 'none' } : {}}>
            <MovieImg
              $error={imgError}
              src={`${secure_base_url}w780${personData.profile_path}`}
              onLoad={() => setLoaded(true)}
              // If no image, error will occur, we set imgError to true
              // And only change the src to the avatar svg if it isn't already, to avoid infinite callback
              onError={(e) => {
                setImgError(true);
                if (e.target.src !== `${PersonAvatar}`) {
                  e.target.src = `${PersonAvatar}`;
                }
              }}
            />
          </ImageWrapper>
          <PersonDetails>
            <HeaderWrapper>
              <Header size="2" title={personData.name} subtitle="" />
            </HeaderWrapper>
            <DetailsWrapper>
              {renderDate(personData.birthday, personData.deathday)}
            </DetailsWrapper>
            <Heading>The Biography</Heading>
            <Text>
              {personData.biography
                ? personData.biography
                : 'There is no biography available...'}
            </Text>
            <ButtonsWrapper>
              <LeftButtons>
                {renderWebsite(personData.homepage)}
                {renderImdb(personData.imdb_id)}
              </LeftButtons>
              {canGoBack && (
                <div onClick={() => navigate(-1)}>
                  <Button title="Back" solid left icon="arrow-left" />
                </div>
              )}
            </ButtonsWrapper>
          </PersonDetails>
        </PersonWrapper>
      <Header title="Also enters in" subtitle="movies" />
      {renderPersonMovies(moviesForPerson, secure_base_url, option, setOption)}
    </Wrapper>
  );
};

function renderDate(birthday, deathday) {
  if (!birthday) {
    return null;
  } else if (birthday && deathday) {
    return `${birthday} - ${deathday}`;
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
    <AWrapper target="_blank" href={link}>
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
    <AWrapper target="_blank" href={`https://www.imdb.com/name/${id}`}>
      <Button title="IMDB" icon={['fab', 'imdb']} />
    </AWrapper>
  );
}

// Render movies where person appears
function renderPersonMovies(moviesForPerson, base_url, option, setOption) {
  if (moviesForPerson.loading) {
    return <Loader />;
  } else if (moviesForPerson.total_results === 0) {
    return <NotFound title="Sorry!" subtitle={`There are no more movies...`} />;
  } else {
    return (
      <React.Fragment>
        <SortBy option={option} setOption={setOption} />
        <Element name="scroll-to-element">
          <MoviesList movies={moviesForPerson} baseUrl={base_url} />
        </Element>
      </React.Fragment>
    );
  }
}

export default Person;
