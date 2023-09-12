import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Alert, SafeAreaView } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Channel as ChannelType, StreamChat } from 'stream-chat';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from 'stream-chat-react-native';
import { getEventChatInfo } from '../../../utils/api/eventAPI';
import { Event } from '../../../utils/types';
import Icon from '../../components/Icon';
import icons from '../../../constants/icons';

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
          Alert.alert('Error', 'Failed to connect to load user data.');
          return;
        }

        const chatInfo = await getEventChatInfo(route.params.event.id);
        if (!chatInfo) {
          Alert.alert('Error', 'Internal error retrieving chat, please try again later.');
          return;
        }

        setStreamChatApiKey(chatInfo.getstream_api_key);
        const client = StreamChat.getInstance(chatInfo.getstream_api_key); // singleton
        const channel = client.getChannelById(chatInfo.channel_type, chatInfo.channel_id, {});
        if (!channel) {
          Alert.alert('Error', 'Error retrieving chat, chats may not be available for this event. Try creating a new event.');
          return;
        }

        setChannel(channel);

        if (client.user === undefined) {
          await client.connectUser(
            {
              id: user_id,
              name,
              ...(pfp_url && { image: pfp_url }),
            },
            chatInfo.getstream_user_token,
          );
        }

        setStreamClient(client);
      } catch (e) {
        Alert.alert('Error', 'Error retrieving chat, chats may not be available for this event. Try creating a new event.');
      }
    };

    setupClient();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', async () => {
      setChannel(undefined);
      if (streamChatApiKey.length > 0) {
        const client = StreamChat.getInstance(streamChatApiKey);
        client.disconnectUser();
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <OverlayProvider topInset={60}>
      <SafeAreaView style={{flex: 1}}>
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
  )
};

export default EventChat;
