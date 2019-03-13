import { combineReducers } from 'redux';
import configReducer from './configReducer';

export default combineReducers({
  geral: configReducer,
});
