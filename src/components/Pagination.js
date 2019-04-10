import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { scroller } from 'react-scroll';

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
`;

const WrapperLink = styled(Link)`
  text-decoration: none;
`;

const Pagination = ({ movies }) => {
  const { page, total_pages } = movies;

  const scrollTo = () => {
    scroller.scrollTo('scroll-to-element', {
      duration: 1500,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  };

  // If only 1 page
  if (total_pages === 1) {
    return null;
  }

  // On first page, render page 2 button
  if (page < total_pages && page === 1) {
    return (
      <Wrapper>
        <WrapperLink
          to={`${process.env.PUBLIC_URL}?page=${page + 1}`}
          onClick={scrollTo}
        >
          <Button solid title={`Page ${page + 1}`} icon="arrow-right" />
        </WrapperLink>
      </Wrapper>
    );
  }

  // There is a next and a previous page, render accordingly
  else if (page < total_pages) {
    return (
      <Wrapper type="both">
        <WrapperLink
          to={`${process.env.PUBLIC_URL}?page=${page - 1}`}
          onClick={scrollTo}
        >
          <Button solid left title={`Page ${page - 1}`} icon="arrow-left" />
        </WrapperLink>
        <WrapperLink
          to={`${process.env.PUBLIC_URL}?page=${page + 1}`}
          onClick={scrollTo}
        >
          <Button solid title={`Page ${page + 1}`} icon="arrow-right" />
        </WrapperLink>
      </Wrapper>
    );
  }

  // Otherwise on last page of results
  else {
    return (
      <Wrapper type="one">
        <WrapperLink
          to={`${process.env.PUBLIC_URL}?page=${page - 1}`}
          onClick={scrollTo}
        >
          <Button solid left title={`Page ${page - 1}`} icon="arrow-left" />
        </WrapperLink>
      </Wrapper>
    );
  }
};

export default Pagination;
