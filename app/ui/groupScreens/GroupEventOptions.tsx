import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import Text from '../components/Text';
import AButton from '../components/ActionButton';
import Icon from '../components/Icon';

import {acceptInvite, rejectInvite} from '../../utils/api/groups/inviteAPI';
import {Group, Invite} from '../../utils/interfaces/types';

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
}

const GroupEventOptions: React.FC<Props> = ({bottomSheetRef, categoryId}) => {
  return <ScrollView contentContainerStyle={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: s(20),
  },
});

export default GroupEventOptions;
