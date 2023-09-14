import React, {useCallback, useEffect, useState} from 'react';
import {Alert, SafeAreaView, View, useColorScheme} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Channel as ChannelType, StreamChat} from 'stream-chat';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from 'stream-chat-react-native';
import type {DeepPartial, Theme} from 'stream-chat-react-native';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {lightChatTheme, darkChatTheme} from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import {getEventChatInfo} from '../../../utils/api/eventAPI';
import {Event} from '../../../utils/types';

const EventChat = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      event: Event;
    };
  };
}) => {
  const colorScheme = useColorScheme();
  const STYLES = STYLING(colorScheme || 'light');
  const getTheme = useCallback(
    (): DeepPartial<Theme> => ({
      colors: colorScheme === 'dark' ? darkChatTheme : lightChatTheme,
    }),
    [colorScheme],
  );
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
  }, [colorScheme, getTheme]);

  const [channel, setChannel] = useState<ChannelType>();
  const [streamClient, setStreamClient] = useState<StreamChat | null>();
  const [streamChatApiKey, setStreamChatApiKey] = useState('');

  useEffect(() => {
    const setupClient = async () => {
      try {
        const user_id = await EncryptedStorage.getItem('user_id');
        const name = await AsyncStorage.getItem('display_name');
        const pfp_url = await AsyncStorage.getItem('pfp_url');

        if (!user_id || !name) {
          Alert.alert(strings.error.error, strings.error.loadUserData);
          return;
        }

        const chatInfo = await getEventChatInfo(route.params.event.id);
        if (!chatInfo) {
          Alert.alert(strings.error.error, strings.error.internalError);
          return;
        }

        setStreamChatApiKey(chatInfo.getstream_api_key);
        const client = StreamChat.getInstance(chatInfo.getstream_api_key); // singleton
        const _channel = client.getChannelById(
          chatInfo.channel_type,
          chatInfo.channel_id,
          {},
        );
        if (!_channel) {
          Alert.alert(strings.error.error, strings.error.chatNotExist);
          return;
        }

        setChannel(_channel);

        if (client.user === undefined) {
          await client.connectUser(
            {
              id: user_id,
              name,
              ...(pfp_url && {image: pfp_url}),
            },
            chatInfo.getstream_user_token,
          );
        }

        setStreamClient(client);
      } catch (e) {
        Alert.alert(strings.error.error, strings.error.generalChatError);
      }
    };

    setupClient();
  }, [route.params.event.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', async () => {
      setChannel(undefined);
      if (streamChatApiKey.length > 0) {
        const client = StreamChat.getInstance(streamChatApiKey);
        client.disconnectUser();
      }
    });

    return unsubscribe;
  }, [navigation, streamChatApiKey]);

  return (
    <OverlayProvider value={{style: theme}}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon onPress={() => navigation.goBack()} icon={icons.back} />
          <Text size="s">{route.params.event.name}</Text>
          <Icon icon={icons.back} color={'transparent'} />
        </View>
      </SafeAreaView>
      <SafeAreaView style={styles.container}>
        {streamClient && channel ? (
          <Chat client={streamClient}>
            <Channel channel={channel}>
              <MessageList />
              <MessageInput />
            </Channel>
          </Chat>
        ) : null}
      </SafeAreaView>
    </OverlayProvider>
  );
};

const styles = {
  container: {
    flex: 1,
  },
};

export default EventChat;
