// @flow
import type {
  TimerAction,
} from 'types';

import * as types from './actionTypes';


export const tick = (second = 1): TimerAction => ({
  type: types.TICK,
  payload: second,
  scope: 'allRenderer',
});

export const startTimer = (): TimerAction => ({
  type: types.START_TIMER,
});

export const stopTimer = (): TimerAction => ({
  type: types.STOP_TIMER,
});

export const continueTimer = (): TimerAction => ({
  type: types.CONTINUE_TIMER,
});

export const stopTimerRequest = (closeRequest = false): TimerAction => ({
  type: types.STOP_TIMER_REQUEST,
  closeRequest,
});

export const setIdleState = (
  payload: boolean,
): TimerAction => ({
  type: types.SET_IDLE_STATE,
  payload,
});

export const setLastScreenshotTime = (
  payload: number,
): TimerAction => ({
  type: types.SET_LAST_SCREENSHOT_TIME,
  payload,
});

export const resetTimer = (): TimerAction => ({
  type: types.RESET_TIMER,
});

export const addScreenshot = (
  screenshot: any,
  screenshotTime: number,
): TimerAction => ({
  type: types.ADD_SCREENSHOT,
  screenshot,
  screenshotTime,
});

export const setScreenshotPeriods = (
  payload: Array<number>,
): TimerAction => ({
  type: types.SET_SCREENSHOT_PERIODS,
  payload,
});

export const keepIdleTime = (
  payload: any,
): TimerAction => ({
  type: types.KEEP_IDLE_TIME,
  payload,
  scope: 'allRenderer',
});

export const dismissIdleTime = (
  payload: number,
): TimerAction => ({
  type: types.DISMISS_IDLE_TIME,
  payload,
  scope: 'allRenderer',
});
