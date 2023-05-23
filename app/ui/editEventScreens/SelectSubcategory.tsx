import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {StyleSheet, View, Pressable, TouchableOpacity} from 'react-native';

import {s} from 'react-native-size-matters';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import Text from '../components/Text';
import CButton from '../components/CancelButton';
import {Subcategory} from '../../utils/interfaces/types';

interface ChildComponentProps {}

const SelectSubcategory = forwardRef((props: ChildComponentProps, ref) => {
  // const {} = props;

  useImperativeHandle(ref, () => ({
    onSubcategoryOpen,
  }));

  const [subcategoryBottomSheetOpen, setSubcategoryBottomSheetOpen] =
    useState<boolean>(false);
  const subcategoryBottomSheetRef = useRef<BottomSheetModal>(null);
  const subcategorySnapPoints = useMemo(() => [s(260)], []);
  const handleSubcategorySheetChange = useCallback(
    (_: number, toIndex: number) => {
      setSubcategoryBottomSheetOpen(toIndex === 0);
    },
    [],
  );

  const [subcategories, setSubcategories] = useState<Subcategory[]>();
  const [setSubcategory, setSetSubcategory] =
    useState<(subcategory: Subcategory | null) => void>();

  const onSubcategoryOpen = (_subcategories: Subcategory[]): void => {
    subcategoryBottomSheetRef.current?.present();
    setSubcategoryBottomSheetOpen(true);
    setSubcategories(_subcategories);
    setSetSubcategory(setSubcategory);
  };

  return (
    <>
      <BottomSheetModal
        ref={subcategoryBottomSheetRef}
        snapPoints={subcategorySnapPoints}
        onAnimate={handleSubcategorySheetChange}>
        <View>
          {subcategories?.map((subcategory: Subcategory, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSubcategory ? setSubcategory(subcategory) : null;
                subcategoryBottomSheetRef.current?.close();
              }}>
              <Text size="m" weight="r">
                {subcategory.name}
              </Text>
            </TouchableOpacity>
          ))}
          <CButton onPress={() => subcategoryBottomSheetRef.current?.close()} />
        </View>
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
