// @flow
import React from 'react';

import type {
  StatelessFunctionalComponent,
  Node,
} from 'react';

import {
  Checkbox,
} from '@atlaskit/checkbox';

import Button, {
  ButtonGroup,
} from '@atlaskit/button';

import {
  H100,
} from 'styles/typography';
import {
  CheckboxGroup,
} from 'styles';
import {
  Flex,
} from 'components';

import type {
  SettingsGeneral,
} from 'types';

import * as S from './styled';


type Props = {
  settings: SettingsGeneral,
  setTraySettings: (value: any) => void,
  clearChache: () => void,
  setAllowEmptyComment: () => void,
  setShowLoggedOnStop: () => void,
  setEnableScreenshots: () => void,
  takeTestScreenshot: () => void,
}

const GeneralSettings: StatelessFunctionalComponent<Props> = ({
  settings,
  setTraySettings,
  clearChache,
  setAllowEmptyComment,
  setShowLoggedOnStop,
  setEnableScreenshots,
  takeTestScreenshot,
}: Props): Node => {
  const isIconHidden = !!settings.trayShowTimer;
  const { allowEmptyComment } = settings;
  const showLoggedOnStop = !!settings.showLoggedOnStop;
  // const isTimerHidden = false;
  return (
    <S.SettingsSectionContent>
      <S.ContentLabel>
        General
      </S.ContentLabel>
      <Flex column>
        <H100 style={{ margin: '0 0 4px 6px' }}>
          Configure whether to show icon and timer in the menu bar when tracking
        </H100>
        <CheckboxGroup>
          <Checkbox
            isChecked={isIconHidden}
            value={isIconHidden}
            name="trayShowTimer"
            label="Show timer in tray"
            onChange={() => setTraySettings(!isIconHidden)}
          />
        </CheckboxGroup>
        <br />
        <H100 style={{ margin: '0 0 4px 6px' }}>
          Configure whether to allow sending worklogs without comment
        </H100>
        <CheckboxGroup>
          <Checkbox
            isChecked={allowEmptyComment}
            value={allowEmptyComment}
            name="sendEmptyWorklog"
            label="Allow empty worklog comment"
            onChange={() => setAllowEmptyComment(!allowEmptyComment)}
          />
        </CheckboxGroup>
        <br />
        <CheckboxGroup>
          <Checkbox
            isChecked={showLoggedOnStop}
            value={showLoggedOnStop}
            name="showLoggedOnStop"
            label="Show additional tracking info on hover stop button"
            onChange={() => setShowLoggedOnStop(!showLoggedOnStop)}
          />
        </CheckboxGroup>
        <br />
        <CheckboxGroup>
          <Checkbox
            isChecked={settings.screenshotsEnabled}
            value={settings.screenshotsEnabled}
            name="enableScreenshots"
            label="Enable screenshots"
            onChange={() => setEnableScreenshots(!settings.screenshotsEnabled)}
          />
        </CheckboxGroup>
        {settings.screenshotsEnabled
           && (
           <ButtonGroup>
             <Button
               appearance="warning"
               onClick={takeTestScreenshot}
             >
               Take test screenshot
             </Button>
           </ButtonGroup>
           )
        }
        <br />
        <ButtonGroup>
          <Button
            appearance="primary"
            onClick={clearChache}
          >
            Clear cache
          </Button>
        </ButtonGroup>
        <H100
          style={{
            margin: '4px 0 0 6px',
            color: '#FFAB00',
            fontWeight: 300,
          }}
        >
          Clearing cache will cause logout!
        </H100>
        <br />
      </Flex>
    </S.SettingsSectionContent>
  );
};

export default GeneralSettings;
