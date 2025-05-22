import React from 'react';
import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartupScreen from './src/screens/StartupScreen';

// Auth
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignupScreen from './src/screens/Auth/SignupScreen'
import ForgotPasswordScreen from './src/screens/Auth/ForgotPasswordScreen'
import ConfirmEmail from './src/screens/Auth/ConfirmEmail';
import ConfirmPassword from './src/screens/Auth/ConfirmPassword';
//Admin
import AdminHomeScreen from './src/screens/Admin/AdminHomeScreen';
import ReviewFeedbackScreen from './src/screens/Admin/ReviewFeedbackScreen'
import AllEventScreen from './src/screens/Admin/AllEventScreen';
import AddEventScreen from './src/screens/Admin/AddEventScreen';
import NotificationsScreen from './src/screens/Admin/NotificationsScreen';
import ProfileScreen from './src/screens/Admin/ProfileScreen';
import VoteCounterScreen from './src/screens/Admin/VoteCounterScreen';

//Leader
import LeaderHomeScreen from './src/screens/Leader/LeaderHomeScreen'
import EventDetailsScreen from './src/screens/Leader/EventDetailsScreen'
import MembersScreen from './src/screens/Leader/MembersScreen'
import PlayersScreen from './src/screens/Leader/PlayersScreen'
import NotificationLeadrScreen from './src/screens/Leader/NotificationsLeaderScreen';
import ProfileLeaderScreen from './src/screens/Leader/ProfileLeaderScreen';
import AddEventLeaderScreen from './src/screens/Leader/AddEventLeaderScreen';

//Member
import MemberHomeScreen from './src/screens/Member/MemberHomeScreen';
import MemberEventDetailsScreen from './src/screens/Member/MemberEventDetailsScreen';
import FeedbackScreen from './src/screens/Member/FeedbackScreen';
import MemberNotificationsScreen from './src/screens/Member/MemberNotificationsScreen';
import MemberProfileScreen from './src/screens/Member/MemberProfileScreen';
import SocietyEventsScreen from './src/screens/Member/SocietyEventsScreen';
import VotingScreen from './src/screens/Member/VotingScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartupScreen} />
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
        <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
        {/* Admin */}
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="Review" component={ReviewFeedbackScreen} />
        <Stack.Screen name="Event" component={AllEventScreen} />
        <Stack.Screen name="AddEvent" component={AddEventScreen} />
        <Stack.Screen name="Notification" component={NotificationsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name='VoteCounter' component={VoteCounterScreen} />
        {/* Leader */}
        <Stack.Screen name="LeaderHome" component={LeaderHomeScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="Members" component={MembersScreen} />
        <Stack.Screen name="Players" component={PlayersScreen} />
        <Stack.Screen name="NotificationLeader" component={NotificationLeadrScreen} />
        <Stack.Screen name="ProfileLeader" component={ProfileLeaderScreen} />
        <Stack.Screen name="AddEventLeader" component={AddEventLeaderScreen} />

        {/* Member */}
        <Stack.Screen name="MemberHome" component={MemberHomeScreen} />
        <Stack.Screen name="MemberEventDetails" component={MemberEventDetailsScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="MemberNotification" component={MemberNotificationsScreen} />
        <Stack.Screen name="MemberProfile" component={MemberProfileScreen} />
        <Stack.Screen name="SocietyEvent" component={SocietyEventsScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
