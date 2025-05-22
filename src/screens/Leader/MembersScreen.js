import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BottomNav from '../../components/Leader/BottomNav';

const MembersScreen = () => {
    const navigation = useNavigation();
    const [role, setRole] = useState('');
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        getStoredCredentials();
    }, []);

    useEffect(() => {
        if (role) {
            fetchMembersByRole(role);
        }
    }, [role]);

    useEffect(() => {
        filterMembers(searchQuery);
    }, [searchQuery, members]);

    const getStoredCredentials = async () => {
        try {
            const value = await AsyncStorage.getItem('credentials');
            if (value !== null) {
                const parsed = JSON.parse(value);
                setRole(parsed.role || '');
            }
        } catch (error) {
            console.error('Error reading credentials from AsyncStorage:', error);
        }
    };

    const fetchMembersByRole = async (leaderRole) => {
        try {
            setLoading(true);
            const res = await axios.get(`https://campus-connect-backend-eight.vercel.app/api/auth/members-by-leader-role`, {
                params: { role: leaderRole }
            });
            setMembers(res.data.members);
            setFilteredMembers(res.data.members); // Initially set all members
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const filterMembers = (query) => {
        const lowerQuery = query.toLowerCase();
        const filtered = members.filter(member =>
            member.name.toLowerCase().includes(lowerQuery)
        );
        setFilteredMembers(filtered);
    };

    const handleDeleteMember = (memberId) => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this member permanently?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await axios.delete(`https://campus-connect-backend-eight.vercel.app/api/auth/delete-member/${memberId}`);

                            // Remove from UI
                            const updatedMembers = members.filter(m => m._id !== memberId);
                            setMembers(updatedMembers);
                            setFilteredMembers(updatedMembers);
                        } catch (error) {
                            console.error('Error deleting member:', error);
                            Alert.alert('Error', 'Failed to delete the member. Please try again.');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View className="flex-1 bg-white pt-16 px-4">
            {loading && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black/40 justify-center items-center">
                    <ActivityIndicator size="large" color="#28648f" />
                </View>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-medium text-black ml-2">Society Members</Text>
                </View>

                {/* Search Bar */}
                <TextInput
                    placeholder="Search Members"
                    placeholderTextColor="#868686FF"
                    className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-black"
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />

                {/* Members List */}
                {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, index) => (
                        <View key={index} className="flex-row items-center justify-between mb-3 border-b border-gray-400 pb-2">
                            <View className="flex-row items-center py-2">
                                <Image
                                    source={{ uri: member.imageUrl || 'https://i.pravatar.cc/100' }}
                                    className="w-16 h-16 rounded-full mr-3"
                                />
                                <View>
                                    <Text className="text-xl font-semibold text-gray-800">{member.name}</Text>
                                    <Text className="text-base text-gray-500">{member.email}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                {/* <TouchableOpacity className="bg-[#ffe100] px-6 py-2 rounded-md mr-2">
                                    <Text className="text-sm font-semibold text-black">View</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={() => handleDeleteMember(member._id)}>
                                    <Ionicons name="remove-circle" size={26} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="items-center justify-center mt-16">
                        <Text className="text-lg text-gray-500">No members found</Text>
                    </View>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
};

export default MembersScreen;
