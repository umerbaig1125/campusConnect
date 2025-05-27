import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Admin/BottomNav';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const AllEventsScreen = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-sharp" size={30} color="#000" />
        </TouchableOpacity>
        <Text className="text-3xl font-medium text-black ml-2">Events</Text>
      </View>

      <View className="items-end mb-10">
        <TouchableOpacity
          className="bg-[#ffe100] px-4 py-1.5 rounded w-[30%]"
          onPress={() => navigation.navigate('Review')}
        >
          <Text className="font-semibold text-black text-sm text-right">Events Analytics</Text>
        </TouchableOpacity>
      </View>

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
                      onPress={() => navigation.navigate('EventDetails', {
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

      {/* Bottom Nav */}
      <BottomNav />
    </View>
  );
};

export default AllEventsScreen;
