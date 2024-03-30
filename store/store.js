import {createStore} from 'redux';
import darkModeReducer from './reducers/reducer';

const store = createStore(darkModeReducer);

export default store;
