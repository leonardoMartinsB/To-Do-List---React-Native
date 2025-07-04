import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

export default function RegisterScreen({ navigation }) {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (userName.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      Alert.alert('Atenção', 'Por favor preencha todos os campos!');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      // Verifica se o usuário já existe
      const existingUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ?', 
        [userName]
      );
      
      if (existingUser) {
        Alert.alert('Erro', 'Este nome de usuário já está em uso');
        return;
      }

      // Insere o novo usuário
      const result = await db.runAsync(
        'INSERT INTO users (username, password) VALUES (?, ?)', 
        [userName, password]
      );
      
      if (result.changes > 0) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('TodoList', { user: userName }) }
        ]);
      } else {
        throw new Error('Nenhuma alteração foi feita no banco de dados');
      }
      
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert(
        'Erro', 
        'Não foi possível completar o cadastro. Por favor, tente novamente.\n' +
        (error.message || '')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#f5f7fa', '#e4e7eb']} style={styles.gradientContainer}>
        <StatusBar style="dark" />
        <View style={styles.loginContainer}>
          <View style={styles.headerContainer}>
            <Ionicons name="person-add" size={60} color="#333" />
            <Text style={styles.title}>TaskFlow</Text>
            <Text style={styles.subtitle}>Junte-se a nós!</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#4b5563" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder='Nome de usuário'
                placeholderTextColor="#999"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#4b5563" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder='Senha'
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#4b5563" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder='Confirmar senha'
                placeholderTextColor="#999"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
            </View>
            
            <Pressable 
              style={[styles.primaryButton, isLoading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </Pressable>
            
            <Pressable 
              style={styles.secondaryButton} 
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Já tem uma conta? Entrar</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}