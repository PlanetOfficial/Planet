import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import {s} from 'react-native-size-matters';
import {colors} from '../../constants/theme';
import Text from '../components/Text';

interface Props {
  onPress: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  prompt: string;
  leftText: string;
  rightText: string;
  leftColor?: string;
  rightColor?: string;
}

const Confirmation: React.FC<Props> = ({
  onPress,
  open,
  setOpen,
  prompt,
  leftText,
  rightText,
  leftColor = colors.black,
  rightColor = colors.black,
}) => {
  return (
    <Modal animationType="fade" transparent={true} visible={open}>
      <View style={styles.vertCenter}>
        <Pressable
          style={styles.dim}
          onPress={() => {
            setOpen(false);
          }}
        />
        <View style={styles.container}>
          <View style={styles.title}>
            <Text size="s" numberOfLines={2} center={true}>
              {prompt}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.left}
              onPress={() => {
                setOpen(false);
                onPress();
              }}>
              <Text size="s" weight="b" color={leftColor}>
                {leftText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.right}
              onPress={() => setOpen(false)}>
              <Text size="s" weight="b" color={rightColor}>
                {rightText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  vertCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: s(250),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  title: {
    margin: s(20),
    paddingHorizontal: s(20),
  },
  buttons: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(40),
  },
  left: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.white,
    borderBottomLeftRadius: s(10),
    borderTopWidth: 1,
    borderRightWidth: 0.5,
    borderColor: colors.grey,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    backgroundColor: colors.white,
    borderBottomRightRadius: s(10),
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderColor: colors.grey,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Confirmation;
