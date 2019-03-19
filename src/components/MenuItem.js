import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faPoll,
  faHeart,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons';

const StyledItem = styled.div`
  padding: 0.5rem 2rem;
  font-weight: 600;
  font-size: 1.2rem;
  opacity: ${props => (props.selected ? '1' : '.6')};
  color: ${props =>
    props.selected
      ? 'var(--color-primary-dark)'
      : 'var(--color-primary-light)'};
  border-color: ${props =>
    props.selected
      ? 'var(--color-primary-dark)'
      : 'var(--color-primary-light)'};
  border: ${props => (props.selected ? '1px solid' : '1px solid transparent')};
  border-radius: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 100%;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.17, 0.67, 0.83, 0.67);

  :not(:last-child) {
    margin-bottom: 1rem;
  }

  &:hover {
    border: 1px solid;
  }
`;

function renderIcon(title) {
  switch (title) {
    case 'Popular':
      return faHeart;
    case 'Top Rated':
      return faPoll;
    case 'Upcoming':
      return faCalendar;
    default:
      return faDotCircle;
  }
}

const MenuItem = ({ title, selected }) => {
  return (
    <StyledItem selected={selected}>
      <FontAwesomeIcon
        icon={renderIcon(title)}
        size="1x"
        style={{ marginRight: '10px' }}
      />
      {title}
    </StyledItem>
  );
};

export default MenuItem;
