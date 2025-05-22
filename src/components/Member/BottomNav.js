import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useNavigation, useRoute } from '@react-navigation/native';

const BottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const activeColor = '#246597FF';
    const inactiveColor = '#ACA7A7FF';

    return (
        <View className="flex-row justify-around items-center bg-white p-3 border-t border-gray-200 rounded-t-2xl pb-8">
            <TouchableOpacity onPress={() => navigation.navigate('MemberHome')}>
                <Ionicons
                    name="home-outline"
                    size={24}
                    color={route.name === 'MemberHome' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SocietyEvent')}>
                <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={route.name === 'SocietyEvent' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Feedback')}>
                <MaterialIcons
                    name="reviews"
                    size={24}
                    color={route.name === 'Feedback' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => navigation.navigate('MemberNotification')}>
                <Ionicons
                    name="notifications-outline"
                    size={24}
                    color={route.name === 'MemberNotification' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Voting')}>
                <MaterialCommunityIcons
                    name="vote-outline"
                    size={24}
                    color={route.name === 'Voting' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MemberProfile')}>
                <Feather
                    name="user"
                    size={24}
                    color={route.name === 'MemberProfile' ? activeColor : inactiveColor}
                />
            </TouchableOpacity>
        </View>
    );
};

export default BottomNav;
