import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setSelectedMenu } from '../actions';

const Home = ({ setSelectedMenu }) => {
  useEffect(() => {
    setSelectedMenu('');
  }, []);

  return <div> Home</div>;
};

export default connect(
  null,
  { setSelectedMenu }
)(Home);
