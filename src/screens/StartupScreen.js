import React, { useState } from 'react';
import { View } from 'react-native';
import First from '../components/startup/First';
import Second from '../components/startup/Second';
import Third from '../components/startup/Third';
import Forth from '../components/startup/Forth';
import { useNavigation } from '@react-navigation/native';

const StartupScreen = () => {
    const navigation = useNavigation();

    const handleNext = () => {
        // Navigate to the LoginScreen when Next is pressed
        navigation.navigate('Login');
    };

    const [step, setStep] = useState(0);

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return <First onNext={nextStep} />;
            case 1:
                return <Second onNext={nextStep} onBack={prevStep} currentStep={0} />;
            case 2:
                return <Third onNext={nextStep} onBack={prevStep} currentStep={1} />;
            case 3:
                return <Forth onNext={handleNext} onBack={prevStep} currentStep={2} />;
            default:
                return null;
        }
    };

    return <View style={{ flex: 1 }}>{renderStep()}</View>;
};

export default StartupScreen;
