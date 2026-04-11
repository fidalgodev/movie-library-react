import { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { bootstrap } from './slices/configSlice';
import RouteGuard from './RouteGuard';

import Sidebar from './containers/Sidebar';
import MenuMobile from './containers/MenuMobile';
import Discover from './containers/Discover';
import Genre from './containers/Genre';
import Search from './containers/Search';
import Movie from './containers/Movie';
import Person from './containers/Person';
import ShowError from './containers/ShowError';

import NotFound from './components/NotFound';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';

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
  flex-direction: ${(props) => (props.$isMobile ? 'column' : 'row')};
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 4rem;

  @media ${(props) => props.theme.mediaQueries.larger} {
    padding: 6rem 3rem;
  }

  @media ${(props) => props.theme.mediaQueries.large} {
    padding: 4rem 2rem;
  }
`;

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2rem;
`;

const App = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.config.loading);
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    dispatch(bootstrap());
  }, [dispatch]);

  useEffect(() => {
    const changeMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 80em)').matches);
    };
    changeMobile();
    window.addEventListener('resize', changeMobile);
    return () => window.removeEventListener('resize', changeMobile);
  }, []);

  if (isLoading) {
    return (
      <ContentWrapper>
        <Loader />
      </ContentWrapper>
    );
  }

  return (
    <Fragment>
      <RouteGuard />
      <MainWrapper $isMobile={isMobile}>
        {isMobile ? (
          <MenuMobile />
        ) : (
          <>
            <Sidebar />
            <SearchBarWrapper>
              <SearchBar />
            </SearchBarWrapper>
          </>
        )}
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Navigate replace to="/discover/Popular" />} />
            <Route path="/genres/:name" element={<Genre />} />
            <Route path="/discover/:name" element={<Discover />} />
            <Route path="/search/:query" element={<Search />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route path="/person/:id" element={<Person />} />
            <Route path="/error" element={<ShowError />} />
            <Route
              path="*"
              element={<NotFound title="Upps!" subtitle="This doesn't exist..." />}
            />
          </Routes>
        </ContentWrapper>
      </MainWrapper>
    </Fragment>
  );
};

export default App;
