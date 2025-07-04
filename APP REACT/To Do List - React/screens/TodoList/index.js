import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View, SafeAreaView, ScrollView, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

export default function TodoListScreen({ route, navigation }) {
  const { user } = route.params;
  const db = useSQLiteContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingDate, setEditingDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEditCalendar, setShowEditCalendar] = useState(false);

  const fetchTodos = async () => {
    const results = await db.getAllAsync('SELECT * FROM todos WHERE user = ? ORDER BY date DESC', [user]);
    setTodos(results);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateForStorage = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const onDateSelect = (day) => {
    const formattedDate = formatDateForDisplay(day.dateString);
    setDate(formattedDate);
    setShowCalendar(false);
  };

  const onEditDateSelect = (day) => {
    const formattedDate = formatDateForDisplay(day.dateString);
    setEditingDate(formattedDate);
    setShowEditCalendar(false);
  };

  const addTask = async () => {
    if (title.trim().length === 0) {
      Alert.alert('Atenção', 'Digite um título para a tarefa!');
      return;
    }
    if (description.trim().length === 0) {
      Alert.alert('Atenção', 'Digite uma descrição para a tarefa!');
      return;
    }
    if (date.trim().length === 0) {
      Alert.alert('Atenção', 'Selecione uma data para a tarefa!');
      return;
    }
    
    await db.runAsync(
      'INSERT INTO todos (user, title, description, date, status) VALUES (?, ?, ?, ?, ?)', 
      [user, title.trim(), description.trim(), date.trim(), 'pendente']
    );
    setTitle('');
    setDescription('');
    setDate('');
    setShowAddForm(false);
    fetchTodos();
  };

  const deleteTask = async (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: async () => {
          await db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
          fetchTodos();
        }}
      ]
    );
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pendente' ? 'concluida' : 'pendente';
    await db.runAsync('UPDATE todos SET status = ? WHERE id = ?', [newStatus, id]);
    fetchTodos();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingTitle(item.title);
    setEditingDescription(item.description);
    setEditingDate(item.date);
  };

  const saveEdit = async () => {
    if (editingTitle.trim().length === 0) {
      Alert.alert('Erro', 'O título não pode ficar vazio');
      return;
    }
    if (editingDescription.trim().length === 0) {
      Alert.alert('Erro', 'A descrição não pode ficar vazia');
      return;
    }
    if (editingDate.trim().length === 0) {
      Alert.alert('Erro', 'A data não pode ficar vazia');
      return;
    }
    
    await db.runAsync(
      'UPDATE todos SET title = ?, description = ?, date = ? WHERE id = ?', 
      [editingTitle.trim(), editingDescription.trim(), editingDate.trim(), editingId]
    );
    setEditingId(null);
    setEditingTitle('');
    setEditingDescription('');
    setEditingDate('');
    fetchTodos();
  };

  const formatDate = (dateString) => {
    if (dateString.includes('/')) {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    return status === 'concluida' ? '#4CAF50' : '#FF9800';
  };

  const getStatusText = (status) => {
    return status === 'concluida' ? 'Concluída' : 'Pendente';
  };

  React.useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user[0].toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Olá, {user}</Text>
              <Text style={styles.taskCount}>{todos.length} tarefas</Text>
            </View>
          </View>
          <Pressable 
            style={styles.logoutButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </Pressable>
        </View>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <View style={[styles.statCard, styles.totalCard]}>
            <Ionicons name="list-outline" size={24} color="#5e72e4" />
            <Text style={styles.statNumber}>{todos.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={[styles.statCard, styles.pendingCard]}>
            <Ionicons name="time-outline" size={24} color="#fb6340" />
            <Text style={styles.statNumber}>{todos.filter(t => t.status === 'pendente').length}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          
          <View style={[styles.statCard, styles.completedCard]}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#2dce89" />
            <Text style={styles.statNumber}>{todos.filter(t => t.status === 'concluida').length}</Text>
            <Text style={styles.statLabel}>Concluídas</Text>
          </View>
        </ScrollView>

        {/* Add Task Section */}
        <View style={styles.addTaskSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas Tarefas</Text>
            <Pressable 
              style={styles.addTaskButton} 
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Ionicons name={showAddForm ? "close" : "add"} size={20} color="#fff" />
              <Text style={styles.addTaskButtonText}>
                {showAddForm ? "Cancelar" : "Nova"}
              </Text>
            </Pressable>
          </View>
          
          {showAddForm && (
            <View style={styles.addTaskForm}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Adicionar Tarefa</Text>
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.taskInput}
                  placeholder="Título da tarefa"
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.taskInput, styles.descriptionInput]}
                  placeholder="Descrição da tarefa"
                  placeholderTextColor="#999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <Pressable 
                style={styles.datePickerButton}
                onPress={() => setShowCalendar(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#5e72e4" />
                <Text style={[styles.datePickerText, { color: date ? '#333' : '#999' }]}>
                  {date || 'Selecione a data'}
                </Text>
              </Pressable>
              
              <Pressable 
                style={styles.submitButton} 
                onPress={addTask}
              >
                <Text style={styles.submitButtonText}>Adicionar Tarefa</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Tasks List */}
        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {todos.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={60} color="#e9ecef" />
              <Text style={styles.emptyStateText}>Nenhuma tarefa encontrada</Text>
              <Text style={styles.emptyStateSubtext}>Adicione sua primeira tarefa</Text>
            </View>
          ) : (
            todos.map((item) => (
              <View key={item.id} style={[
                styles.taskItem,
                item.status === 'concluida' && styles.completedTask
              ]}>
                {editingId === item.id ? (
                  <View style={styles.editingForm}>
                    <TextInput
                      style={styles.editInput}
                      value={editingTitle}
                      onChangeText={setEditingTitle}
                      placeholder="Título"
                    />
                    <TextInput
                      style={[styles.editInput, styles.editDescriptionInput]}
                      value={editingDescription}
                      onChangeText={setEditingDescription}
                      placeholder="Descrição"
                      multiline
                      numberOfLines={2}
                    />
                    <Pressable 
                      style={styles.editDatePickerButton}
                      onPress={() => setShowEditCalendar(true)}
                    >
                      <Ionicons name="calendar-outline" size={16} color="#5e72e4" />
                      <Text style={styles.editDatePickerText}>
                        {editingDate || 'Selecionar data'}
                      </Text>
                    </Pressable>
                    <View style={styles.editActions}>
                      <Pressable style={styles.saveButton} onPress={saveEdit}>
                        <Text style={styles.actionButtonText}>Salvar</Text>
                      </Pressable>
                      <Pressable 
                        style={styles.cancelButton} 
                        onPress={() => setEditingId(null)}
                      >
                        <Text style={styles.actionButtonText}>Cancelar</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskTitle}>{item.title}</Text>
                      <View style={[
                        styles.statusBadge,
                        item.status === 'concluida' ? styles.completedBadge : styles.pendingBadge
                      ]}>
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.taskDescription}>{item.description}</Text>
                    
                    <View style={styles.taskFooter}>
                      <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={14} color="#adb5bd" />
                        <Text style={styles.taskDate}>{formatDate(item.date)}</Text>
                      </View>
                      
                      <View style={styles.taskActions}>
                        <Pressable 
                          style={[
                            styles.actionButton,
                            item.status === 'concluida' ? styles.uncompleteButton : styles.completeButton
                          ]}
                          onPress={() => toggleStatus(item.id, item.status)}
                        >
                          <Ionicons 
                            name={item.status === 'concluida' ? "refresh" : "checkmark"} 
                            size={16} 
                            color="#fff" 
                          />
                        </Pressable>
                        <Pressable 
                          style={[styles.actionButton, styles.editButton]} 
                          onPress={() => startEdit(item)}
                        >
                          <Ionicons name="pencil" size={16} color="#fff" />
                        </Pressable>
                        <Pressable 
                          style={[styles.actionButton, styles.deleteButton]} 
                          onPress={() => deleteTask(item.id)}
                        >
                          <Ionicons name="trash" size={16} color="#fff" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Calendar Modal for New Task */}
      <Modal visible={showCalendar} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Selecione a Data</Text>
              <Pressable onPress={() => setShowCalendar(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#5e72e4" />
              </Pressable>
            </View>
            <Calendar
              style={styles.calendar}
              onDayPress={onDateSelect}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                selectedDayBackgroundColor: '#5e72e4',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#5e72e4',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#5e72e4',
                selectedDotColor: '#ffffff',
                arrowColor: '#5e72e4',
                monthTextColor: '#5e72e4',
                indicatorColor: '#5e72e4',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Calendar Modal for Editing Task */}
      <Modal visible={showEditCalendar} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Alterar Data</Text>
              <Pressable onPress={() => setShowEditCalendar(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#5e72e4" />
              </Pressable>
            </View>
            <Calendar
              onDayPress={onEditDateSelect}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                selectedDayBackgroundColor: '#5e72e4',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#5e72e4',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#5e72e4',
                selectedDotColor: '#ffffff',
                arrowColor: '#5e72e4',
                monthTextColor: '#5e72e4',
                indicatorColor: '#5e72e4',
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};