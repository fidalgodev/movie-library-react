import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setSelectedMenu, setHeader } from '../actions';

const Home = ({ setSelectedMenu, setHeader }) => {
  useEffect(() => {
    setSelectedMenu('');
    setHeader('');
  }, []);

  return <div> Home</div>;
};

export default connect(
  null,
  { setSelectedMenu, setHeader }
)(Home);
