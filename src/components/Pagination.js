import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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

  // On first page, render page 2 button
  if (page < total_pages && page === 1) {
    return (
      <Wrapper>
        <Button
          to={`?page=${page + 1}`}
          solid
          title={`Page ${page + 1}`}
          icon="faArrowRight"
        />
      </Wrapper>
    );
  }

  // There is a next and a previous page, render accordingly
  else if (page < total_pages) {
    return (
      <Wrapper type="both">
        <Button
          to={`?page=${page - 1}`}
          solid
          left
          title={`Page ${page - 1}`}
          icon="faArrowLeft"
        />
        <Button
          to={`?page=${page + 1}`}
          solid
          title={`Page ${page + 1}`}
          icon="faArrowRight"
        />
      </Wrapper>
    );
  }

  // Otherwise on last page of results
  else {
    return (
      <Wrapper type="one">
        <Button
          to={`?page=${page - 1}`}
          solid
          left
          title={`Page ${page - 1}`}
          icon="faArrowLeft"
        />
      </Wrapper>
    );
  }
};

export default Pagination;
