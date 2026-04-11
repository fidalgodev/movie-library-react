import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';

import { clearError } from '../slices/errorsSlice';
import ErrorSvg from '../svg/error.svg';
import Button from '../components/Button';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  @media ${(props) => props.theme.mediaQueries.medium} {
    width: 65%;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  margin-bottom: 6rem;
`;

const Title = styled.h1`
  color: var(--color-primary);
  font-weight: 300;
  font-size: 3.5rem;
`;

const SubTitle = styled.h2`
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.8rem;
`;

const Svg = styled.img`
  max-width: 100%;
  height: 35vh;
  margin-bottom: 6rem;
`;

const ShowError = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.errors);

  // Dispatch clearError BEFORE navigating so RouteGuard sees null error
  // and doesn't redirect back to /error in a loop.
  const handleHomeClick = useCallback(() => {
    dispatch(clearError());
    scroll.scrollToTop({ smooth: true });
    navigate('/');
  }, [dispatch, navigate]);

  return (
    <Wrapper>
      <Helmet>
        <title>Oooops!</title>
      </Helmet>
      <TitleWrapper>
        <Title>Something went wrong!</Title>
        <SubTitle>{error?.message ?? 'Something went wrong'}</SubTitle>
      </TitleWrapper>
      <Svg src={`${ErrorSvg}`} alt="Not found" />
      <div onClick={handleHomeClick}>
        <Button title="Home" solid icon="home" left />
      </div>
    </Wrapper>
  );
};

export default ShowError;
