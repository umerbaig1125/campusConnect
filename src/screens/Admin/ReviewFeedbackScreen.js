import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Admin/BottomNav';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const statusStyles = {
    'Normal': 'bg-yellow-400',
    'Bad': 'bg-red-300',
    'Very Good': 'bg-green-600',
    'Good': 'bg-green-300',
};

const ReviewFeedbackScreen = () => {
    const navigation = useNavigation();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('https://campus-connect-backend-eight.vercel.app/api/feedback');
                setFeedbacks(response.data);
            } catch (err) {
                console.error('Error fetching feedbacks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#00304f" />
                <Text className="mt-2 text-gray-500">Loading Feedbacks...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white pt-16 px-4">
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                </TouchableOpacity>
                <Text className="ml-3 text-3xl font-medium text-black">Review Feed Back</Text>
            </View>

            {/* Feedback List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {feedbacks.map((item, index) => (
                    <View key={index} className="mb-5 border-b-[2px] border-gray-300 pb-4">
                        <Text className="text-2xl font-extrabold text-[#00304f]">
                            {item.name} <Text className="text-gray-500 text-base">({item.role})</Text>
                        </Text>
                        <Text className="text-gray-500 text-sm">{item.email}</Text>

                        <View className="mt-2">
                            <Text className="text-gray-600">
                                Event: <Text className="font-semibold text-black">{item.eventName}</Text>
                            </Text>
                            <Text className="text-gray-600">
                                Event Date: <Text className="font-semibold text-black">{item.eventDate}</Text>
                            </Text>
                            <Text className="text-gray-600">
                                Venue: <Text className="font-semibold text-black">{item.eventVenue}</Text>
                            </Text>
                        </View>

                        <TouchableOpacity
                            className={`px-3 py-1 rounded mt-3 self-start ${statusStyles[item.rating] || 'bg-gray-300'}`}
                        >
                            <Text className="text-xs font-semibold text-black">{item.rating}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <BottomNav />
        </View>
    );
};

export default ReviewFeedbackScreen;
