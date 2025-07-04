import { SQLiteProvider } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { initializeDatabase } from './database/initialize';
import AppNavigator from './navigation';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SQLiteProvider databaseName='auth.db' onInit={initializeDatabase}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});