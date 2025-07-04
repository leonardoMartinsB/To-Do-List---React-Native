import React from 'react';
import { Pressable, Text, View, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import styles from './styles';

export default function HomeScreen({navigation, route}) {  
  const { user } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient 
        colors={['#f8f9fa', '#e9ecef']} 
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar style="dark" />
        <View style={styles.homeContainer}>
          <View style={styles.welcomeSection}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.welcomeTitle}>Bem-vindo!</Text>
            <Text style={styles.welcomeSubtitle}>{user}</Text>
          </View>
          
          <View style={styles.homeActions}>
            <Pressable 
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed
              ]} 
              onPress={() => navigation.navigate('TodoList', { user })}
            >
              <Ionicons name="list" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Ver Tarefas</Text>
            </Pressable>
            
            <Pressable 
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.outlineButtonPressed
              ]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.outlineButtonText}>Sair</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}