import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {StyleSheet, Pressable} from 'react-native';

import {BottomSheetModal} from '@gorhom/bottom-sheet';

const SelectSubcategory = forwardRef((_prop, ref) => {
  useImperativeHandle(ref, () => ({
    onSubcategoryOpen,
    onSubcategorySelect,
  }));

  const [subcategoryBottomSheetOpen, setSubcategoryBottomSheetOpen] =
    useState<boolean>(false);
  const subcategoryBottomSheetRef = useRef<BottomSheetModal>(null);
  const subcategorySnapPoints = useMemo(() => ['40%'], []);
  const handleSubcategorySheetChange = useCallback(
    (_: number, toIndex: number) => {
      setSubcategoryBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [comp, setComp] = useState<React.ReactNode>(null);

  const onSubcategoryOpen = (_comp: React.ReactNode): void => {
    subcategoryBottomSheetRef.current?.present();
    setSubcategoryBottomSheetOpen(true);
    setComp(_comp);
  };

  const onSubcategorySelect = (): void => {
    subcategoryBottomSheetRef.current?.close();
    setSubcategoryBottomSheetOpen(false);
  };

  return (
    <>
      <BottomSheetModal
        ref={subcategoryBottomSheetRef}
        snapPoints={subcategorySnapPoints}
        onAnimate={handleSubcategorySheetChange}>
        {comp}
      </BottomSheetModal>

      {subcategoryBottomSheetOpen ? (
        <Pressable
          style={styles.dim}
          onPress={() => {
            subcategoryBottomSheetRef.current?.close();
          }}
        />
      ) : null}
    </>
  );
});

const styles = StyleSheet.create({
  dim: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SelectSubcategory;
