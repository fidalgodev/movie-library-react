import React, { useState, useRef, useEffect } from 'react';
import ItemsCarousel from 'react-items-carousel';
import Loader from './Loader';
import CastItem from './CastItem';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { device } from '../utils/_devices';

const Wrapper = styled.div`
  margin-bottom: 5rem;

  @media only screen and ${device.medium} {
    width: 90%;
    margin: 0 auto;
    margin-bottom: 3rem;
  }
`;

const Credits = ({ cast, baseUrl }) => {
  if (!cast) {
    return <Loader />;
  }
  const [currentItem, setCurrentItem] = useState(0);
  const [totalShow, setTotalShow] = useState(1);
  const sliderElement = useRef();

  // Set amount of items to show on slider based on the width of the element
  const changeTotalShow = () => {
    const totalItems = Math.round(sliderElement.current.offsetWidth / 70);
    setTotalShow(totalItems);
  };

  const changeActiveItem = activeItemIndex => setCurrentItem(activeItemIndex);

  const items = cast.map(person => (
    <CastItem person={person} baseUrl={baseUrl} key={person.id} />
  ));

  useEffect(() => {
    changeTotalShow();
    document.addEventListener('resize', changeTotalShow);
    return () => document.removeEventListener('resize', changeTotalShow);
  }, []);

  return (
    <Wrapper ref={sliderElement}>
      <ItemsCarousel
        // Carousel configurations
        numberOfCards={totalShow}
        gutter={10}
        showSlither={false}
        firstAndLastGutter={false}
        freeScrolling={false}
        // Active item configurations
        requestToChangeActive={changeActiveItem}
        activeItemIndex={currentItem}
        activePosition={'center'}
        chevronWidth={25}
        rightChevron={<FontAwesomeIcon icon={'chevron-right'} size="1x" />}
        leftChevron={<FontAwesomeIcon icon={'chevron-left'} size="1x" />}
        outsideChevron={true}
      >
        {items}
      </ItemsCarousel>
    </Wrapper>
  );
};

export default Credits;
