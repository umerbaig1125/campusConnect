import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/Admin/BottomNav';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetEmail, setTargetEmail] = useState('');
  const [targetRole, setTargetRole] = useState('user');

  const [loading, setLoading] = useState(false); // Add loading state

  const getStoredCredentials = async () => {
    try {
      const value = await AsyncStorage.getItem('credentials');
      if (value !== null) {
        const parsed = JSON.parse(value);
        setEmail(parsed.email || '');
        setName(parsed.name || '');
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
        { name, email }, // only send simple JSON
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

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

  const updateUserRole = async () => {
    if (!targetEmail || !targetRole) {
      Alert.alert("Error", "Email and role are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put('https://campus-connect-backend-eight.vercel.app/api/auth/update-role', {
        email: targetEmail,
        role: targetRole,
      });

      Alert.alert("Success", response.data.message);
      setShowRoleModal(false);
    } catch (error) {
      console.error("Update role error:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false); // End loading
    }
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
    <View className="flex-1 bg-white pt-4">
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
            <TouchableOpacity className="mr-2" onPress={() => setShowRoleModal(true)}>
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
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
            placeholderTextColor="#868686FF"
            keyboardType="email-address"
          />

          {/* Role Field (Static) */}
          <Text className="text-lg text-black mb-2">Role</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-8 bg-white text-black"
            editable={false}
            value="Admin"
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

      {showRoleModal && (
        <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 w-[100%] h-[100%]">
          <View className="bg-white w-11/12 max-w-xl p-6 rounded-2xl shadow-lg">
            <Text className="text-2xl font-semibold text-center mb-4">Change User Role</Text>

            <View>
              <TextInput
                placeholder="Enter user email"
                placeholderTextColor="#868686FF"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-black bg-white"
                value={targetEmail}
                onChangeText={setTargetEmail}
                keyboardType="email-address"
              />

              <View className="border border-gray-300 rounded-lg px-2 py-1 mb-4 bg-white">
                <Picker
                  selectedValue={targetRole}
                  onValueChange={(itemValue) => setTargetRole(itemValue)}
                  dropdownIconColor="#000"
                  style={{ color: 'black' }}
                >
                  <Picker.Item label="Select a role" value="" />
                  <Picker.Item label="Sports Society Leader" value="Sports Society Leader" />
                  <Picker.Item label="Music Society Leader" value="Music Society Leader" />
                  <Picker.Item label="Arts Society Leader" value="Arts Society Leader" />
                  <Picker.Item label="Robotics Society Leader" value="Robotics Society Leader" />
                  <Picker.Item label="Sports Society Member" value="Sports Society Member" />
                  <Picker.Item label="Music Society Member" value="Music Society Member" />
                  <Picker.Item label="Arts Society Member" value="Arts Society Member" />
                  <Picker.Item label="Robotics Society Member" value="Robotics Society Member" />
                </Picker>
              </View>

            </View>

            <View className="flex-row space-x-3 justify-around">
              <TouchableOpacity
                onPress={() => setShowRoleModal(false)}
                className="px-16 py-4 bg-gray-200 rounded-lg"
              >
                <Text className="text-black font-bold text-base">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={updateUserRole}
                className="px-16 py-4 bg-[#ffe100] rounded-lg"
              >
                <Text className="text-black font-bold text-base">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;
