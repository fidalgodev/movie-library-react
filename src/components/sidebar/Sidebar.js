import React from 'react';
import styled from 'styled-components';

import Genres from './Genres';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 25rem;
  background-color: #333;
  color: #fff;
  align-items: center;
`;

const Sidebar = props => {
  return (
    <Wrapper>
      <p>Top Rated</p>
      <p>Popular</p>
      <Genres />
    </Wrapper>
  );
};

export default Sidebar;
