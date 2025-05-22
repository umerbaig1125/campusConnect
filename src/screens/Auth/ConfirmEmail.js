import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import React, { useState, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';

const ConfirmEmail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email, otpData } = route.params;

    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to the next input field automatically
        if (text && index < 3) {
            inputRefs.current[index + 1].focus(); // move to next input
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus(); // move back
        }
    };

    const handlePaste = (e) => {
        const pastedText = e.nativeEvent.text;
        if (pastedText.length === 4) {
            setOtp(pastedText.split('')); // Split the pasted OTP string into individual digits
        }
    };

    const handleCode = () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 4) {
            ToastAndroid.show('Please enter a valid OTP.', ToastAndroid.SHORT);
            return;
        }

        // Convert otpData to string to ensure type consistency
        const otpDataString = otpData.toString();

        // Compare entered OTP with the otpData passed from the previous screen
        console.log('Entered OTP:', otpCode); // Debugging log
        console.log('Expected OTP:', otpDataString); // Debugging log

        if (otpCode === otpDataString) {
            navigation.navigate('ConfirmPassword', { email });
        } else {
            ToastAndroid.show('Invalid OTP. Please try again.', ToastAndroid.SHORT);
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
                style={{ height: '35%', width: '80%', borderRadius: 20 }}
                className="px-6 py-8"
            >
                <Text className="text-4xl font-black text-center mb-4 text-black">Confirm your{'\n'}Email</Text>

                <View className="flex-row justify-center mt-2 mb-2">
                    <Text className="text-gray-600 text-base">Your email</Text>
                    <Text className="text-gray-600 text-base font-extrabold"> {email}  </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
                        <Text className="text-[#28648f] font-semibold text-base">Didn't you?</Text>
                    </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View className="flex-row justify-between w-full mb-6 px-4">
                    {[0, 1, 2, 3].map((i) => (
                        <TextInput
                            key={i}
                            ref={(ref) => (inputRefs.current[i] = ref)}
                            placeholderTextColor="#868686FF"
                            className="w-14 h-14 text-center border border-gray-400 rounded-lg text-lg bg-white text-black"
                            maxLength={1}
                            keyboardType="numeric"
                            value={otp[i]}
                            onChangeText={(text) => handleChange(text, i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            onPaste={handlePaste} // Handle paste event
                        />
                    ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className="w-full bg-[#28648f] py-4 items-center mb-6 rounded-lg mt-4 shadow-lg"
                    style={{
                        shadowColor: '#28648f',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 5, // for Android
                    }}
                    onPress={handleCode}
                >
                    <Text className="text-white font-bold text-lg">Submit</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default ConfirmEmail;
