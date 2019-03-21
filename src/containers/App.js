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
import Cast from './Cast';

import NotFound from '../components/NotFound';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const MainWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  margin-left: 28rem;
  padding: 2rem 4rem;
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
                path="/"
                exact
                render={() => <Redirect from="/" to="/discover/Popular" />}
              />
              <Route path="/genres/:name" exact component={Genre} />
              <Route path="/discover/:name" exact component={Discover} />
              <Route path="/search/:query" exact component={Search} />
              <Route path="/movie/:id" exact component={Movie} />
              <Route path="/cast/:id" exact component={Cast} />
              <Route
                path="/404"
                component={() => (
                  <NotFound title="Upps!" subtitle={`This doesn't exist...`} />
                )}
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
