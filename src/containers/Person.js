import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import queryString from 'query-string';
import history from '../history';
import { device } from '../utils/_devices';

import {
  getPerson,
  clearPerson,
  getMoviesforPerson,
  clearMoviesforPerson,
} from '../actions';
import NotFound from '../components/NotFound';
import Header from '../components/Header';
import Loader from '../components/Loader';
import MoviesList from '../components/MoviesList';
import Button from '../components/Button';
import PersonAvatar from '../svg/person.svg';

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
  opacity: ${props => (props.loaded ? '1' : '0')};
  visibility: ${props => (props.loaded ? 'visible' : 'hidden')};
  transition: all 600ms cubic-bezier(0.215, 0.61, 0.355, 1);

  @media only screen and ${device.largest} {
    max-width: 105rem;
  }

  @media only screen and ${device.larger} {
    max-width: 110rem;
    margin-bottom: 6rem;
  }

  @media only screen and ${device.large} {
    max-width: 110rem;
    margin-bottom: 5rem;
  }

  @media only screen and ${device.medium} {
    flex-direction: column;
    margin-bottom: 3rem;
  }
`;

const PersonDetails = styled.div`
  width: 60%;
  padding: 4rem;
  flex: 1 1 60%;

  @media only screen and ${device.largest} {
    padding: 3rem;
  }

  @media only screen and ${device.large} {
    padding: 2rem;
  }

  @media only screen and ${device.smaller} {
    padding: 1rem;
  }

  @media only screen and ${device.smallest} {
    padding: 0rem;
  }

  @media only screen and ${device.medium} {
    width: 100%;
    flex: 1 1 100%;
  }
`;

const ImageWrapper = styled.div`
  width: 40%;
  flex: 1 1 40%;
  padding: 4rem;

  @media only screen and ${device.largest} {
    padding: 3rem;
  }

  @media only screen and ${device.large} {
    padding: 2rem;
  }

  @media only screen and ${device.smaller} {
    margin-bottom: 2rem;
  }

  @media only screen and ${device.medium} {
    width: 60%;
    flex: 1 1 60%;
  }
`;

const MovieImg = styled.img`
  max-height: 100%;
  height: ${props => (props.error ? '58rem' : 'auto')};
  object-fit: ${props => (props.error ? 'contain' : 'cover')};
  padding: ${props => (props.error ? '2rem' : '')};
  max-width: 100%;
  border-radius: 0.8rem;
  box-shadow: ${props =>
    props.error ? 'none' : '0rem 2rem 5rem var(--shadow-color-dark);'};
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

  @media only screen and ${device.medium} {
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

  @media only screen and ${device.small} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeftButtons = styled.div`
  margin-right: auto;
  display: flex;

  @media only screen and ${device.small} {
    margin-bottom: 2rem;
  }

  & > *:not(:last-child) {
    margin-right: 2rem;

    @media only screen and ${device.large} {
      margin-right: 1rem;
    }
  }
`;

const AWrapper = styled.a`
  text-decoration: none;
`;

const Person = ({
  location,
  geral,
  match,
  getPerson,
  clearPerson,
  getMoviesforPerson,
  clearMoviesforPerson,
  person,
  moviesPerson,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { base_url } = geral.base.images;
  const params = queryString.parse(location.search);

  // Fetch person when id on url changes
  useEffect(() => {
    getPerson(match.params.id);
    window.scrollTo({
      top: (0, 0),
      behavior: 'smooth',
    });
    return () => clearPerson();
  }, [match.params.id]);

  // Fetch movies where person enters
  useEffect(() => {
    getMoviesforPerson(match.params.id, params.page);
    return () => clearMoviesforPerson();
  }, [params.page]);

  // If loading
  if (person.loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <PersonWrapper loaded={loaded ? 1 : 0}>
        <ImageWrapper>
          <MovieImg
            error={error ? 1 : 0}
            src={`${base_url}w780${person.profile_path}`}
            onLoad={() => setLoaded(true)}
            // If no image, error will occurr, we set error to true
            // And only change the src to the nothing svg if it isn't already, to avoid infinite callback
            onError={e => {
              setError(true);
              if (e.target.src !== `${PersonAvatar}`) {
                e.target.src = `${PersonAvatar}`;
              }
            }}
          />
        </ImageWrapper>
        <PersonDetails>
          <HeaderWrapper>
            <Header size="2" title={person.name} subtitle="" />
          </HeaderWrapper>
          <DetailsWrapper>
            {renderDate(person.birthday, person.deathday)}
          </DetailsWrapper>
          <Heading>The Biography</Heading>
          <Text>
            {person.biography
              ? person.biography
              : 'There is no biography available...'}
          </Text>
          <ButtonsWrapper>
            <LeftButtons>
              {renderWebsite(person.homepage)}
              {renderImdb(person.imdb_id)}
            </LeftButtons>
            {renderBack()}
          </ButtonsWrapper>
        </PersonDetails>
      </PersonWrapper>
      <Header title="Also enters in" subtitle="movies" />
      {renderPersonMovies(moviesPerson, base_url)}
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

// Render back button
function renderBack() {
  if (history.action === 'PUSH') {
    return (
      <div onClick={history.goBack}>
        <Button title="Back" solid left icon="arrow-left" />
      </div>
    );
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

// Render movies where person enters
function renderPersonMovies(moviesPerson, base_url) {
  if (moviesPerson.loading) {
    return <Loader />;
  } else if (moviesPerson.total_results === 0) {
    return <NotFound title="Sorry!" subtitle={`There are no more movies...`} />;
  } else {
    return <MoviesList movies={moviesPerson} baseUrl={base_url} />;
  }
}

// Get state from store and pass as props to component
const mapStateToProps = ({ person, geral, moviesPerson }) => ({
  person,
  geral,
  moviesPerson,
});

export default connect(
  mapStateToProps,
  { getPerson, clearPerson, getMoviesforPerson, clearMoviesforPerson }
)(Person);
