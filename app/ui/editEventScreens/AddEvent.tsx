import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, Pressable, LayoutAnimation} from 'react-native';

import {s, vs} from 'react-native-size-matters';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BottomSheet, {BottomSheetModal} from '@gorhom/bottom-sheet';

import AButton from '../components/ActionButton';
import CButton from '../components/CancelButton';
import AddByCategory from '../editEventScreens/AddByCategory';
import AddFromLibrary from '../editEventScreens/AddFromLibrary';
import AddCustomDest from '../editEventScreens/AddCustomDest';

import strings from '../../constants/strings';

import {Place, Category} from '../../utils/interfaces/types';

interface ChildComponentProps {
  destinations: (Place | Category)[];
  setDestinations: (destinations: (Place | Category)[]) => void;
  selectionIndices: number[];
  setSelectionIndices: (selectionIndices: number[]) => void;
}

const AddEvent = forwardRef((props: ChildComponentProps, ref) => {
  const {destinations, setDestinations, selectionIndices, setSelectionIndices} =
    props;
  useImperativeHandle(ref, () => ({
    onAddPress,
  }));

  const insets = useSafeAreaInsets();

  const [addOptionsBottomSheetOpen, setAddOptionsBottomSheetOpen] =
    useState<boolean>(false);
  const addOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const addOptionsSnapPoints = useMemo(
    () => [s(260) + insets.bottom],
    [insets.bottom],
  );
  const handleAddOptionsSheetChange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setAddOptionsBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [insertionIndex, setInsertionIndex] = useState<number>(0);
  const [addBottomSheetStatus, setAddBottomSheetStatus] = useState<number>(0);
  const addBottomSheetRef = useRef<BottomSheet>(null);
  const addBottomSheetSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );

  const onAddPress = (idx: number) => {
    setInsertionIndex(idx);
    addOptionsBottomSheetRef.current?.present();
  };

  const onAddOptionPress = (idx: number) => {
    addOptionsBottomSheetRef.current?.close();
    setAddBottomSheetStatus(idx);
    addBottomSheetRef.current?.snapToIndex(0);
  };

  const onClose = () => {
    addBottomSheetRef.current?.close();
    setAddBottomSheetStatus(0);
  };

  const onCategorySelect = async (category: Category) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const _destinations: (Place | Category)[] = [...destinations];
    const _selectionIndices: number[] = [...selectionIndices];
    _destinations.splice(insertionIndex + 1, 0, {
      id: category.id,
      name: category.name,
      icon: category.icon,
      subcategories: category.subcategories,
      options: [],
    });
    _selectionIndices.splice(insertionIndex + 1, 0, 0);
    setDestinations(_destinations);
    setSelectionIndices(_selectionIndices);
  };

  const onDestinationSelect = (destination: Place) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const _destinations: (Place | Category)[] = [...destinations];
    const _selectionIndices: number[] = [...selectionIndices];
    _destinations.splice(insertionIndex + 1, 0, destination);
    _selectionIndices.splice(insertionIndex + 1, 0, -1);
    setDestinations(_destinations);
    setSelectionIndices(_selectionIndices);
  };

  return (
    <>
      {addOptionsBottomSheetOpen || addBottomSheetStatus !== 0 ? (
        <Pressable
          style={styles.dim}
          onPress={() => {
            addOptionsBottomSheetRef.current?.close();
            onClose();
          }}
        />
      ) : null}

      <BottomSheetModal
        ref={addOptionsBottomSheetRef}
        snapPoints={addOptionsSnapPoints}
        onAnimate={handleAddOptionsSheetChange}>
        <View style={styles.addOptionsContainer}>
          <AButton
            size="l"
            label={strings.library.addByCategory}
            onPress={() => {
              onAddOptionPress(1);
            }}
          />
          <AButton
            size="l"
            label={strings.library.addFromLibrary}
            onPress={() => {
              onAddOptionPress(2);
            }}
          />
          <AButton
            size="l"
            label={strings.library.addCustom}
            onPress={() => {
              onAddOptionPress(3);
            }}
          />

          <CButton onPress={() => addOptionsBottomSheetRef.current?.close()} />
        </View>
      </BottomSheetModal>

      <BottomSheet
        ref={addBottomSheetRef}
        index={-1}
        snapPoints={addBottomSheetSnapPoints}
        handleStyle={styles.handle}
        handleIndicatorStyle={styles.handleIndicator}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}>
        {addBottomSheetStatus === 1 ? (
          <AddByCategory onClose={onClose} onSelect={onCategorySelect} />
        ) : null}
        {addBottomSheetStatus === 2 ? (
          <AddFromLibrary onClose={onClose} onSelect={onDestinationSelect} />
        ) : null}
        {addBottomSheetStatus === 3 ? (
          <AddCustomDest onClose={onClose} onSelect={onDestinationSelect} />
        ) : null}
      </BottomSheet>
    </>
  );
});

const styles = StyleSheet.create({
  handle: {
    paddingTop: 0,
  },
  handleIndicator: {
    height: 0,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addOptionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: s(240),
    paddingTop: s(20),
  },
});

export default AddEvent;
