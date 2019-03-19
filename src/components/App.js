import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from '../history';
import { connect } from 'react-redux';
import { getConfig, getGenres } from '../actions';

import Sidebar from '../containers/Sidebar';
import Discover from '../containers/Discover';
import Genre from '../containers/Genre';
import Search from '../containers/Search';
import Movie from '../containers/Movie';
import Cast from '../containers/Cast';

import NotFound from './NotFound';
import Header from './Header';
import Loader from './Loader';

const MainWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  width: 100%;
  margin-left: 28rem;
  padding: 2rem 4rem;
`;

const LoaderWrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const App = props => {
  useEffect(() => {
    props.getConfig();
    props.getGenres();
  }, []);

  return props.base && props.genres ? (
    <Router history={history}>
      <React.Fragment>
        <MainWrapper>
          <Sidebar />
          <ContentWrapper>
            <Header />
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
              <Route path="/404" component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </ContentWrapper>
        </MainWrapper>
      </React.Fragment>
    </Router>
  ) : (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  );
};

const mapStateToProps = ({ geral }) => {
  return { base: geral.base, genres: geral.genres };
};

export default connect(
  mapStateToProps,
  { getConfig, getGenres }
)(App);
