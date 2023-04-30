import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';

import {s} from 'react-native-size-matters';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

interface Props {
  onPress: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const BackConfirmation: React.FC<Props> = ({onPress, open, setOpen}) => {
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
          <Text style={styles.title}>{strings.library.backConfirmation}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.discard}
              onPress={() => {
                setOpen(false);
                onPress();
              }}>
              <Text style={styles.discardText}>{strings.library.discard}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keepEditing}
              onPress={() => setOpen(false)}>
              <Text style={styles.keepEditingText}>
                {strings.library.keepEditing}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(250),
    height: s(120),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  title: {
    margin: s(20),
    paddingHorizontal: s(20),
    fontSize: s(15),
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: s(40),
  },
  discard: {
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
  keepEditing: {
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
  discardText: {
    fontSize: s(14),
    fontWeight: '700',
    color: colors.red,
  },
  keepEditingText: {
    fontSize: s(14),
    fontWeight: '700',
    color: colors.accent,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BackConfirmation;
