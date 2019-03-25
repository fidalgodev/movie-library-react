import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import PersonAvatar from '../svg/person.svg';

const LinkWrapper = styled(Link)`
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.loaded ? '1' : '0')};
  visibility: ${props => (props.loaded ? 'visible' : 'hidden')};
`;

const MovieImg = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  background-color: transparent;
  transition: all 100ms cubic-bezier(0.645, 0.045, 0.355, 1);
`;

const CastItem = ({ person, baseUrl }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <LinkWrapper
      loaded={loaded ? 1 : 0}
      to={`${process.env.PUBLIC_URL}/person/${person.id}`}
    >
      <MovieImg
        src={`${baseUrl}w185${person.profile_path}`}
        // Image loaded, set loaded to true
        onLoad={() => setLoaded(true)}
        // If no image, error will occurr, we set error to true
        // And only change the src to the nothing svg if it isn't already, to avoid infinite callback
        onError={e => {
          if (e.target.src !== `${PersonAvatar}`) {
            e.target.src = `${PersonAvatar}`;
          }
        }}
      />
    </LinkWrapper>
  );
};

export default CastItem;
