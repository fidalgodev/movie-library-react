import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import history from '../history';
import Loader from '../components/Loader';

import { getPerson } from '../actions';

const ImgWrapper = styled.img`
  width: 200px;
  height: auto;
`;

const Cast = ({ geral, match, person, getPerson }) => {
  const { base_url } = geral.base.images;

  // Fetch movie id when id on url changes
  useEffect(() => {
    getPerson(match.params.id);
  }, [match.params.id]);

  // If loading
  if (person.loading) {
    return <Loader />;
  }

  function renderBack() {
    if (history.action === 'PUSH') {
      return <button onClick={history.goBack}>Back</button>;
    }
  }

  return (
    <div>
      <h3>{person.name}</h3>
      <p>Biography: {person.biography}</p>
      <ImgWrapper src={`${base_url}/w780/${person.profile_path}`} />
      {renderBack()}
    </div>
  );
};

const mapStateToProps = ({ person, geral }) => {
  return { person, geral };
};

export default connect(
  mapStateToProps,
  { getPerson }
)(Cast);
