import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {s} from 'react-native-size-matters';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import Text from './Text';
import Icon from './Icon';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

interface Props {
  options: {
    name: string;
    onPress: () => void;
    color: string;
    disabled?: boolean;
  }[];
}

const OptionMenu: React.FC<Props> = ({options}) => {
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(Array(options.length).fill(false));

  return (
    <Menu
      style={styles.container}
      visible={visible}
      anchor={
        <Icon size="m" icon={icons.option} onPress={() => setVisible(true)} />
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
                  ? colors.darkgrey
                  : pressed[index]
                  ? colors.grey
                  : option.color
              }>
              {option.name}
            </Text>
          </MenuItem>
          {index !== options.length - 1 && <MenuDivider />}
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