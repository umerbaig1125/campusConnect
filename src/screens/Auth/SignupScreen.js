import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, ToastAndroid, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Confirmpassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  // const handleSignup = async () => {
  //   if (!selectedSociety) {
  //     alert("Please select a society to continue");
  //     return;
  //   }

  //   if (password !== Confirmpassword) {
  //     alert("Passwords do not match");
  //     return;
  //   }

  //   const roleMap = {
  //     events: 'Events Society Member',
  //     sports: 'Sports Society Member',
  //     music: 'Music Society Member',
  //     media: 'Media and Film Society Member',
  //     health: 'Health and Fitness Member',
  //     debate: 'Debate Society Member'
  //   };

  //   const role = roleMap[selectedSociety];

  //   try {
  //     setLoading(true); // Start loading

  //     const response = await axios.post('https://campus-connect-backend-eight.vercel.app/api/auth/signup', {
  //       name,
  //       email,
  //       password,
  //       role
  //     });

  //     console.log('Signup successful', response.data);
  //     setName('');
  //     setEmail('');
  //     setPassword('');
  //     setConfirmPassword('');
  //     setSelectedSociety('');
  //     navigation.navigate('Login');
  //   } catch (error) {
  //     console.log('Error during signup', error.response || error.message);
  //     const errorMessage = error.response?.data?.message || 'Error during signup';
  //     if (Platform.OS === 'android') {
  //       ToastAndroid.show(errorMessage, ToastAndroid.LONG);
  //     } else {
  //       Alert.alert('Error', errorMessage);
  //     }
  //   } finally {
  //     setLoading(false); // End loading
  //   }
  // };

  const handleSignup = async () => {
    if (!selectedSociety) {
      alert("Please select a society to continue");
      return;
    }

    if (!email.toLowerCase().endsWith('@iqra.edu.pk')) {
      Alert.alert(
        "Invalid Email",
        "You need to use Iqra University's official email address to register."
      );
      return;
    }

    if (password !== Confirmpassword) {
      alert("Passwords do not match");
      return;
    }

    const roleMap = {
      events: 'Events Society Member',
      sports: 'Sports Society Member',
      music: 'Music Society Member',
      media: 'Media and Film Society Member',
      health: 'Health and Fitness Member',
      debate: 'Debate Society Member'
    };

    const role = roleMap[selectedSociety];

    try {
      setLoading(true); // Start loading

      const response = await axios.post('https://campus-connect-backend-eight.vercel.app/api/auth/signup', {
        name,
        email,
        password,
        role
      });

      console.log('Signup successful', response.data);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedSociety('');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error during signup', error.response || error.message);
      const errorMessage = error.response?.data?.message || 'Error during signup';
      if (Platform.OS === 'android') {
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <View className="flex-1 bg-white items-center">
      {/* Logo */}
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/40 justify-center items-center">
          <ActivityIndicator size="large" color="#28648f" />
        </View>
      )}
      <Image
        className="h-[30%] w-[100%] mt-6"
        source={require('../../images/logo.png')}
        resizeMode="contain"
      />

      {/* Content Section with Gradient Background */}
      <LinearGradient
        colors={['#DEF2F9FF', '#f2f9fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }} // ← left to right
        style={{ height: '60%', width: '80%', borderRadius: 20 }}
        className="px-6 py-8"
      >
        <Text className="text-4xl font-black text-center mb-4 text-black">Sign Up</Text>
        <Text className="text-gray-500 text-base text-center mb-6">
          Create an account to continue!
        </Text>

        {/* Input Fields */}
        <View className="w-full space-y-4 mb-4">

          {/* Name */}
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#868686FF"
            className="w-full h-12 px-4 bg-white rounded-lg mb-2 text-black"
            keyboardType="email-address"
            value={name}
            onChangeText={setName}
          />

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#868686FF"
            className="w-full h-12 px-4 bg-white rounded-lg mb-2 text-black"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input with Toggle */}
          <View className="w-full h-12 px-4 bg-white rounded-lg flex-row items-center justify-between mb-2">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#868686FF"
              className="flex-1 text-base pr-2 text-black"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={14}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input with Toggle */}
          <View className="w-full h-12 px-4 bg-white rounded-lg flex-row items-center justify-between mb-2">
            <TextInput
              placeholder="Connfirm Password"
              placeholderTextColor="#868686FF"
              className="flex-1 text-base pr-2 text-black"
              secureTextEntry={!showConfirmPassword}
              value={Confirmpassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setConfirmShowPassword(!showConfirmPassword)}>
              <Icon
                name={showConfirmPassword ? 'eye-slash' : 'eye'}
                size={14}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View className="w-full h-12 px-4 bg-white rounded-lg mb-2 justify-center items-center">
            <Picker
              selectedValue={selectedSociety}
              onValueChange={(itemValue, itemIndex) => setSelectedSociety(itemValue)}
              style={{
                height: 50,
                width: '100%',
                color: '#000',
              }}
            >
              <Picker.Item label="Select Society" value="" />
              <Picker.Item label="Events Society" value="events" />
              <Picker.Item label="Sports Society" value="sports" />
              <Picker.Item label="Music Society" value="music" />
              <Picker.Item label="Media and Film Society" value="media" />
              <Picker.Item label="Health and Fitness Society" value="health" />
              <Picker.Item label="Debate Society" value="debate" />
            </Picker>
          </View>

        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-[#28648f] py-4 items-center mb-4 rounded-lg mt-4 shadow-lg"
          style={{
            shadowColor: '#28648f',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5, // for Android
          }}
          onPress={handleSignup}
        >
          <Text className="text-white font-bold text-lg">Register</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600 text-base">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-[#28648f] font-semibold text-base">Login</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </View>
  )
}

export default SignupScreen
