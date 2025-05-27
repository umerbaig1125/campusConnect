import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/Admin/BottomNav';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
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

  const [showVoteModal, setShowVoteModal] = useState(false);
  const [voteTitle, setVoteTitle] = useState('')
  const [voteDate, setVoteDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    const fetchVotingData = async () => {
      const start = await AsyncStorage.getItem('voteStart');
      const end = await AsyncStorage.getItem('voteEnd');

      if (start && end) {
        const eligible = checkVotingEligibility(start, end);
        if (eligible) {
          navigation.navigate('VotingScreen'); // Replace with actual screen
        }
      }
    };

    fetchVotingData();
  }, []);

  const getStoredCredentials = async () => {
    try {
      const value = await AsyncStorage.getItem('credentials');
      if (value !== null) {
        const parsed = JSON.parse(value);
        setEmail(parsed.email || '');
        setName(parsed.name || '');
        if (parsed.imageUri) {
          setImageUri(parsed.imageUri);
        } else {
          setImageUri(null); // fallback to dummy image later
        }
        if (parsed._id) setUserId(parsed._id); // <-- Add this line
      }
    } catch (error) {
      console.error('Error reading credentials from AsyncStorage:', error);
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    const data = new FormData();
    data.append('file', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpg',
    });
    data.append('upload_preset', 'your_preset_here'); // from Cloudinary
    data.append('cloud_name', 'your_cloud_name');

    const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    return json.secure_url;
  };

  const saveCredentials = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    console.log('Selected image URI:', imageUri);

    const formData = new FormData();
    const cloudUrl = await uploadImageToCloudinary(imageUri);
    formData.append('imageUrl', cloudUrl);
    formData.append('name', name);
    formData.append('email', email);

    if (imageUri && !imageUri.startsWith('http')) {
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
        {
          name,
          email,
          imageUrl: cloudUrl,
        }, // ✅ send JSON only
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedUser = response.data.user;

      await AsyncStorage.setItem(
        'credentials',
        JSON.stringify({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          imageUri: updatedUser.imageUrl
            ? `https://campus-connect-backend-eight.vercel.app${updatedUser.imageUrl}`
            : null,
        })
      );

      Alert.alert('Success', 'Profile updated successfully!');
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };


  const checkVotingEligibility = (startDateTime, endDateTime) => {
    const now = new Date();
    return now >= new Date(startDateTime) && now <= new Date(endDateTime);
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

  const saveVotingTime = async () => {
    try {
      const payload = {
        title: voteTitle,
        date: voteDate.toISOString().split('T')[0],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      console.log("payload", payload);

      const response = await axios.post('https://campus-connect-backend-eight.vercel.app/api/voting/set-time', payload);

      console.log("response", response)

      // ✅ Store in AsyncStorage for later use
      await AsyncStorage.setItem('voteStart', payload.startTime);
      await AsyncStorage.setItem('voteEnd', payload.endTime);

      Alert.alert('Success', 'Voting time saved!');
      setShowVoteModal(false);
    } catch (error) {
      console.error("Error saving voting time:", error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save voting time');
    }
  };

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
            <TouchableOpacity className="mr-2" onPress={() => setShowVoteModal(true)}>
              <MaterialIcons name="how-to-vote" size={24} color="#000" />
            </TouchableOpacity>
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
                    : { uri: 'https://i.pravatar.cc/150?img=5' } // dummy
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
                  <Picker.Item label="Events Society Leader" value="Events Society Leader" />
                  <Picker.Item label="Sports Society Leader" value="Sports Society Leader" />
                  <Picker.Item label="Music Society Leader" value="Music Society Leader" />
                  <Picker.Item label="Media and Film Society Leader" value="Media and Film Society Leader" />
                  <Picker.Item label="Health and Fitness Leader" value="Health and Fitness Leader" />
                  <Picker.Item label="Debate Society Leader" value="Debate Society Leader" />

                  <Picker.Item label="Events Society Member" value="Events Society Member" />
                  <Picker.Item label="Sports Society Member" value="Sports Society Member" />
                  <Picker.Item label="Music Society Member" value="Music Society Member" />
                  <Picker.Item label="Media and Film Society Member" value="Media and Film Society Member" />
                  <Picker.Item label="Health and Fitness Member" value="Health and Fitness Member" />
                  <Picker.Item label="Debate Society Member" value="Debate Society Member" />
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

      {showVoteModal && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <Text className="text-xl font-bold text-center mb-4">Set Voting Time</Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white text-black"
              value={voteTitle}
              onChangeText={setVoteTitle}
              placeholder="Enter Voting Title"
              placeholderTextColor="#868686FF"
            />

            {/* Date Picker */}
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-4 py-3 mb-3 bg-white"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-black">Voting Date: {voteDate.toDateString()}</Text>
            </TouchableOpacity>

            {/* Start Time Picker */}
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-4 py-3 mb-3 bg-white"
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text className="text-black">Start Time: {startTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>

            {/* End Time Picker */}
            <TouchableOpacity
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white"
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text className="text-black">End Time: {endTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity
              className="bg-[#28648f] rounded-lg py-3 items-center mb-2"
              onPress={saveVotingTime}
            >
              <Text className="text-white font-semibold text-lg">Save</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity onPress={() => setShowVoteModal(false)}>
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={voteDate}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setVoteDate(selectedDate);
          }}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(e, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(e, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }}
        />
      )}
    </View>
  );
};

export default ProfileScreen;
