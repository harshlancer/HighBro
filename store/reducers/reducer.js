// reducer.js
import {TOGGLE_DARK_MODE, REFRESH_NEWS} from '../actions/action';

const initialState = {
  isDarkMode: false,
  refreshNews: false,
};

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case REFRESH_NEWS:
      return {
        ...state,
        refreshNews: !state.refreshNews,  // Toggle to trigger a refresh
      };
    default:
      return state;
  }
};

export default darkModeReducer;
