import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Member/BottomNav';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

const MemberNotificationsScreen = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state

    // Fetch events from backend and generate notification messages
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://campus-connect-backend-eight.vercel.app/api/events');
            const events = res.data;

            // Convert each event into a notification format
            const mapped = events.map((event) => ({
                id: event._id,
                message: `New event "${event.name}" created by ${event.createdBy} on ${moment(event.date).format("DD MMM YYYY")} at ${event.venue}`,
                read: false,
            }));

            setNotifications(mapped.reverse()); // Latest first
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        setNotifications(updated);
    };

    return (
        <View className="flex-1 bg-white pt-16 px-4">
            {loading && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/40 justify-center items-center">
                    <ActivityIndicator size="large" color="#28648f" />
                </View>
            )}
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                </TouchableOpacity>
                <Text className="text-3xl font-medium text-black ml-2">Notifications</Text>
            </View>

            {/* Notifications List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {notifications.map((item) => (
                    <View
                        key={item.id}
                        className="flex-row items-center justify-between bg-gray-200 rounded-lg px-4 py-4 mb-3"
                    >
                        <Text className="text-black text-sm flex-1">{item.message}</Text>
                        {!item.read && <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />}
                    </View>
                ))}

                {/* Mark all as read */}
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={markAllAsRead} className="mt-2 mb-6">
                        <Text className="text-red-500 font-medium">Mark all as read</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Bottom Nav */}
            <BottomNav />
        </View>
    )
}

export default MemberNotificationsScreen