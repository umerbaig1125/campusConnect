import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNav from '../../components/Member/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const VotingScreen = () => {
    const navigation = useNavigation();
    const [role, setRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [hasVoted, setHasVoted] = useState(false); // <-- new state
    const [loading, setLoading] = useState(false); // Add loading state

    const getSocietyFromRole = (role) => {
        return role.replace(' Member', '').trim();
    };

    const getPresidentTitle = () => {
        if (!role) return 'President';
        return `${getSocietyFromRole(role)} President`;
    };

    const getStoredCredentials = async () => {
        try {
            const value = await AsyncStorage.getItem('credentials');
            if (value !== null) {
                const parsed = JSON.parse(value);
                const userRole = parsed.role || '';
                const email = parsed.email || '';
                setRole(userRole);
                setUserEmail(email);

                fetchCandidates(userRole);
                checkUserVoted(email, userRole);
            }
        } catch (error) {
            console.error('Error reading credentials from AsyncStorage:', error);
        }
    };

    const fetchCandidates = async (userRole) => {
        try {
            setLoading(true);
            const societyName = getSocietyFromRole(userRole);
            const leaderRole = `${societyName} Leader`;
            const memberRole = `${societyName} Member`;

            const [leaderRes, memberRes] = await Promise.all([
                axios.get(`https://campus-connect-backend-eight.vercel.app/api/vote/users/by-society-role/${leaderRole}`),
                axios.get(`https://campus-connect-backend-eight.vercel.app/api/vote/users/by-society-role/${memberRole}`)
            ]);

            const merged = [...leaderRes.data, ...memberRes.data].filter(
                (user, index, self) =>
                    index === self.findIndex((u) => u.email === user.email)
            );

            setCandidates(merged);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const checkUserVoted = async (email, userRole) => {
        try {
            setLoading(true);
            const societyName = getSocietyFromRole(userRole);
            const res = await axios.get(`https://campus-connect-backend-eight.vercel.app/api/vote/check?voter=${email}&society=${encodeURIComponent(societyName)}`);
            if (res.data.voted === true) {
                setHasVoted(true);
            }
        } catch (error) {
            console.error('Error checking vote status:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleVote = async (candidate) => {
        try {
            setLoading(true);
            const societyName = getSocietyFromRole(role);

            const payload = {
                votedBy: userEmail,
                votedFor: {
                    name: candidate.name,
                    email: candidate.email,
                },
                society: societyName,
            };

            const res = await axios.post('https://campus-connect-backend-eight.vercel.app/api/vote', payload);

            if (res.status === 201) {
                alert('✅ Vote submitted successfully');
                setHasVoted(true); // disable voting after success
            }
        } catch (error) {
            if (error.response?.status === 409) {
                alert('⚠️ You have already cast your vote in this society.');
                setHasVoted(true);
            } else {
                console.error('Vote error:', error);
                alert('❌ Failed to submit vote');
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    const renderCandidate = (candidate) => (
        <View
            key={candidate.email}
            className="bg-gray-100 rounded-xl flex-row items-center justify-between px-4 py-3 mb-3"
        >
            <View className="flex-row items-center space-x-3">
                <Image
                    source={{ uri: candidate.imageUrl || 'https://i.pravatar.cc/150?img=5' }}
                    className="w-14 h-14 rounded-full mr-4"
                />
                <Text className="text-lg font-medium text-black">
                    {candidate.name}
                </Text>
            </View>
            <TouchableOpacity
                className={`px-6 py-2 rounded-md ${hasVoted ? 'bg-gray-400' : 'bg-[#ffe100]'}`}
                disabled={hasVoted}
                onPress={() => handleVote(candidate)}
            >
                <Text className="text-black font-semibold text-sm">
                    {hasVoted ? 'Voted' : 'Vote'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        getStoredCredentials();
    }, []);

    if (!role) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-lg text-black">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white px-4 pt-16">
            <TouchableOpacity
                className="flex-row items-center mb-4"
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="chevron-back" size={22} color="#000" />
                <Text className="text-3xl font-medium text-black ml-2">E-Voting</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-3xl font-medium mb-4 text-black">
                    Vote For {getPresidentTitle()}
                </Text>

                {candidates.length > 0 ? (
                    candidates.map(renderCandidate)
                ) : (
                    <Text className="text-gray-500 mt-4">No candidates available</Text>
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
};

export default VotingScreen;
