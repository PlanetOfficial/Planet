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

interface ChildComponentProps {
  destinations: any;
  setDestinations: (destinations: any) => void;
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
    useState(false);
  const addOptionsBottomSheetRef: any = useRef<BottomSheetModal>(null);
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

  const [insertionIndex, setInsertionIndex] = useState<number | undefined>(0);
  const [addBottomSheetStatus, setAddBottomSheetStatus] = useState(0);
  const addBottomSheetRef: any = useRef<BottomSheet>(null);
  const addBottomSheetSnapPoints = useMemo(
    () => [vs(680) - s(60) - insets.top],
    [insets.top],
  );

  const onAddPress = (idx: number | undefined) => {
    setInsertionIndex(idx);
    addOptionsBottomSheetRef.current?.present();
  };

  const onAddOptionPress = (idx: number) => {
    addOptionsBottomSheetRef?.current.close();
    setAddBottomSheetStatus(idx);
    addBottomSheetRef.current?.snapToIndex(0);
  };

  const onClose = () => {
    addBottomSheetRef.current?.close();
    setAddBottomSheetStatus(0);
  };

  const onCategorySelect = async (category: any) => {
    if (insertionIndex !== undefined) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const _destionations = [...destinations];
      const _selectionIndices = [...selectionIndices];
      _destionations.splice(insertionIndex + 1, 0, {
        id: category.id,
        name: category.name,
        icon: category.icon,
        options: [],
      });
      _selectionIndices.splice(insertionIndex + 1, 0, 0);
      setDestinations(_destionations);
      setSelectionIndices(_selectionIndices);
    }
  };

  const onLibrarySelect = (dest: any) => {
    console.log(dest);
    // if(insertionIndex !== undefined) {
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.Presets.easeInEaseOut,
    //   );
    //   const temp = [...tempPlaces];
    //   temp.splice(insertionIndex + 1, 0, {
    //     place
    //   });
    //   setTempPlaces(temp);
    // }
  };

  const onCustomSelect = (dest: any) => {
    console.log(dest);
  };

  return (
    <>
      {(addOptionsBottomSheetOpen || addBottomSheetStatus !== 0) && (
        <Pressable
          style={styles.dim}
          onPress={() => {
            addOptionsBottomSheetRef?.current.close();
            onClose();
          }}
        />
      )}

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

          <CButton onPress={() => addOptionsBottomSheetRef?.current.close()} />
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
        {addBottomSheetStatus === 1 && (
          <AddByCategory onClose={onClose} onSelect={onCategorySelect} />
        )}
        {addBottomSheetStatus === 2 && (
          <AddFromLibrary onClose={onClose} onSelect={onLibrarySelect} />
        )}
        {addBottomSheetStatus === 3 && (
          <AddCustomDest onClose={onClose} onSelect={onCustomSelect} />
        )}
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