import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import LogoSvg from '../svg/logo.svg';

const LinkWrapper = styled(Link)`
  width: 100%;
  height: 18rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  margin-bottom: 2rem;
`;

const LogoWrapper = styled.img`
  max-width: 75%;
`;

const Logo = () => {
  return (
    <LinkWrapper to={process.env.PUBLIC_URL + '/'}>
      <LogoWrapper src={LogoSvg} />
    </LinkWrapper>
  );
};

export default Logo;
