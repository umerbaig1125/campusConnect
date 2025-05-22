import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Member/BottomNav';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MemberHomeScreen = () => {
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
  const [events, setEvents] = useState([]);
  const isFocused = useIsFocused();

  const profileImage = userInfo.imageUrl
    ? { uri: `https://campus-connect-backend-eight.vercel.app${userInfo.image}` }
    : { uri: 'https://i.pravatar.cc/100' };


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
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://campus-connect-backend-eight.vercel.app/api/events');
        setEvents(response.data); // backend should return an array of events
      } catch (error) {
        console.error('Failed to fetch events:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getMonthAbbr = (dateStr) => {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return monthNames[new Date(dateStr).getMonth()];
  };

  const getDayAbbr = (dateStr) => {
    return new Date(dateStr).toDateString().split(' ')[0].toUpperCase(); // e.g., 'MON'
  };

  const getDateNum = (dateStr) => {
    return new Date(dateStr).getDate().toString();
  };

  // Function to generate a random color
  const getRandomColor = () => {
    const getRandomValue = () => Math.floor(Math.random() * 56) + 200; // Random value between 200 and 255

    const r = getRandomValue();
    const g = getRandomValue();
    const b = getRandomValue();

    return `rgb(${r}, ${g}, ${b})`;
  };
  return (
    <View className="flex-1 bg-white px-4 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
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
                      <View className="flex-row justify-between items-center mb-1 mt-2">
                        <Text className="text-white text-base">{event.time}</Text>
                        {/* <Ionicons name="add-circle-outline" size={26} color="white" /> */}
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

        {/* Upcoming Events */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-black text-3xl font-bold">Upcoming Events</Text>
          </View>

          {/* Event Timeline */}
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              events
                .filter(event => new Date(event.date) >= new Date()) // only upcoming
                .map((event, index) => (
                  <View key={index} className="flex-row mb-6 relative">
                    {/* Left Timeline */}
                    <View className="items-center mr-4 w-16">
                      <Text className="text-red-500 font-bold mb-2">{getMonthAbbr(event.date)}</Text>
                      <View className="bg-white shadow-md rounded-xl w-14 h-14 items-center justify-center mb-2">
                        <Text className="text-black font-bold text-xl">{getDateNum(event.date)}</Text>
                        <Text className="text-xs text-gray-400">{getDayAbbr(event.date)}</Text>
                      </View>
                      <View className="w-[1px] h-12 border-r border-dashed border-gray-400 mt-1" />
                    </View>

                    {/* Right Event Card */}
                    <View style={{ backgroundColor: getRandomColor() }} className={`w-[70%] h-[100%] rounded-xl p-4 flex-row justify-between items-center ml-10`}>
                      <View>
                        <Text className="text-black font-bold text-xl">{event.name}</Text>
                        <Text className="text-gray-700 text-base mt-1">{event.time}</Text>
                        <Text className="text-gray-700 text-base font-semibold">{event.venue}</Text>
                        <TouchableOpacity
                          className="bg-[#ffe100] justify-center items-center py-1 px-2 w-24 mt-4"
                          onPress={() => navigation.navigate('MemberEventDetails', {
                            _id: event._id,
                            name: event.name,
                            date: event.date,
                            time: event.time,
                            venue: event.venue,
                            desc: event.description,
                            image: event.image,
                          })}
                        >
                          <Text className="text-sm text-black">View Details</Text>
                        </TouchableOpacity>
                      </View>
                      {event.image ? (
                        <Image source={{ uri: event.image }} className="w-16 h-16" resizeMode="contain" />
                      ) : (
                        <Ionicons name="image-outline" size={28} color="#ccc" />
                      )}
                    </View>
                  </View>
                ))
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav />
    </View>
  )
}

export default MemberHomeScreen
