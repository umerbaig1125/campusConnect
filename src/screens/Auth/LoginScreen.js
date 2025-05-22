import { View, Text, TextInput, TouchableOpacity, Image, Platform, ToastAndroid, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import GoogleLogo from '../../components/GoogleLogo';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import axios from 'axios';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        // Load credentials on mount
        AsyncStorage.getItem('credentials').then((value) => {
            if (value) {
                const { email, password } = JSON.parse(value);
                setEmail(email);
                setPassword(password);
                setRememberMe(true);
            }
        });
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '"1:724557463446:web:9d130dd896a5f52102a7b7', // From Firebase Console
        });
    }, []);

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Google user info:', userInfo);
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    const handleAppleLogin = async () => {
        if (Platform.OS === 'android') {
            console.log("apple")
            ToastAndroid.show("Apple login not supported on Android", ToastAndroid.SHORT);
            return;
        }

        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            console.log('Apple login response:', appleAuthRequestResponse);
        } catch (error) {
            console.error('Apple login error:', error);
            Alert.alert('Apple Login Failed', 'Something went wrong during Apple login.');
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true); // Start loading
            const response = await axios.post('https://campus-connect-backend-eight.vercel.app/api/auth/login', {
                email,
                password
            });

            const { name, _id, imageUrl, role } = response.data.user;

            if (rememberMe) {
                AsyncStorage.setItem('credentials', JSON.stringify({ email, password, name, _id, imageUrl, role }));
            }

            if (email === 'admin@gmail.com' && password === password) {
                navigation.navigate('AdminHome', { name, email, imageUrl, role });
            } else if (
                role === 'user' ||
                role === 'Sports Society Member' ||
                role === 'Music Society Member' ||
                role === 'Arts Society Member' ||
                role === 'Robotics Society Member'
            ) {
                navigation.navigate('MemberHome', { name, email, imageUrl, role });
            } else {
                navigation.navigate('LeaderHome', { name, email, imageUrl, role });
            }

            setEmail('');
            setPassword('');
        } catch (error) {
            console.log('Error during login', error);
            Alert.alert("Login Failed", "Invalid email or password.");
        } finally {
            setLoading(false); // Stop loading in both success and error
        }
    };

    return (
        <View className="flex-1 bg-white items-center">
            {/* Logo */}

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
                <Text className="text-4xl font-black text-center mb-4 text-black">Login</Text>
                <Text className="text-gray-500 text-base text-center mb-6">
                    Enter your email and password to log in
                </Text>

                {/* Input Fields */}
                <View className="w-full space-y-4 mb-4">
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
                    <View className="w-full h-12 px-4 bg-white rounded-lg flex-row items-center justify-between">
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
                </View>

                {/* Remember & Forgot */}
                <View className="w-full flex-row justify-between items-center mb-6">
                    <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <View className="w-5 h-5 border border-gray-400 rounded mr-2 items-center justify-center bg-white">
                            {rememberMe && <Icon name="check" size={12} color="#000" />}
                        </View>
                        <Text className="text-base text-gray-700">Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
                        <Text className="text-base text-[#28648f] font-semibold">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="w-full bg-[#28648f] py-4 items-center mb-6 shadow-md rounded-lg"
                    style={{
                        shadowColor: '#28648f',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 5,
                    }}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Login</Text>
                    )}
                </TouchableOpacity>

                {/* Or login with */}
                <View className="flex-row items-center mb-4">
                    <View className="flex-1 h-0.5 bg-white" />
                    <Text className="mx-4 text-gray-500">Or login with</Text>
                    <View className="flex-1 h-0.5 bg-white" />
                </View>

                {/* Social Login Buttons */}
                <View className="flex-row space-x-4 mb-6 justify-between">
                    <TouchableOpacity
                        onPress={handleGoogleLogin}
                        className="flex-row items-center px-5 py-3 bg-white rounded-lg shadow-sm w-[45%] justify-center"
                    >
                        <GoogleLogo size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleAppleLogin}
                        className="flex-row items-center px-5 py-3 bg-white rounded-lg shadow-sm w-[45%] justify-center"
                    >
                        <Icon name="apple" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Signup prompt */}
                <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-600 text-base">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text className="text-[#28648f] font-semibold text-base">Signup</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

export default LoginScreen;
