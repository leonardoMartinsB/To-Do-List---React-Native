import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

export default function LoginScreen({ navigation }) {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (userName.length === 0 || password.length === 0) {
      Alert.alert('Atenção', 'Por favor preencha os campos!');
      return;
    }
    try {
      const user = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ?',
        [userName]
      );
      if (!user) {
        Alert.alert('Erro:', 'Usuário não existe!');
        return;
      }
      const validUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ? AND password = ? ',
        [userName, password]
      );
      if (validUser) {
        Alert.alert('Sucesso!', 'Sucesso ao fazer login');
        navigation.navigate('TodoList', { user: userName });
        setUserName('');
        setPassword('');
      } else {
        Alert.alert('Erro', 'Senha incorreta');
      }
    } catch (error) {
      console.log('Erro durante login:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f5f7fa', '#e4e7eb']}
        style={styles.gradientContainer}>
        <StatusBar style="dark" />
        <View style={styles.loginContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>TaskFlow</Text>
            <Text style={styles.subtitle}>Entre na sua conta</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person"
                size={20}
                color="#4b5563"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                placeholderTextColor="#999"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="#4b5563"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>

            <Pressable style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.secondaryButtonText}>
                Não tem uma conta? <Text style={styles.secondaryButtonHighlight}>Cadastre-se</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}