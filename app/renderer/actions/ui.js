// @flow
import type {
  Id,
  UiAction,
} from 'types';

import * as actionTypes from './actionTypes';

export const initialConfigureApp = ({
  protocol,
  hostname,
  port,
  pathname,
  rootApiUrl,
  cookies,
  name,
}) => ({
  type: actionTypes.INITIAL_CONFIGURE_APP,
  protocol,
  hostname,
  port,
  pathname,
  rootApiUrl,
  cookies,
  name,
});

export const setUiState = (
  keyOrRootValues: any,
  maybeValues: any,
): UiAction => ({
  type: actionTypes.SET_UI_STATE,
  payload: {
    keyOrRootValues,
    maybeValues,
  },
});

export const resetUiState = (
  keys: Array<string>,
): UiAction => ({
  type: actionTypes.RESET_UI_STATE,
  payload: {
    keys,
  },
});

export const setModalState = (
  modalName: string,
  state: boolean,
): UiAction => ({
  type: actionTypes.SET_MODAL_STATE,
  payload: {
    modalName,
    state,
  },
});

export const addFlag = (
  payload: any,
): UiAction => ({
  type: actionTypes.ADD_FLAG,
  payload,
});

export const deleteFlag = (
  id: Id,
): UiAction => ({
  type: actionTypes.DELETE_FLAG,
  id,
});

export const installUpdateRequest = (): UiAction => ({
  type: actionTypes.INSTALL_UPDATE_REQUEST,
});

export const issueWorklogsScrollToIndexRequest = (
  worklogId: number | string,
  issueId: number | string,
): UiAction => ({
  type: actionTypes.ISSUE_WORKLOGS_SCROLL_TO_INDEX_REQUEST,
  worklogId,
  issueId,
});

export const acknowlegdeFeature = (payload: {
  featureId: string,
}): UiAction => ({
  type: actionTypes.ACKNOWLEDGE_FEATURE,
  payload,
});
