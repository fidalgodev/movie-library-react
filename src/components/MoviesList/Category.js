import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setSelectedMenu } from '../../actions';
import NotFound from '../NotFound';
import styled from 'styled-components';

const Category = ({ state, match, setSelectedMenu }) => {
  useSetSelected(match.params.name, setSelectedMenu);
  return <div>{match.params.name}</div>;
};

const mapStateToProps = state => {
  return { state };
};

function useSetSelected(name, cb) {
  useEffect(() => {
    cb(name);
  }, [name]);
}

export default connect(
  mapStateToProps,
  { setSelectedMenu }
)(Category);
