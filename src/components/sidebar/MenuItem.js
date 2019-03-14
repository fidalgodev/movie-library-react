import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faPoll,
  faHeart,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons';

const StyledLink = styled(Link)`
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.2rem;
  opacity: ${props => (props.selected ? '1' : '.6')};
  color: ${props =>
    props.selected
      ? 'var(--color-primary-dark)'
      : 'var(--color-primary-light)'};
  border: 1px solid var(--border-color);
  border: ${props =>
    props.selected ? '1px solid var(--border-color)' : 'none'};
  border-radius: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  width: 100%;
  cursor: pointer;
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

const MenuItem = ({ title, selectedItem }) => {
  return (
    <StyledLink
      to={`/${title}`}
      selected={
        title === selectedItem || (title === 'Popular' && !selectedItem)
          ? true
          : false
      }
    >
      <FontAwesomeIcon
        icon={renderIcon(title)}
        size="1x"
        style={{ marginRight: '10px' }}
      />
      {title}
    </StyledLink>
  );
};

const mapStateToProps = ({ geral }) => {
  return { selectedItem: geral.selected };
};

export default connect(mapStateToProps)(MenuItem);
