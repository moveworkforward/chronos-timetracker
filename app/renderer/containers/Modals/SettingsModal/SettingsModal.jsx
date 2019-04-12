// @flow
import React from 'react';
import {
  connect,
} from 'react-redux';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';
import type {
  Connector,
} from 'react-redux';
import type {
  Dispatch,
  SettingsGeneral,
} from 'types';

import ModalDialog, {
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Button from '@atlaskit/button';

import {
  ModalContentContainer,
} from 'styles/modals';
import {
  uiActions,
  screenshotsActions,
  settingsActions,
  updaterActions,
} from 'actions';

import {
  Flex,
} from 'components';
import {
  getUiState,
  getModalState,
} from 'selectors';


import GeneralSettings from './General';
import UpdateSettings from './Update';

import * as S from './styled';


type Props = {
  isOpen: boolean,
  tab: string,
  settings: SettingsGeneral,
  updateCheckRunning: boolean,
  updateAvailable: string,
  downloadUpdateProgress: any,
  dispatch: Dispatch,
}

const SettingsModal: StatelessFunctionalComponent<Props> = ({
  isOpen,
  tab,
  settings,
  updateAvailable,
  downloadUpdateProgress,
  updateCheckRunning,
  dispatch,
}: Props): Node => isOpen && (
  <ModalDialog
    header={() => (
      <ModalHeader>
        <ModalTitle>Settings</ModalTitle>
      </ModalHeader>
    )}
    footer={() => (
      <ModalFooter>
        <Flex row style={{ justifyContent: 'flex-end', width: '100%' }}>
          <Button
            appearance="default"
            onClick={() => {
              dispatch(uiActions.setModalState('settings', false));
            }}
          >
            Close
          </Button>
        </Flex>
      </ModalFooter>
    )}
    onClose={() => {
      dispatch(uiActions.setModalState('settings', false));
    }}
  >
    <ModalContentContainer>
      <Flex row style={{ height: 324 }}>
        <Flex column style={{ width: 85 }}>
          <S.SettingsSectionLabel
            active={tab === 'General'}
            onClick={() => {
              dispatch(uiActions.setUiState({
                settingsTab: 'General',
              }));
            }}
          >
            General
          </S.SettingsSectionLabel>
          {/*
          <SettingsSectionLabel
            active={tab === 'Notifications'}
            onClick={() => {
              dispatch(settingsActions.setSettingsModalTab('Notifications'));
            }}
          >
            Notifications
          </SettingsSectionLabel>
          */}
          <S.SettingsSectionLabel
            active={tab === 'Updates'}
            onClick={() => {
              dispatch(uiActions.setUiState({
                settingsTab: 'Updates',
              }));
            }}
          >
            Updates
          </S.SettingsSectionLabel>
        </Flex>
        <S.Separator />
        {tab === 'General' && (
          <GeneralSettings
            settings={settings}
            takeTestScreenshot={() => {
              dispatch(screenshotsActions.takeScreenshotRequest({
                isTest: true,
              }));
            }}
            setEnableScreenshots={(value) => {
              dispatch(uiActions.setUiState({
                screenshotsEnabled: value,
              }));
            }}
            setTraySettings={(value) => {
              dispatch(uiActions.setUiState({
                trayShowTimer: value,
              }));
            }}
            clearChache={() => dispatch(
              settingsActions.clearElectronCache(),
            )}
            setAllowEmptyComment={(value) => {
              dispatch(uiActions.setUiState({
                allowEmptyComment: value,
              }));
            }}
            setShowLoggedOnStop={(value) => {
              dispatch(uiActions.setUiState({
                showLoggedOnStop: value,
              }));
            }}
          />
        )}
        {/*
        {tab === 'Notifications' && (
          <NotificationSettings
            settings={settings}
            onChangeSetting={(value, settingName) => {
              dispatch(settingsActions.setLocalDesktopSetting(
                value,
                settingName,
              ));
            }}
          />
        )}
        */}
        {tab === 'Updates' && (
          <UpdateSettings
            channel={settings.updateChannel}
            updateCheckRunning={updateCheckRunning}
            checkForUpdates={() => {
              dispatch(uiActions.setUiState({
                updateAvailable: null,
              }));
              dispatch(updaterActions.checkUpdates());
            }}
            setChannel={(value) => {
              dispatch(updaterActions.setUpdateSettings({
                autoDownload: settings.updateAutomatically,
                allowPrerelease: value !== 'stable',
              }));
              dispatch(uiActions.setUiState({
                updateChannel: value,
              }));
            }}
            automaticUpdate={settings.updateAutomatically}
            setAutomaticUpdate={(value) => {
              dispatch(updaterActions.setUpdateSettings({
                autoDownload: value,
                allowPrerelease: settings.updateChannel !== 'stable',
              }));
              dispatch(uiActions.setUiState({
                updateAutomatically: value,
              }));
            }}
            updateAvailable={updateAvailable}
            downloadUpdateProgress={downloadUpdateProgress}
            onUpdateClick={() => {
              dispatch(updaterActions.downloadUpdate());
            }}
          />
        )}
      </Flex>
    </ModalContentContainer>
  </ModalDialog>
);

function mapStateToProps(state) {
  const updateAvailable = getUiState('updateAvailable')(state);
  return {
    isOpen: getModalState('settings')(state),
    settings: getUiState([
      'trayShowTimer',
      'allowEmptyComment',
      'showLoggedOnStop',
      'updateChannel',
      'updateAutomatically',
      'screenshotsEnabled',
    ])(state),
    tab: getUiState('settingsTab')(state),
    updateAvailable,
    updateCheckRunning: updateAvailable === null,
    downloadUpdateProgress: getUiState('downloadUpdateProgress')(state),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  dispatch => ({ dispatch }),
);

export default connector(SettingsModal);
