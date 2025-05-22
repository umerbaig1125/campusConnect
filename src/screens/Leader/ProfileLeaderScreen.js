import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/Leader/BottomNav';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const ProfileLeaderScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('')
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState('');

  const [loading, setLoading] = useState(false); // Add loading state

  const getStoredCredentials = async () => {
    try {
      const value = await AsyncStorage.getItem('credentials');
      if (value !== null) {
        const parsed = JSON.parse(value);
        setEmail(parsed.email || '');
        setName(parsed.name || '');
        setRole(parsed.role || '')
        if (parsed.imageUri) setImageUri(parsed.imageUri);
        if (parsed._id) setUserId(parsed._id); // <-- Add this line
      }
    } catch (error) {
      console.error('Error reading credentials from AsyncStorage:', error);
    }
  };

  const saveCredentials = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    console.log('Selected image URI:', imageUri);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);

    if (imageUri && !imageUri.startsWith('http')) {
      // Only append if it's a new image from picker
      const fileName = imageUri.split('/').pop();
      const fileType = fileName.split('.').pop();

      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `https://campus-connect-backend-eight.vercel.app/api/auth/update-profile/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = response.data.user;

      // Save updated data to AsyncStorage
      await AsyncStorage.setItem(
        'credentials',
        JSON.stringify({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          imageUri: `https://campus-connect-backend-eight.vercel.app${updatedUser.imageUrl}`,
        })
      );

      Alert.alert('Success', 'Profile updated successfully!');
      console.log("Profile updated successfully!")
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleImagePick = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response?.didCancel) return;
        if (response?.errorCode) {
          console.error('Image Picker Error: ', response.errorMessage);
          return;
        }

        const asset = response.assets && response.assets[0];
        if (asset?.uri) {
          setImageUri(asset.uri);
        }
      }
    );
  };

  useEffect(() => {
    getStoredCredentials();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={saveCredentials} style={{ marginRight: 15 }}>
          <Ionicons name="save-outline" size={25} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, email, imageUri]);

  return (
    <View className="flex-1 bg-white">
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/40 justify-center items-center">
          <ActivityIndicator size="large" color="#28648f" />
        </View>
      )}
      <View className="flex-1 pt-12 px-4">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-sharp" size={26} color="#000" />
            </TouchableOpacity>
            <Text className="text-2xl font-medium text-black ml-2">My Profile</Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity onPress={saveCredentials}>
              <Text className="text-blue-400 font-medium text-xl">Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Profile Picture */}
          <View className="items-center mb-6">
            <View className="relative w-24 h-24">
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : { uri: 'https://i.pravatar.cc/150?img=5' }
                }
                className="w-24 h-24 rounded-full"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full"
                onPress={handleImagePick}
              >
                <MaterialIcons name="edit" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Name Field */}
          <Text className="text-lg text-black mb-2">Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-black"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#868686FF"
          />

          {/* Email Field */}
          <Text className="text-lg text-black mb-2">Email Address</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-black"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            placeholderTextColor="#868686FF"
          />

          {/* Role Field (Static) */}
          <Text className="text-lg text-black mb-2">Role</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-8 bg-white text-black"
            editable={false}
            value={role}
          />
        </ScrollView>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-[#ffe100] rounded-lg py-3 items-center mb-4"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-black font-medium text-lg">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

export default ProfileLeaderScreen;
