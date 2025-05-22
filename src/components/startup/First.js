import { Text, View, ImageBackground, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import Icon from 'react-native-vector-icons/FontAwesome6';

const { width } = Dimensions.get('window')

const First = ({ onNext }) => {
    return (
        <View className="flex-1">
            <ImageBackground
                source={require('../../images/images.jpeg')} // 👈 your background image here
                className="h-[35%] justify-center items-center"
                resizeMode="cover"
            >
                {/* White overlay with opacity */}
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-60" />
                <Image
                    className="h-[80%] w-[50%] mb-6"
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
                    <Text className="text-white text-5xl font-bold mt-2">Welcome To</Text>
                    <Text
                        className="text-3xl font-bold mt-5"
                        style={{ color: '#ffe100' }}
                    >
                        Your Gateway to Campus Life
                    </Text>
                    <Text className="text-white text-2xl text-center mt-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
                    </Text>
                    <Image
                        source={require('../../images/first.png')}
                        className="h-[30%] w-[100%]"
                        style={{ marginBottom: 20, marginTop: 20 }}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        className="h-[4%] w-[80%] flex-row justify-center items-center rounded-full"
                        style={{ backgroundColor: '#ffe100' }}
                        onPress={onNext}
                    >
                        <Text className="text-black font-semibold text-2xl">Next</Text>
                        <Icon name="angle-right" size={24} color="#000000" className="ml-4" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default First