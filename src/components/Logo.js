import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

const LogoWrapper = styled(FontAwesomeIcon)`
  display: flex;
  margin: 0 auto;
  font-size: 6rem;
  text-transform: uppercase;
  color: var(--color-primary);
`;

const LinkWrapper = styled(Link)`
  width: 100%;
  text-decoration: none;
  padding: 2rem 3rem;
`;

const Logo = () => {
  return (
    <LinkWrapper to="/">
      <LogoWrapper icon={faFilm} />
    </LinkWrapper>
  );
};

export default Logo;
