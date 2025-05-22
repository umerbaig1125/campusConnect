import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const activeColor = '#246597FF';
    const inactiveColor = '#ACA7A7FF';

    return (
        <View className="flex-row justify-around items-center bg-white p-3 border-t border-gray-200 rounded-t-2xl pb-8">
            <TouchableOpacity onPress={() => navigation.navigate('LeaderHome')}>
                <Feather
                    name="home"
                    size={24}
                    color={route.name === 'LeaderHome' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Members')}>
                <Feather
                    name="users"
                    size={24}
                    color={route.name === 'Members' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('NotificationLeader')}>
                <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={route.name === 'NotificationLeader' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ProfileLeader')}>
                <Ionicons
                    name="person-outline"
                    size={24}
                    color={route.name === 'ProfileLeader' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>
        </View>
    );
};

export default BottomNav;
