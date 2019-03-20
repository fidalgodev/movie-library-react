import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faHome,
} from '@fortawesome/free-solid-svg-icons';

const StyledButton = styled(Link)`
  display: flex;
  flex-direction: ${props => (props.left ? 'row' : 'row-reverse')};
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  padding: 1.5rem 2rem;
  line-height: 1;
  font-weight: 500;
  font-size: 1.3rem;
  width: auto;
  flex-grow: 0;
  color: ${props =>
    props.solid ? 'var(--text-color)' : 'var(--color-primary-dark)'};
  border: ${props =>
    props.solid
      ? '1px solid transparent'
      : '1px solid var(--color-primary-dark)'};
  background-color: ${props =>
    props.solid ? 'var(--color-primary-dark)' : 'transparent'};
  border-radius: 5rem;
  transition: all 600ms cubic-bezier(0.075, 0.82, 0.165, 1);
  box-shadow: 0 1rem 5rem var(--shadow-color);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 2rem 5rem var(--shadow-color);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2rem 5rem var(--shadow-color-dark);
  }
`;

function getIcon(icon) {
  switch (icon) {
    case 'faArrowRight':
      return faArrowRight;
    case 'faArrowLeft':
      return faArrowLeft;
    default:
      return faHome;
  }
}

const Button = ({ to, title, solid, icon, left }) => {
  return (
    <StyledButton to={to} left={left} solid={solid}>
      <FontAwesomeIcon
        icon={getIcon(icon)}
        size="1x"
        style={left ? { marginRight: '10px' } : { marginLeft: '10px' }}
      />
      {title}
    </StyledButton>
  );
};

export default Button;
