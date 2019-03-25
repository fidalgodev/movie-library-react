import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from '../history';
import { connect } from 'react-redux';
import { init } from '../actions';

import Sidebar from './Sidebar';
import Discover from './Discover';
import Genre from './Genre';
import Search from './Search';
import Movie from './Movie';
import Person from './Person';
import ShowError from './ShowError';

import NotFound from '../components/NotFound';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowLeft,
  faArrowRight,
  faHome,
  faCalendar,
  faPoll,
  faHeart,
  faDotCircle,
  faStar as fasFaStar,
  faSearch,
  faChevronRight,
  faChevronLeft,
  faLink,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

library.add(
  fab,
  faArrowLeft,
  faArrowRight,
  faHome,
  faCalendar,
  faPoll,
  faHeart,
  faDotCircle,
  fasFaStar,
  farFaStar,
  faSearch,
  faChevronRight,
  faChevronLeft,
  faLink,
  faPlay
);

const MainWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  user-select: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  fex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 4rem;

  @media ${props => props.theme.mediaQueries.larger} {
    margin-top: 2rem;
    padding: 6rem 2rem;
  }

  @media ${props => props.theme.mediaQueries.large} {
    padding: 6rem 3rem;
  }
`;

const App = ({ init, isLoading }) => {
  useEffect(() => {
    init();
  }, []);
  return isLoading ? (
    <ContentWrapper>
      <Loader />
    </ContentWrapper>
  ) : (
    <Router history={history}>
      <React.Fragment>
        <MainWrapper>
          <Sidebar />
          <ContentWrapper>
            <SearchBar />
            <Switch>
              <Route
                path={process.env.PUBLIC_URL + '/'}
                exact
                render={() => (
                  <Redirect
                    from={process.env.PUBLIC_URL + '/'}
                    to={process.env.PUBLIC_URL + '/discover/Popular'}
                  />
                )}
              />
              <Route
                path={process.env.PUBLIC_URL + '/genres/:name'}
                exact
                component={Genre}
              />
              <Route
                path={process.env.PUBLIC_URL + '/discover/:name'}
                exact
                component={Discover}
              />
              <Route
                path={process.env.PUBLIC_URL + '/search/:query'}
                exact
                component={Search}
              />
              <Route
                path={process.env.PUBLIC_URL + '/movie/:id'}
                exact
                component={Movie}
              />
              <Route
                path={process.env.PUBLIC_URL + '/person/:id'}
                exact
                component={Person}
              />
              <Route
                path="/404"
                component={() => (
                  <NotFound title="Upps!" subtitle={`This doesn't exist...`} />
                )}
              />
              <Route
                path={process.env.PUBLIC_URL + '/error'}
                component={ShowError}
              />
              <Route
                component={() => (
                  <NotFound title="Upps!" subtitle={`This doesn't exist...`} />
                )}
              />
            </Switch>
          </ContentWrapper>
        </MainWrapper>
      </React.Fragment>
    </Router>
  );
};

const mapStateToProps = ({ geral }) => {
  return { isLoading: geral.loading };
};

export default connect(
  mapStateToProps,
  { init }
)(App);
