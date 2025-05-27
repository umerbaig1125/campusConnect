import { Text, View, ImageBackground, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import Icon from 'react-native-vector-icons/FontAwesome6';
import StepIndicator from '../StepIndicator';

const { width } = Dimensions.get('window')

const Third = ({ onNext, onBack }) => {
    return (
        <View className="flex-1">
            <ImageBackground
                source={require('../../images/images.jpeg')}
                className="h-[35%] justify-center items-center"
                resizeMode="cover"
            >
                {/* White overlay with opacity */}
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-60" />
                <Image
                    className="h-[60%] w-[50%] mb-6"
                    source={require('../../images/logo.png')}
                />
            </ImageBackground>

            {/* Curved red section */}
            <View style={{ height: '100%', width: '100%', marginTop: -190 }}>
                <Svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#013553" stopOpacity="1" />
                            <Stop offset="1" stopColor="#017aa8" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    <Path
                        d="M0,0.2 C0.3,0.1 0.7,0.1 1,0.2 L1,1 L0,1 Z"
                        fill="url(#grad)"
                    />
                </Svg>

                {/* Image now positioned absolutely on top of SVG */}
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-4xl mt-2 font-bold">Notifications</Text>
                    <Text className="text-white text-xl text-center mt-5">
                        Stay updated with real-time notifications about upcoming events, important announcements, and society activities — all in one place.
                    </Text>
                    <Image
                        source={require('../../images/third.png')}
                        className="h-[25%] w-[100%]"
                        style={{ marginTop: 20 }}
                        resizeMode="contain"
                    />

                    {/* Step Dashes */}
                    <StepIndicator currentStep={1} />

                    <View className="w-full flex-row justify-between items-center px-8 mt-6">
                        <TouchableOpacity
                            className="flex-row justify-center items-center rounded-full"
                            onPress={onBack}
                            style={{
                                backgroundColor: '#b8b8b8',
                                width: width * 0.32,
                                height: 40,
                                marginRight: 48
                            }}
                        >
                            <Icon name="angle-left" size={20} color="#5a5a5a" style={{ marginRight: 8 }} />
                            <Text className="text-[#5a5a5a] font-semibold text-2xl">Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row justify-center items-center rounded-full"
                            onPress={onNext}
                            style={{
                                backgroundColor: '#ffe100',
                                width: width * 0.32,
                                height: 40,
                                marginLeft: 48
                            }}
                        >
                            <Text className="text-black font-semibold text-2xl">Next</Text>
                            <Icon name="angle-right" size={20} color="#000000" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default Third