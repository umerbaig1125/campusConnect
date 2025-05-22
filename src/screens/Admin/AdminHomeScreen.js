import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Admin/BottomNav';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, email, imageUrl, role } = route.params || {};
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    imageUrl: '',
    role: '',
  });
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isFocused = useIsFocused();

  const profileImage = userInfo.imageUrl
    ? { uri: `https://campus-connect-backend-eight.vercel.app${userInfo.imageUrl}` } // use your base URL
    : { uri: 'https://i.pravatar.cc/100' }; // fallback dummy image


  const lightColors = [
    '#cfeeff', '#fff4a3', '#f9c6c9', '#d3f8e2', '#fce1e4',
    '#f6e2b3', '#e0f0f6', '#e3dffd', '#ffefd5', '#c2f0c2'
  ];

  const fetchTodayEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://campus-connect-backend-eight.vercel.app/api/events/today');
      setTodayEvents(response.data);
    } catch (error) {
      console.error('Error fetching today’s events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try getting from route.params first
        if (route?.params) {
          const { name, email, imageUrl, role } = route.params;
          setUserInfo({ name, email, imageUrl, role });
        } else {
          // Fallback to AsyncStorage
          const storedData = await AsyncStorage.getItem('credentials');
          if (storedData) {
            const { name, email, imageUrl, role } = JSON.parse(storedData);
            setUserInfo({ name, email, imageUrl, role });
          }
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused, route?.params]);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://campus-connect-backend-eight.vercel.app/api/events/today');
        setTodayEvents(response.data);
      } catch (error) {
        console.error('Error fetching today’s events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayEvents();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('https://campus-connect-backend-eight.vercel.app/api/events');
        const events = res.data;

        const mapped = events
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sort newest first
          .slice(0, 3) // take top 3
          .map((event) => ({
            id: event._id,
            message: `New event "${event.name}" created by ${event.createdBy?.name || 'someone'}`,
          }));

        setNotifications(mapped);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (isFocused) {
      fetchNotifications();
    }
  }, [isFocused]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-16">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="min-h-fit">
            <Text className="text-[#40647b] text-xl mb-2">Welcome,</Text>
            <Text className="text-[#00304f] font-bold text-2xl mb-2">
              {userInfo.name} <Text className="text-sm text-gray-400 mb-5">({userInfo.role})</Text>
            </Text>
          </View>
          <Image
            source={profileImage}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />
        </View>

        {/* Today Section */}
        <Text className="text-[#000000] text-3xl font-extrabold mb-3">Today</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0084b5" className="mt-4" />
        ) : (
          <View className="mb-6 mt-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todayEvents.map((event, index) => {
                const randomColor = lightColors[index % lightColors.length]; // consistent random color per item

                return (
                  <View
                    key={index}
                    className="mr-4 w-72 h-40 flex-none relative rounded-3xl"
                  >
                    {/* Bottom View (always black) */}
                    <View className="bg-black rounded-3xl px-4 py-2 h-full justify-end z-0">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-white text-xs">{event.time}</Text>
                        {/* <Ionicons name="add-circle-outline" size={26} color="white" /> */}
                        <TouchableOpacity
                          onPress={() => navigation.navigate('AddEvent', {
                            eventData: event,
                            onUpdate: fetchTodayEvents // fix reference to your actual fetch method
                          })}
                        >
                          <Ionicons name="add-circle-outline" size={26} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Top View (random light color) */}
                    <View className="absolute -top-2 left-0 right-0 z-10 rounded-3xl mt-2">
                      <View style={{ backgroundColor: randomColor }} className="p-8 flex-row justify-between rounded-3xl">
                        <View>
                          <Text className="text-[#00304f] text-sm mb-1">{event.venue}</Text>
                          <Text className="text-[#00304f] text-lg font-semibold">{event.name}</Text>
                        </View>
                        <Image
                          source={{ uri: event.image }}
                          className="w-12 h-12 rounded-lg"
                        />
                      </View>
                    </View>
                  </View>
                );
              })}

              {todayEvents.length === 0 && (
                <Text className="text-gray-400 mt-4">No events today.</Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* Quick Buttons */}
        <View className="flex-row flex-wrap justify-between gap-3 mb-6">
          <TouchableOpacity
            className="bg-[#c8e8d9] p-4 rounded-xl w-[47%] flex-row justify-between mb-2"
            onPress={() => navigation.navigate('Event')}
          >
            <Text className="text-gray-800 font-medium">All Events</Text>
            <Feather name="arrow-right" size={24} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#edceca] p-4 rounded-xl w-[47%] flex-row justify-between mb-2"
            onPress={() => navigation.navigate('AddEvent')}
          >
            <Text className="text-gray-800 font-medium">Create Event</Text>
            <Feather name="arrow-right" size={24} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#fff4a3] p-4 rounded-xl w-[47%] flex-row justify-between"
            onPress={() => navigation.navigate('Review')}
          >
            <Text className="text-gray-800 font-medium">Review Feedback</Text>
            <Feather name="arrow-right" size={24} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#e0f0f6] p-4 rounded-xl w-[47%] flex-row justify-between"
            onPress={() => navigation.navigate('Profile')}
          >
            <Text className="text-gray-800 font-medium">Profile Setting</Text>
            <Feather name="arrow-right" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Notification */}
        <View className="mb-4 mt-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl text-black font-extrabold">Notification</Text>
            <TouchableOpacity
              className="w-[47%] flex-row justify-end"
              onPress={() => navigation.navigate('Notification')}
            >
              <Text className="text-gray-800 font-medium">View all</Text>
              <Feather name="arrow-up-right" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {notifications.map((item, index) => (
            <View
              key={item.id || index}
              className="bg-[#d8d8d8] rounded-lg p-5 mb-2 flex-row justify-between items-center"
            >
              <Text className="text-gray-700 text-sm flex-1 pr-2">
                {item.message}
              </Text>
              <View className="w-2 h-2 rounded-full bg-blue-600" />
            </View>
          ))}

          {notifications.length === 0 && (
            <Text className="text-gray-400">No notifications yet.</Text>
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default AdminHomeScreen;