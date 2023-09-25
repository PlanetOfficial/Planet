import React, {SetStateAction} from 'react';

import AppNavigation from './navigations/AppNavigation';
import {ForegroundNotificationData} from '../utils/types';
import Notification from './components/Notification';
import {useFriendsContext} from '../context/FriendsContext';

interface AppBodyProps {
  isLoggedInStack: boolean;
  foregroundNotificationData: ForegroundNotificationData;
  setForegroundNotificationData: (
    value: SetStateAction<ForegroundNotificationData>,
  ) => void;
  navigationRef: any;
}

const AppBody = ({
  isLoggedInStack,
  foregroundNotificationData,
  setForegroundNotificationData,
  navigationRef,
}: AppBodyProps) => {
  const {refreshFriends} = useFriendsContext();

  return (
    <>
      <AppNavigation isLoggedInStack={isLoggedInStack} />
      {foregroundNotificationData.notificationText !== '' &&
      foregroundNotificationData.screenName !== '' ? (
        <Notification
          message={foregroundNotificationData.notificationText}
          onPress={() => {
            if (
              foregroundNotificationData.screenName === 'Friends' ||
              foregroundNotificationData.screenName === 'Requests'
            ) {
              refreshFriends();
            }

            navigationRef.current?.navigate(
              foregroundNotificationData.screenName,
            );
            setForegroundNotificationData({
              screenName: '',
              notificationText: '',
            });
          }}
        />
      ) : null}
    </>
  );
};

export default AppBody;
