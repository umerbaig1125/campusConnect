import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useRoute } from '@react-navigation/native';

const ConfirmPassword = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params;

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [Confirmpassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setConfirmShowPassword] = useState(false);

    const handleNewPassword = async () => {
        if (!password || !Confirmpassword) {
            ToastAndroid.show('Please enter your password and confirm password to continue.', ToastAndroid.SHORT);
            return;
        } else if (password !== Confirmpassword) {
            ToastAndroid.show('Password and confirm password must be the same.', ToastAndroid.SHORT);
            return;
        } else {
            try {
                const response = await fetch('https://campus-connect-backend-eight.vercel.app/api/auth/confirm-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                const data = await response.json();
                console.log("data", data)
                if (response.status === 200) {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                    navigation.navigate('Login');
                } else {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                }
            } catch (error) {
                console.error(error);
                ToastAndroid.show('Something went wrong. Please try again later.', ToastAndroid.SHORT);
            }
        }
    };

    return (
        <View className="flex-1 bg-white items-center">
            {/* Logo */}
            <Image
                className="h-[30%] w-[100%] mt-10"
                source={require('../../images/logo.png')}
                resizeMode="contain"
            />

            {/* Content Section with Gradient Background */}
            <LinearGradient
                colors={['#DEF2F9FF', '#f2f9fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // ← left to right
                style={{ height: '40%', width: '80%', borderRadius: 20 }}
                className="px-6 py-8"
            >
                <Text className="text-4xl font-black text-center mb-4 text-black">Change Password</Text>
                <Text className="text-gray-500 text-base text-center mb-6">
                    Create a new password to Continue!
                </Text>

                {/* Input Fields */}
                {/* Password Input with Toggle */}
                <View className="w-full h-12 px-4 bg-white rounded-lg flex-row items-center justify-between mb-8">
                    <TextInput
                        placeholder="New Password"
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
                <View className="w-full h-12 px-4 bg-white rounded-lg flex-row items-center justify-between mb-8">
                    <TextInput
                        placeholder="Confirm New Password"
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

                {/* Login Button */}
                <TouchableOpacity
                    className="w-full bg-[#28648f] py-4 items-center mb-6 rounded-lg mt-4 shadow-lg"
                    style={{
                        shadowColor: '#28648f',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 5, // for Android
                    }}
                    onPress={handleNewPassword}
                >
                    <Text className="text-white font-bold text-lg">Change Password</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default ConfirmPassword;
