import React, { useState, useRef, useEffect } from 'react';
import ItemsCarousel from 'react-items-carousel';
import Loader from './Loader';
import CastItem from './CastItem';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  > * div {
    display: flex;
    justify-content: center;
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
    const totalItems = Math.round(sliderElement.current.offsetWidth / 60);
    setTotalShow(totalItems);
  };

  const changeActiveItem = activeItemIndex => setCurrentItem(activeItemIndex);

  const items = cast.map(person => (
    <CastItem person={person} baseUrl={baseUrl} key={person.id} />
  ));

  useEffect(() => {
    changeTotalShow();
    window.addEventListener('resize', changeTotalShow);
    return () => window.removeEventListener('resize', changeTotalShow);
  }, []);

  return (
    <Wrapper ref={sliderElement}>
      <ItemsCarousel
        // Carousel configurations
        numberOfCards={totalShow}
        gutter={0}
        showSlither={false}
        firstAndLastGutter={true}
        freeScrolling={false}
        // Active item configurations
        requestToChangeActive={changeActiveItem}
        activeItemIndex={currentItem}
        activePosition={'left'}
        chevronWidth={20}
        rightChevron={<FontAwesomeIcon icon={faChevronRight} size="1x" />}
        leftChevron={<FontAwesomeIcon icon={faChevronLeft} size="1x" />}
        outsideChevron={true}
      >
        {items}
      </ItemsCarousel>
    </Wrapper>
  );
};

export default Credits;

// return cast.map(person => (
//   <Link to={`/cast/${person.id}`} key={person.id}>
//     <h3>{person.name}</h3>
//     <p>Featuring: {person.character}</p>
//     <ImgWrapper src={`${baseUrl}w342${person.profile_path}`} />
//   </Link>
// ));
