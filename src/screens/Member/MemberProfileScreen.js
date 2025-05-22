import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/Member/BottomNav';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const MemberProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('')
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState('');
  const [selectedOption, setSelectedOption] = useState('muteOther');

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
      {/* Header & Form Content */}
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

          {/* Personal Details */}
          <Text className="text-black font-semibold text-2xl mb-4">Personal Details</Text>

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

          {/* Role Field */}
          <Text className="text-lg text-black mb-2">Role</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-8 bg-white text-black"
            editable={false}
            value={role}
          />

          {/* Notification Setting */}
          <Text className="text-black font-medium text-2xl mb-2">Notification Setting</Text>

          <TouchableOpacity
            onPress={() => setSelectedOption('muteAll')}
            className="flex-row items-center mb-3"
          >
            <View className="w-5 h-5 rounded-full border border-gray-500 mr-2 items-center justify-center">
              {selectedOption === 'muteAll' && (
                <View className="w-3 h-3 bg-black rounded-full" />
              )}
            </View>
            <Text className="text-lg text-black">Mute All Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedOption('muteOther')}
            className="flex-row items-center mb-8"
          >
            <View className="w-5 h-5 rounded-full border border-gray-500 mr-2 items-center justify-center">
              {selectedOption === 'muteOther' && (
                <View className="w-3 h-3 bg-blue-600 rounded-full" />
              )}
            </View>
            <Text className="text-lg text-black">Mute Other Society Notification</Text>
          </TouchableOpacity>

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
  )
}

export default MemberProfileScreen