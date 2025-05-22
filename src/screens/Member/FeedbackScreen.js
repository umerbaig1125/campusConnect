import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../../components/Member/BottomNav';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const feedbackLabels = [
    { label: 'Very Bad', color: '#ff7676' },
    { label: 'Bad', color: '#ffa0a0' },
    { label: 'Normal', color: '#ffe100' },
    { label: 'Good', color: '#9fffae' },
    { label: 'Very Good', color: '#6bed7e' },
];

const FeedbackScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [searchText, setSearchText] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('')
    const [userId, setUserId] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        imageUrl: '',
        role: '',
    });


    const lightColors = [
        '#cfeeff', '#fff4a3', '#f9c6c9', '#d3f8e2', '#fce1e4',
        '#f6e2b3', '#e0f0f6', '#e3dffd', '#ffefd5', '#c2f0c2'
    ];

    const getRandomColor = () => {
        const getRandomValue = () => Math.floor(Math.random() * 56) + 200; // Random value between 200 and 255

        const r = getRandomValue();
        const g = getRandomValue();
        const b = getRandomValue();

        return `rgb(${r}, ${g}, ${b})`;
    };

    const filteredEvents = useMemo(() => {
        const lowerSearch = searchText.toLowerCase();

        const filtered = events.filter(event =>
            event.name.toLowerCase().includes(lowerSearch)
        );

        return filtered.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
    }, [searchText, events]);

    useEffect(() => {
        getStoredCredentials();
        fetchPastEvents();
    }, []);

    useEffect(() => {
        if (email) {
            fetchPastEvents();
        }
    }, [email]);

    const fetchPastEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://campus-connect-backend-eight.vercel.app/api/events/past?email=${email}`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching past events:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const getStoredCredentials = async () => {
        try {
            const value = await AsyncStorage.getItem('credentials');
            if (value !== null) {
                const parsed = JSON.parse(value);
                setEmail(parsed.email || '');
                setName(parsed.name || '');
                setRole(parsed.role || '')
                if (parsed.imageUri) setImageUri(parsed.imageUri);
                if (parsed._id) setUserId(parsed._id); // <-- Add this line
            }
        } catch (error) {
            console.error('Error reading credentials from AsyncStorage:', error);
        }
    };

    useEffect(() => {
        getStoredCredentials();
    }, []);

    const submitFeedback = async (eventId, rating, eventName, eventDate, eventTime, eventVenue) => {
        try {
            setLoading(true);
            await axios.post('https://campus-connect-backend-eight.vercel.app/api/feedback', {
                eventId,
                eventName,
                eventDate,
                eventTime,
                eventVenue,
                name,
                email,
                role,
                rating
            });

            Alert.alert('Feedback Submitted', `You rated "${eventName}" as ${rating}`);

            // Remove the event from the list locally
            setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', 'Failed to submit feedback');
        } finally {
            setLoading(false); // End loading
        }
    };

    const renderFeedbackCard = ({ item }) => (
        <View className="rounded-xl p-8 mb-4 flex-row justify-between items-center" style={{ backgroundColor: getRandomColor() }}>
            <View className="flex-1 pr-2">
                <View className='flex-row justify-between mb-4 h-16'>
                    <View>
                        <Text className="text-xl font-bold text-black">{item.name}</Text>
                        <Text className="text-base text-gray-700 mt-1">{item.time} | {new Date(item.date).toLocaleDateString()}</Text>
                        <Text className="text-base text-gray-700">{item.venue}</Text>
                    </View>
                    {item.image ? (
                        <Image source={{ uri: item.image }} className="w-16 h-16" resizeMode="contain" />
                    ) : (
                        <Ionicons name="image-outline" size={28} color="#ccc" />
                    )}
                </View>

                <View className="flex-row flex-wrap mt-3">
                    {feedbackLabels.map(({ label, color }) => (
                        <TouchableOpacity
                            key={label}
                            style={{ backgroundColor: color }}
                            className="w-[60px] items-center py-1 rounded-md mr-3 mb-2"
                            onPress={() => submitFeedback(
                                item._id,
                                label,
                                item.name,
                                new Date(item.date).toLocaleDateString(),
                                item.time,
                                item.venue
                            )}
                        >
                            <Text className="text-xs font-semibold text-black">{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white px-4 pt-16">
            <TouchableOpacity className="flex-row items-center mb-4">
                <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                <Text className="text-3xl font-bold ml-2 text-black">Feedback</Text>
            </TouchableOpacity>

            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
                <TextInput
                    placeholder="Search Event"
                    placeholderTextColor="#868686FF"
                    className="ml-2 flex-1 text-base text-black"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <Ionicons name="search" size={20} color="#6B7280" />
            </View>

            <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item._id}
                renderItem={renderFeedbackCard}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <Text className="text-center text-gray-500 mt-10">
                        {searchText ? 'No events match your search.' : 'No past events available for feedback.'}
                    </Text>
                )}
            />

            {/* Bottom Navigation */}
            <BottomNav />
        </View>
    );
};

export default FeedbackScreen;
