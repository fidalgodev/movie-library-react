import React from 'react';
import styled from 'styled-components';
import Stars from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StarsWrapper = styled(Stars)`
  line-height: 1;
`;

const FontAwesome = styled(FontAwesomeIcon)`
  color: inherit;
  transition: color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
`;

const Rating = ({ number }) => {
  return (
    <StarsWrapper
      emptySymbol={
        <FontAwesome
          icon={['far', 'star']}
          size="lg"
          style={{ marginRight: '10px' }}
        />
      }
      fullSymbol={
        <FontAwesome
          icon={['fas', 'star']}
          size="lg"
          style={{ marginRight: '10px' }}
        />
      }
      initialRating={number}
      readonly
    />
  );
};

export default Rating;
