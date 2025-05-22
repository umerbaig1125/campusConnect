import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(null);

    const handleCode = async () => {
        if (!email.trim()) {
            ToastAndroid.show('Please enter your email address to get OTP code.', ToastAndroid.SHORT);
            return;
        }

        try {
            const response = await fetch('https://campus-connect-backend-eight.vercel.app/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                setOtp(data.otp); // Save OTP received from backend (only in dev, not production)
                console.log("otp", data.otp)
                navigation.navigate('ConfirmEmail', { email, otpData: data.otp });
            } else {
                ToastAndroid.show(data.message, ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.SHORT);
            console.error(error);
        }
    };

    return (
        <View className="flex-1 bg-white items-center">
            <Image
                className="h-[30%] w-[100%] mt-10"
                source={require('../../images/logo.png')}
                resizeMode="contain"
            />
            <LinearGradient
                colors={['#DEF2F9FF', '#f2f9fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // ← left to right
                style={{ height: '30%', width: '80%', borderRadius: 20 }}
                className="px-6 py-8"
            >
                <Text className="text-4xl font-black text-center mb-4 text-black">Forgot Password</Text>
                <Text className="text-gray-500 text-base text-center mb-6">Enter your email to get OTP</Text>
                <View className="w-full space-y-4 mb-4">
                    <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="#868686FF"
                        className="w-full h-12 px-4 bg-white rounded-lg mb-2 text-black"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <TouchableOpacity
                    className="w-full bg-[#28648f] py-4 items-center mb-6 rounded-lg mt-4 shadow-lg"
                    onPress={handleCode}
                >
                    <Text className="text-white font-bold text-lg">Send a Code</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default ForgotPasswordScreen;
