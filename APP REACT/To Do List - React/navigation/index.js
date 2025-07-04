import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import HomeScreen from '../screens/Home';
import TodoListScreen from '../screens/TodoList';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName='Login'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Login' component={LoginScreen}/>
      <Stack.Screen name='Register' component={RegisterScreen}/>
      <Stack.Screen name='Home' component={HomeScreen}/>
      <Stack.Screen name='TodoList' component={TodoListScreen}/>
    </Stack.Navigator>
  );
}