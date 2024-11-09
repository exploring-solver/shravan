import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { createProject, parseProjectCode } from '../../services/Api';

const CreateProject = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const theme = useTheme();

  const handleSubmit = async () => {
    try {
      const project = await createProject({ name, description });
      await parseProjectCode(project._id, { code });
      navigation.navigate('ProjectDetails', { id: project._id });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Project Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      <TextInput
        label="Microcontroller Code"
        value={code}
        onChangeText={setCode}
        multiline
        numberOfLines={10}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Create Project
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default CreateProject;