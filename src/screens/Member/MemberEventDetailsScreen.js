import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Member/BottomNav';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MemberEventDetailsScreen = () => {
    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const route = useRoute();
    const { _id, name, date, time, image, venue, desc } = route.params;

    const getStoredCredentials = async () => {
        try {
            const value = await AsyncStorage.getItem('credentials');
            if (value !== null) {
                const parsed = JSON.parse(value);
                setEmail(parsed.email || '');
                setUserName(parsed.name || '');
                setRole(parsed.role || '')
                if (parsed.imageUri) setImageUri(parsed.imageUri);
                if (parsed._id) setUserId(parsed._id); // <-- Add this line
            }
        } catch (error) {
            console.error('Error reading credentials from AsyncStorage:', error);
        }
    };

    const checkIfRegistered = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://campus-connect-backend-eight.vercel.app/api/events/registration-status/${userId}/${_id}`);
            if (response.data.isRegistered) {
                setIsRegistered(true);
            }
        } catch (error) {
            console.error("Error checking registration status:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        getStoredCredentials();
    }, []);

    useEffect(() => {
        if (userId) {
            checkIfRegistered();
        }
    }, [userId]);

    const handleRegister = async () => {
        if (isRegistered) {
            Alert.alert("Already Registered", "You are already registered for this event.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                userId,
                userName,
                email,
                imageUri,
                event: _id, // <-- use the correct event ID
            };

            const response = await axios.post('https://campus-connect-backend-eight.vercel.app/api/events/register', payload);

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Success", "You have been registered for the event!");
                setIsRegistered(true); // Disable the button after successful registration
            } else {
                Alert.alert("Error", "Failed to register for the event.");
            }

        } catch (error) {
            console.error("Registration error:", error);
            Alert.alert("Error", "An error occurred while registering.");
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <View className="flex-1 bg-white pt-10 px-4">
            {loading && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/40 justify-center items-center">
                    <ActivityIndicator size="large" color="#28648f" />
                </View>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-sharp" size={26} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-medium text-black ml-2">{name}</Text>
                </View>

                {/* Event Image */}
                <Image
                    source={{ uri: image }}
                    className="w-full h-60 rounded-xl mb-4"
                    resizeMode="cover"
                />

                {/* Event Title & Description */}
                <Text className="text-4xl font-semibold text-black mb-1">{name}</Text>
                <Text className="text-gray-500 mb-5 text-lg">
                    {desc}
                </Text>

                {/* View Members Button */}
                <TouchableOpacity
                    className={`bg-[#ffe100] py-2 rounded-lg mb-8 ${isRegistered ? 'bg-gray-300' : ''}`}
                    onPress={handleRegister}
                    disabled={isRegistered} // Disable button if already registered
                >
                    <Text className="text-center font-semibold text-black text-xl">
                        {isRegistered ? 'Already Registered' : 'Register Now'}
                    </Text>
                </TouchableOpacity>

                {/* Event Info */}
                <View className="mb-3">
                    <Text className="font-semibold text-black text-2xl">Venue:</Text>
                    <Text className="text-gray-700 text-lg">{venue}</Text>
                </View>

                <View className="mb-3">
                    <Text className="font-semibold text-black text-2xl">Event Date</Text>
                    <Text className="text-gray-700 text-lg">
                        {new Date(date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </View>

                <View className="mb-8">
                    <Text className="font-semibold text-black text-2xl">Event Time</Text>
                    <Text className="text-gray-700 text-lg">{time}</Text>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav />
        </View>
    );
};

export default MemberEventDetailsScreen;
