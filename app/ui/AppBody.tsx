import { useFriendsContext } from "../context/FriendsContext";
import AppNavigation from "./navigations/AppNavigation";
import { ForegroundNotificationData } from "../utils/types";
import { SetStateAction } from "react";
import Notification from "./components/Notification";

interface AppBodyProps {
  isLoggedInStack: boolean;
  foregroundNotificationData: ForegroundNotificationData;
  setForegroundNotificationData: (value: SetStateAction<ForegroundNotificationData>) => void;
  navigationRef: any;
}

const AppBody = ({isLoggedInStack, foregroundNotificationData, setForegroundNotificationData, navigationRef}: AppBodyProps) => {
    const {refreshFriends} = useFriendsContext();

    return (
      <>
        <AppNavigation isLoggedInStack={isLoggedInStack} />
        {foregroundNotificationData.notificationText !== '' && foregroundNotificationData.screenName !== '' ? (
          <Notification
            message={foregroundNotificationData.notificationText}
            onPress={() => {
              if (foregroundNotificationData.screenName === 'Friends' || foregroundNotificationData.screenName === 'Requests') {
                refreshFriends();
              }

              navigationRef.current?.navigate(foregroundNotificationData.screenName);
              setForegroundNotificationData({screenName: '', notificationText: ''});
            }}
          />
        ) : null}
      </>
    );
};

export default AppBody;