import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ImgWrapper = styled.img`
  width: 200px;
  height: auto;
`;

const Credits = ({ cast, baseUrl }) => {
  if (!cast) {
    return <div>Loading</div>;
  }
  return cast.map(person => (
    <Link to={`/cast/${person.id}`} key={person.id}>
      <h3>{person.name}</h3>
      <p>Featuring: {person.character}</p>
      <ImgWrapper src={`${baseUrl}w780${person.profile_path}`} />
    </Link>
  ));
};

export default Credits;
