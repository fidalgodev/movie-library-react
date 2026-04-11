import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StarsWrapper = styled.div`
  line-height: 1;
  display: inline-flex;
  align-items: center;
`;

const FontAwesome = styled(FontAwesomeIcon)`
  color: inherit;
  transition: color 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  @media ${props => props.theme.mediaQueries.smaller} {
    margin-right: 5px;
  }
`;

// Readonly 5-star rating. `number` is 0-5 (derived from TMDB vote_average / 2).
// Rounds to nearest integer; solid stars for the filled count, regular stars
// for the rest. No interaction, no half stars, no external dependency.
const Rating = ({ number }) => {
  const filled = Math.round(number);
  return (
    <StarsWrapper>
      {Array.from({ length: 5 }, (_, i) => (
        <FontAwesome
          key={i}
          icon={i < filled ? ['fas', 'star'] : ['far', 'star']}
          size="lg"
        />
      ))}
    </StarsWrapper>
  );
};

export default Rating;
