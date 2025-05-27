import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import BottomNav from '../../components/Admin/BottomNav';

const screenWidth = Dimensions.get('window').width;

const VoteCounterScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [voteData, setVoteData] = useState([]);

    useEffect(() => {
        fetchVoteCounts();
    }, []);

    const fetchVoteCounts = async () => {
        try {
            const res = await axios.get('https://campus-connect-backend-eight.vercel.app/api/vote/counts');
            console.log("vote counter", res.data)
            setVoteData(res.data);
        } catch (error) {
            console.error('Error fetching vote counts:', error);
        }
    };

    // const renderChart = (societyObj, index) => {
    //     const colors = [
    //         '#F10034FF', '#36A2EB', '#FFCE56', '#4BC0C0',
    //         '#9966FF', '#FF9F40', '#8BC34A', '#E91E63'
    //     ];

    //     const pieData = societyObj.candidates.map((candidate, idx) => ({
    //         name: candidate.name,
    //         population: candidate.votes,
    //         color: colors[idx % colors.length],
    //         legendFontColor: "#000",
    //         legendFontSize: 14
    //     }));

    //     return (
    //         <View
    //             key={index}
    //             className="mb-8 bg-white p-4 rounded-2xl shadow-xl"
    //             style={{
    //                 shadowColor: "#000",
    //                 shadowOffset: { width: 0, height: 4 },
    //                 shadowOpacity: 0.25,
    //                 shadowRadius: 6,
    //                 elevation: 5
    //             }}
    //         >
    //             <Text className="text-xl font-bold text-center mb-4 text-black">
    //                 {societyObj.society}
    //             </Text>
    //             <PieChart
    //                 data={pieData}
    //                 width={screenWidth - 40}
    //                 height={220}
    //                 chartConfig={{
    //                     backgroundColor: '#fff',
    //                     backgroundGradientFrom: '#fff',
    //                     backgroundGradientTo: '#fff',
    //                     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    //                 }}
    //                 accessor="population"
    //                 backgroundColor="transparent"
    //                 paddingLeft="15"
    //                 absolute
    //             />
    //         </View>
    //     );
    // };

    const renderChart = (societyObj, index) => {
        const colors = [
            '#F10034FF', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#8BC34A', '#E91E63'
        ];

        const pieData = societyObj.candidates.map((candidate, idx) => ({
            name: candidate.name,
            population: candidate.votes,
            color: colors[idx % colors.length],
            legendFontColor: "#000",
            legendFontSize: 14
        }));

        return (
            <View
                key={index}
                className="mb-8 bg-white p-4 rounded-2xl shadow-xl"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 5
                }}
            >
                <Text className="text-xl font-bold text-center mb-1 text-black">
                    {societyObj.title} — {societyObj.society}
                </Text>
                <Text className="text-sm text-center text-gray-500 mb-3">
                    {new Date(societyObj.date).toDateString()}
                </Text>
                <PieChart
                    data={pieData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white px-8 pt-16">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                </TouchableOpacity>
                <Text className="text-3xl font-medium text-black ml-2">Voting Results</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {voteData.length > 0 ? (
                    voteData.map(renderChart)
                ) : (
                    <Text className="text-center text-gray-600">Loading vote data...</Text>
                )}
            </ScrollView>

            {/* Bottom Nav */}
            <BottomNav />
        </View>
    );
};

export default VoteCounterScreen;
