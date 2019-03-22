import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Button from './Button';

const Wrapper = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: ${props => {
    if (props.type === 'one') {
      return 'flex-start';
    } else if (props.type === 'both') {
      return 'space-between';
    } else {
      return 'flex-end';
    }
  }};
  margin-bottom: 2rem;
`;

const Pagination = ({ movies }) => {
  const { page, total_pages } = movies;

  // If only 1 page
  if (total_pages === 1) {
    return null;
  }

  // On first page, render page 2 button
  if (page < total_pages && page === 1) {
    return (
      <Wrapper to={`?page=${page + 1}`}>
        <Button solid title={`Page ${page + 1}`} icon="arrow-right" />
      </Wrapper>
    );
  }

  // There is a next and a previous page, render accordingly
  else if (page < total_pages) {
    return (
      <Wrapper type="both" to={`?page=${page - 1}`}>
        <Button solid left title={`Page ${page - 1}`} icon="arrow-left" />
        <Button
          to={`?page=${page + 1}`}
          solid
          title={`Page ${page + 1}`}
          icon="arrow-right"
        />
      </Wrapper>
    );
  }

  // Otherwise on last page of results
  else {
    return (
      <Wrapper type="one" to={`?page=${page - 1}`}>
        <Button solid left title={`Page ${page - 1}`} icon="arrow-left" />
      </Wrapper>
    );
  }
};

export default Pagination;
