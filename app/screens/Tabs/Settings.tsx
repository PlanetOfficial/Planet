import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import strings from '../../constants/strings';
import EncryptedStorage from 'react-native-encrypted-storage';

const ProfileScreen = ({navigation}) => {
  const handleLogout = async () => {
    // TODO: remove authentication token

    await EncryptedStorage.removeItem("auth_token");

    navigation.navigate('Login');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput placeholder={strings.settings.firstName} style={styles.input} />
      <TextInput placeholder={strings.settings.lastName} style={styles.input} />
      <TextInput placeholder={strings.login.email} style={styles.input} />
      <TextInput placeholder={strings.login.password} secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{strings.main.save}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotButtonText}>{strings.settings.resetPassword}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.upgradeButton}>
        <Text style={styles.upgradeButtonText}>{strings.settings.upgrade}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
        <Text style={styles.logoutButtonText}>{strings.settings.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: 20,
  },
  forgotButtonText: {
    color: '#1E90FF',
    fontSize: 14,
  },
  upgradeButton: {
    marginTop: 20,
  },
  upgradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default ProfileScreen;
