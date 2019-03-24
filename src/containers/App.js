import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from '../history';
import { connect } from 'react-redux';
import { init } from '../actions';
import StickyBox from 'react-sticky-box';

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
  align-items: flex-start;
  user-select: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 4rem;
  margin-top: 2rem;
  position: relative;
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
          <StickyBox>
            <Sidebar />
          </StickyBox>
          <ContentWrapper>
            <SearchBar />
            <Switch>
              <Route
                path="/"
                exact
                render={() => <Redirect from="/" to="/discover/Popular" />}
              />
              <Route path="/genres/:name" exact component={Genre} />
              <Route path="/discover/:name" exact component={Discover} />
              <Route path="/search/:query" exact component={Search} />
              <Route path="/movie/:id" exact component={Movie} />
              <Route path="/person/:id" exact component={Person} />
              <Route
                path="/404"
                component={() => (
                  <NotFound title="Upps!" subtitle={`This doesn't exist...`} />
                )}
              />
              <Route path="/error" component={ShowError} />
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
