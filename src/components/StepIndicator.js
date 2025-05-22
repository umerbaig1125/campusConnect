// components/StepIndicator.js
import React from 'react';
import { View } from 'react-native';

const StepIndicator = ({ currentStep }) => {
    return (
        <View className="flex-row justify-center items-center mb-4">
            {[0, 1, 2].map((step) => (
                <View
                    key={step}
                    style={{
                        width: 40,
                        height: 10,
                        borderRadius: 10,
                        marginHorizontal: 4, // space between dashes
                        marginBottom: 20,
                        marginTop: 20,
                        backgroundColor: currentStep === step ? '#ffe100' : '#b8b8b8',
                    }}
                />
            ))}
        </View>
    );
};

export default StepIndicator;
