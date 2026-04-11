import React from 'react';
import styled from 'styled-components';
import CastItem from './CastItem';

// Native horizontal scroll. No carousel library — simpler, no strict-mode
// width bugs, no issues with large cast arrays.
const Wrapper = styled.div`
  margin-bottom: 5rem;
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 1rem 0 2rem;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;

  & > * {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-primary-lighter);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary);
  }
`;

const Credits = ({ cast, baseUrl }) => {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {cast.map(person => (
        <CastItem person={person} baseUrl={baseUrl} key={person.id} />
      ))}
    </Wrapper>
  );
};

export default Credits;
