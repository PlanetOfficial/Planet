import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SignUp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Too Bad</Text>
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

export default SignUp;
