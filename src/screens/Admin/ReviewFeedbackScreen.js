// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import BottomNav from '../../components/Admin/BottomNav';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';

// const statusStyles = {
//     'Normal': 'bg-yellow-400',
//     'Bad': 'bg-red-300',
//     'Very Good': 'bg-green-600',
//     'Good': 'bg-green-300',
// };

// const ReviewFeedbackScreen = () => {
//     const navigation = useNavigation();
//     const [feedbacks, setFeedbacks] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchFeedbacks = async () => {
//             try {
//                 const response = await axios.get('https://campus-connect-backend-eight.vercel.app/api/feedback');
//                 setFeedbacks(response.data);
//             } catch (err) {
//                 console.error('Error fetching feedbacks:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFeedbacks();
//     }, []);

//     if (loading) {
//         return (
//             <View className="flex-1 justify-center items-center bg-white">
//                 <ActivityIndicator size="large" color="#00304f" />
//                 <Text className="mt-2 text-gray-500">Loading Feedbacks...</Text>
//             </View>
//         );
//     }

//     return (
//         <View className="flex-1 bg-white pt-16 px-4">
//             {/* Header */}
//             <View className="flex-row items-center mb-6">
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="chevron-back-sharp" size={30} color="#000" />
//                 </TouchableOpacity>
//                 <Text className="ml-3 text-3xl font-medium text-black">Review Feed Back</Text>
//             </View>

//             {/* Feedback List */}
//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {feedbacks.map((item, index) => (
//                     <View key={index} className="mb-5 border-b-[2px] border-gray-300 pb-4">
//                         <Text className="text-2xl font-extrabold text-[#00304f]">
//                             {item.name} <Text className="text-gray-500 text-base">({item.role})</Text>
//                         </Text>
//                         <Text className="text-gray-500 text-sm">{item.email}</Text>

//                         <View className="mt-2">
//                             <Text className="text-gray-600">
//                                 Event: <Text className="font-semibold text-black">{item.eventName}</Text>
//                             </Text>
//                             <Text className="text-gray-600">
//                                 Event Date: <Text className="font-semibold text-black">{item.eventDate}</Text>
//                             </Text>
//                             <Text className="text-gray-600">
//                                 Venue: <Text className="font-semibold text-black">{item.eventVenue}</Text>
//                             </Text>
//                         </View>

//                         <TouchableOpacity
//                             className={`px-3 py-1 rounded mt-3 self-start ${statusStyles[item.rating] || 'bg-gray-300'}`}
//                         >
//                             <Text className="text-xs font-semibold text-black">{item.rating}</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ))}
//             </ScrollView>

//             <BottomNav />
//         </View>
//     );
// };

// export default ReviewFeedbackScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import BottomNav from '../../components/Admin/BottomNav';

const screenWidth = Dimensions.get('window').width;

const statusStyles = {
    'Normal': 'bg-yellow-400',
    'Bad': 'bg-red-300',
    'Very Good': 'bg-green-600',
    'Good': 'bg-green-300',
};

// Group feedbacks by eventName + eventDate
const groupFeedbackByEvent = (feedbacks) => {
    const grouped = {};

    feedbacks?.forEach(item => {
        const key = `${item.eventName}_${item.eventDate}`;
        if (!grouped[key]) {
            grouped[key] = {
                eventName: item.eventName,
                eventDate: item.eventDate,
                eventVenue: item.eventVenue,
                reviews: [],
            };
        }
        grouped[key].reviews.push(item);
    });

    return Object.values(grouped);
};

const ReviewFeedbackScreen = () => {
    const navigation = useNavigation();
    const [groupedFeedbacks, setGroupedFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('https://campus-connect-backend-eight.vercel.app/api/feedback');
                const grouped = groupFeedbackByEvent(response.data);
                setGroupedFeedbacks(grouped);
            } catch (err) {
                console.error('Error fetching feedbacks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const getRatingSummary = (reviews) => {
        const summary = {
            'Very Good': 0,
            'Good': 0,
            'Normal': 0,
            'Bad': 0,
        };

        reviews.forEach(r => {
            if (summary[r.rating] !== undefined) {
                summary[r.rating]++;
            }
        });

        return summary;
    };

    const renderChart = (summary) => {
        const labels = ['Very Good', 'Good', 'Normal', 'Bad'];
        const data = labels.map(label => summary[label]);

        return (
            <BarChart
                data={{
                    labels,
                    datasets: [{ data }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 48, 79, ${opacity})`,
                    labelColor: () => '#000',
                    barPercentage: 0.7,
                }}
                style={{ marginTop: 10, borderRadius: 10 }}
                fromZero
            />
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#00304f" />
                <Text className="mt-2 text-gray-500">Loading Feedbacks...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white pt-16 px-4">
            {/* Header */}
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-sharp" size={30} color="#000" />
                </TouchableOpacity>
                <Text className="ml-3 text-3xl font-medium text-black">Review Feedback</Text>
            </View>

            {/* Grouped Feedback */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {groupedFeedbacks.map((event, index) => {
                    const summary = getRatingSummary(event.reviews);

                    return (
                        <View key={index} className="mb-8 border-b-[2px] border-gray-300 pb-6">
                            <Text className="text-xl font-bold text-[#00304f] mb-1">{event.eventName}</Text>
                            <Text className="text-gray-500 text-sm mb-1">Date: {event.eventDate}</Text>
                            <Text className="text-gray-500 text-sm mb-3">Venue: {event.eventVenue}</Text>

                            {/* Rating Graph */}
                            {renderChart(summary)}

                            {/* Individual Reviews */}
                            {event.reviews.map((review, idx) => (
                                <View key={idx} className="mt-4 p-3 bg-gray-100 rounded-lg">
                                    <Text className="font-semibold text-black">
                                        {review.name} <Text className="text-gray-500 text-xs">({review.role})</Text>
                                    </Text>
                                    <Text className="text-gray-500 text-sm">{review.email}</Text>
                                    <TouchableOpacity
                                        className={`px-2 py-1 rounded mt-2 self-start ${statusStyles[review.rating] || 'bg-gray-300'}`}
                                    >
                                        <Text className="text-xs font-semibold text-black">{review.rating}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>

            <BottomNav />
        </View>
    );
};

export default ReviewFeedbackScreen;
