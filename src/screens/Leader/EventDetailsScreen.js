import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Leader/BottomNav';
import { useNavigation, useRoute } from '@react-navigation/native';

const EventDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { name, date, time, image, venue, desc, _id } = route.params;

    return (
        <View className="flex-1 bg-white pt-10 px-4">
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
                    className="bg-[#ffe100] py-2 rounded-lg mb-8"
                    onPress={() => navigation.navigate('Players', { eventId: _id })}
                >
                    <Text className="text-center font-semibold text-black text-xl">View Members</Text>
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

export default EventDetailsScreen;
