import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNav from '../../components/Leader/BottomNav';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AddEventLeaderScreen = () => {
  const navigation = useNavigation();

  const [eventName, setEventName] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [role, setRole] = useState('')
  const [username, setUsername] = useState('');

  const [loading, setLoading] = useState(false); // Add loading state

  const route = useRoute();
  const { eventData } = route.params || {};


  const getStoredCredentials = async () => {
    try {
      const value = await AsyncStorage.getItem('credentials');
      if (value !== null) {
        const parsed = JSON.parse(value);
        setRole(parsed.role || '');
        setUsername(parsed.name || ''); // assuming stored key is 'username'
      }
    } catch (error) {
      console.error('Error reading credentials from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getStoredCredentials();
  }, []);

  useEffect(() => {
    if (eventData) {
      setEventName(eventData.name);
      setEventVenue(eventData.venue);
      setDescription(eventData.description);
      setDate(new Date(eventData.date));

      // Correct way to parse time string (e.g., "15:30") into a Date object
      const [hours, minutes] = eventData.time.split(':');
      const parsedTime = new Date();
      parsedTime.setHours(parseInt(hours));
      parsedTime.setMinutes(parseInt(minutes));
      setTime(parsedTime);

      setImage(eventData.image);
    }
  }, [eventData]);

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.warn('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventVenue || !description || !image || !date || !time) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    try {
      setLoading(true);
      const roleToSocietyName = {
        'Sports Society Leader': 'sports',
        'Music Society Leader': 'music',
        'Arts Society Leader': 'arts',
        'Robotics Society Leader': 'robotics',
      };

      const societyName = roleToSocietyName[role] || '';

      const payload = {
        name: eventName,
        venue: eventVenue,
        description,
        date: date.toISOString(),
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image,
        societyName,
        createdBy: username,  // 👈 add this
        role,
      };
      let response;

      if (eventData && eventData._id) {
        // PUT API is called here ✅
        response = await axios.put(`https://campus-connect-backend-eight.vercel.app/api/events/${eventData._id}`, payload);
      } else {
        // Creating new event
        response = await axios.post('https://campus-connect-backend-eight.vercel.app/api/events', payload);
      }

      if (response.status === 200 || response.status === 201) {
        alert(eventData ? 'Event updated successfully!' : 'Event created successfully!');
        navigation.goBack();
      } else {
        alert(response.data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const generateDescription = async () => {
    if (!eventName || !eventVenue || !image || !date || !time || !selectedSociety) {
      alert('Please fill in all fields (except description) before generating.');
      return;
    }

    const prompt = `
"${eventName}" happening at "${eventVenue}" on ${date.toDateString()} at ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
The event is organized by the "${selectedSociety}" society.

Write a 300-word professional event description covering:
1. Event Overview
2. Speakers and Expertise
3. Agenda
4. Special Features
5. Registration Details
6. CTA to register
7. Contact Info
`;

    try {
      const response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 512,
          top_p: 0.9,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 596f85314f64c1469dc3925f018d58a230fc160f8e35dfb21feddb9c934ab12f`,
          },
        }
      );

      const aiDescription = response.data.choices[0]?.message?.content?.trim();
      setDescription(aiDescription || 'Failed to generate description.');
    } catch (error) {
      console.error('Together.ai error:', error.response?.data || error.message);
      alert('Failed to generate description. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-16">
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
        <Text className="text-3xl font-medium text-black ml-2">Create New Event</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-semibold mb-4 text-black">Event Details</Text>

        {/* Event Name */}
        <Text className="text-lg text-black mb-2">Event Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-black"
          placeholder="Enter event name"
          placeholderTextColor="#868686FF"
          value={eventName}
          onChangeText={setEventName}
        />

        {/* Venue */}
        <Text className="text-lg text-black mb-2">Event Venue</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-black"
          placeholder="Enter venue"
          placeholderTextColor="#868686FF"
          value={eventVenue}
          onChangeText={setEventVenue}
        />

        {/* Description */}
        <Text className="text-lg text-black mb-2">Description Event</Text>

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 h-24 text-start text-black"
          placeholder="Enter description"
          placeholderTextColor="#868686FF"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          className="bg-[#ffe100] rounded-lg py-2 items-center mb-4 w-64 justify-end"
          onPress={generateDescription}
        >
          <Text className="text-black font-medium text-lg">Generate Description with AI</Text>
        </TouchableOpacity>

        {/* Date */}
        <Text className="text-lg text-black mb-2">Event Date</Text>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 flex-row justify-between items-center"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-black">{date.toDateString()}</Text>
          <Ionicons name="calendar-outline" size={20} color="gray" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Time */}
        <Text className="text-lg text-black mb-2">Event Time</Text>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          onPress={() => setShowTimePicker(true)}
        >
          <Text className="text-black">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={(e, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}

        {/* Upload Image */}
        <Text className="text-lg text-black mb-2">Upload Image</Text>
        <TouchableOpacity
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
          onPress={handleImagePick}
        >
          <Text className="text-black">{image ? 'Image Selected' : 'Choose file'}</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} className="w-full h-40 rounded-lg mb-4" resizeMode="contain" />
        )}

        {/* Create Button */}
        <TouchableOpacity
          className="bg-[#ffe100] rounded-lg py-3 items-center mt-8"
          onPress={handleCreateEvent}
        >
          <Text className="text-black font-medium text-lg">Create Event</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav />
    </View>
  );
};

export default AddEventLeaderScreen;
