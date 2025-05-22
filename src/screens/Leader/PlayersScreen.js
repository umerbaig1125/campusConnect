import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, Image,
    TouchableOpacity, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import BottomNav from '../../components/Leader/BottomNav';

const PlayersScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { eventId } = route.params;

    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await axios.get(`https://campus-connect-backend-eight.vercel.app/api/events/${eventId}/registrations`);
                setPlayers(res.data);
            } catch (err) {
                console.error('Error fetching players:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, [eventId]);

    const handleDeleteMember = (registrationId, userName) => {
        Alert.alert(
            'Remove Player',
            `Are you sure you want to remove ${userName}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await axios.delete(`https://campus-connect-backend-eight.vercel.app/api/events/${eventId}/registrations/${registrationId}`);
                            setPlayers(prev => prev.filter(p => p._id !== registrationId));
                        } catch (error) {
                            console.error('Error deleting player:', error);
                            alert('Failed to remove player.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    const filteredPlayers = players
        .filter(player =>
            player.userName?.toLowerCase().includes(search.toLowerCase()) ||
            player.email?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.userName?.localeCompare(b.userName)); // alphabetically sorted

    return (
        <View className="flex-1 bg-white pt-16 px-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-medium text-black ml-2">Registered Players</Text>
                </View>

                {/* Search Bar */}
                <TextInput
                    placeholder="Search Players"
                    placeholderTextColor="#868686FF"
                    value={search}
                    onChangeText={setSearch}
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-black"
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#ffe100" />
                ) : filteredPlayers.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-10">Player not found.</Text>
                ) : (
                    filteredPlayers.map((player, index) => (
                        <View key={index} className="flex-row items-center justify-between mb-3 border-b border-gray-400 pb-2">
                            <View className="flex-row items-center py-2">
                                <Image
                                    source={{
                                        uri: player?.imageUri || 'https://i.pravatar.cc/100',
                                    }}
                                    className="w-16 h-16 rounded-full mr-3"
                                />
                                <View>
                                    <Text className="text-xl font-semibold text-gray-800">{player.userName}</Text>
                                    <Text className="text-base text-gray-500">{player.email}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={() => handleDeleteMember(player._id, player.userName)}>
                                    <Ionicons name="remove-circle" size={26} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav />
        </View>
    );
};

export default PlayersScreen;
