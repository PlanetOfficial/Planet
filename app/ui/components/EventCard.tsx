import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import Text from './Text';
import IButton from './IconButton';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';

interface Props {
  name: string;
  info: string;
  image: Object;
  option?: boolean;
}

const EventCard: React.FC<Props> = ({name, info, image, option = false}) => {
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  const [visible, setVisible] = useState(false);

  const [sharePressed, setSharePressed] = useState(false);
  const [removePressed, setRemovePressed] = useState(false);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image} />
      <View style={styles.header}>
        <View>
          <Text size="m" weight="b">
            {name}
          </Text>
          <Text size="xs" weight="l" color={colors.accent}>
            {info}
          </Text>
        </View>
        {option && (
          <Menu
            style={styles.menu}
            visible={visible}
            anchor={<IButton size="l" icon={icons.option} onPress={showMenu} />}
            onRequestClose={hideMenu}
            animationDuration={100}>
            <MenuItem
              onPressIn={() => setSharePressed(true)}
              onPressOut={() => setSharePressed(false)}
              onPress={() => {
                hideMenu();
                console.log('TODO: Share event');
              }}
              pressColor="transparent">
              <Text
                size="xs"
                weight="r"
                color={sharePressed ? colors.grey : colors.black}>
                {strings.main.share}
              </Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onPressIn={() => setRemovePressed(true)}
              onPressOut={() => setRemovePressed(false)}
              onPress={() => {
                hideMenu();
                console.log('TODO: Remove Event from list');
              }}
              pressColor="transparent">
              <Text
                size="xs"
                weight="r"
                color={removePressed ? colors.grey : colors.red}>
                {strings.main.remove}
              </Text>
            </MenuItem>
          </Menu>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 8 / 5,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '25%',
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(8),
  },
  menu: {
    marginTop: s(20),
    borderRadius: s(10),
  },
});

export default EventCard;
