import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Create = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.text}
        onPress={() => {
          navigation.goBack();
        }}>
        Create
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default Create;
