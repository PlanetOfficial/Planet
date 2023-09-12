import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Channel as ChannelType, StreamChat} from 'stream-chat';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from 'stream-chat-react-native';
import {getEventChatInfo} from '../../../utils/api/eventAPI';
import {Event} from '../../../utils/types';
import Icon from '../../components/Icon';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';

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
    <OverlayProvider topInset={60}>
      <SafeAreaView style={styles.container}>
        <Icon onPress={() => navigation.goBack()} icon={icons.back} />
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
