import React, {useState} from 'react';
import {StyleSheet, View, ImageSourcePropType} from 'react-native';
import {s} from 'react-native-size-matters';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import colors from '../../constants/colors';
import icons from '../../constants/icons';

import Text from './Text';
import Icon from './Icon';

import {Option} from '../../utils/types';

interface Props {
  icon?: ImageSourcePropType;
  iconColor?: string;
  options: Option[];
}

const OptionMenu: React.FC<Props> = ({
  icon,
  iconColor = colors.black,
  options,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [pressed, setPressed] = useState<boolean[]>(
    Array(options.length).fill(false),
  );

  return (
    <Menu
      style={styles.container}
      visible={visible}
      anchor={
        <Icon
          size="m"
          icon={icon ? icon : icons.option}
          onPress={() => setVisible(true)}
          color={iconColor}
        />
      }
      onRequestClose={() => setVisible(false)}
      animationDuration={100}>
      {options.map((option, index) => (
        <View key={index}>
          <MenuItem
            style={{height: s(35)}}
            disabled={option.disabled}
            onPressIn={() => {
              setPressed(pressed.map((_, i) => i === index));
            }}
            onPressOut={() => {
              setPressed(pressed.map(() => false));
            }}
            onPress={() => {
              setVisible(false);
              option.onPress();
            }}
            pressColor="transparent">
            <Text
              size="xs"
              weight="r"
              color={
                option.disabled
                  ? colors.black
                  : pressed[index]
                  ? colors.grey
                  : option.color
              }>
              {option.name}
            </Text>
          </MenuItem>
          {index !== options.length - 1 ? <MenuDivider /> : null}
        </View>
      ))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: s(20),
    borderRadius: s(10),
  },
});

export default OptionMenu;
