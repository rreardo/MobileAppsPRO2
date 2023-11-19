import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import alert from '../alert';

export default function TaskManager() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from AsyncStorage when the component mounts
    loadTasks();
  }, []);

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAddTask = () => {
    if (taskName.trim() !== '' && taskDescription.trim() !== '') {
      const newTask = { name: taskName, description: taskDescription };
      const newTasks = tasks.concat(newTask);
      setTasks(newTasks);
      saveTasks(newTasks);
      setTaskName('');
      setTaskDescription('');
    }
  };

  const deleteTask = (index) => {
    return alert(
      'Are you sure?',
      'Are you sure you want to remove this task?',
      [
        // The "No" button
        {
          text: 'No',
        },
        // The "Yes" button
        {
          text: 'Yes',
          onPress: () => {
            let taskList = tasks.concat();
            taskList.splice(index, 1);
            setTasks(taskList);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a Task Name"
        value={taskName}
        onChangeText={(text) => setTaskName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter a Description"
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
              key={index}
              style={styles.deleteButton}
              onPress={() => deleteTask(index)}>
              <Text style={styles.deleteText}>-</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = require('../Styles');
