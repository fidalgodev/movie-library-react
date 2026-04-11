import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

  // On pagination click, scroll the #scroll-to-element anchor into view if
  // it exists (Movie/Person detail pages wrap their recommended/filmography
  // list in that id). Otherwise scroll the window to the top (list pages
  // like Discover/Genre/Search have no anchor — user lands at the top of
  // the new list).
  const scrollTo = () => {
    const anchor = document.getElementById('scroll-to-element');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          to={`?page=${page + 1}`}
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
          to={`?page=${page - 1}`}
          onClick={scrollTo}
        >
          <Button solid left title={`Page ${page - 1}`} icon="arrow-left" />
        </WrapperLink>
        <WrapperLink
          to={`?page=${page + 1}`}
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
          to={`?page=${page - 1}`}
          onClick={scrollTo}
        >
          <Button solid left title={`Page ${page - 1}`} icon="arrow-left" />
        </WrapperLink>
      </Wrapper>
    );
  }
};

export default Pagination;
