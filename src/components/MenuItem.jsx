import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1.6rem;
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1;
  border-radius: 0.8rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 200ms ease, color 200ms ease, transform 200ms ease;

  /* Desktop sidebar context (light background) */
  color: ${props =>
    props.$mobile
      ? props.$selected
        ? 'var(--text-color)'
        : 'rgba(255, 255, 255, 0.65)'
      : props.$selected
        ? 'var(--text-color)'
        : 'var(--color-primary-light)'};

  background-color: ${props =>
    props.$selected
      ? 'var(--color-primary-dark)'
      : 'transparent'};

  svg {
    width: 1.4rem;
    margin-right: 1.2rem;
    opacity: ${props => (props.$selected ? 1 : 0.55)};
    transition: opacity 200ms ease;
  }

  &:hover {
    background-color: ${props =>
      props.$selected
        ? 'var(--color-primary-dark)'
        : props.$mobile
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(38, 50, 56, 0.08)'};
    color: ${props =>
      props.$selected
        ? 'var(--text-color)'
        : props.$mobile
          ? 'var(--text-color)'
          : 'var(--color-primary-dark)'};
    transform: translateX(2px);

    svg {
      opacity: 1;
    }
  }
`;

function renderIcon(title) {
  switch (title) {
    case 'Popular':
      return 'heart';
    case 'Top Rated':
      return 'poll';
    case 'Upcoming':
      return 'calendar';
    default:
      return 'dot-circle';
  }
}

const MenuItem = ({ title, selected, mobile }) => {
  return (
    <StyledItem $selected={!!selected} $mobile={!!mobile}>
      <FontAwesomeIcon icon={renderIcon(title)} size="1x" />
      {title}
    </StyledItem>
  );
};

export default MenuItem;
