import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PantryProvider } from './src/contexts/PantryContext';
import SignInScreen from './src/screens/SignInScreen';
import Tabs from './src/navigation/Tabs';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PantryProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PantryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
