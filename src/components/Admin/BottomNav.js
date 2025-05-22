import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const activeColor = '#246597FF';
    const inactiveColor = '#ACA7A7FF';

    return (
        <View className="flex-row justify-around items-center bg-white p-3 border-t border-gray-200 rounded-t-2xl pb-8">
            <TouchableOpacity onPress={() => navigation.navigate('AdminHome')}>
                <Ionicons
                    name="home"
                    size={24}
                    color={route.name === 'AdminHome' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Review')}>
                <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color={route.name === 'Review' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Event')}>
                <Feather
                    name="activity"
                    size={24}
                    color={route.name === 'Event' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('AddEvent')}>
                <Ionicons
                    name="add-circle-outline"
                    size={30}
                    color={route.name === 'AddEvent' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('VoteCounter')}>
                <MaterialCommunityIcons
                    name="vote"
                    size={30}
                    color={route.name === 'VoteCounter' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={route.name === 'Notification' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Ionicons
                    name="person-outline"
                    size={24}
                    color={route.name === 'Profile' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>
        </View>
    );
};

export default BottomNav;
