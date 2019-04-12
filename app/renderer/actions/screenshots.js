import * as actionTypes from './actionTypes';


export const takeScreenshotRequest = ({
  isTest,
}) => ({
  type: actionTypes.TAKE_SCREENSHOT_REQUEST,
  isTest,
});
