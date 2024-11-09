import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, TextInput, useTheme } from 'react-native-paper';
import { fetchProjectDetails, executeCommand } from '../../../services/Api';

const ProjectDetails = ({ route }) => {
  const { id } = route.params;
  const [project, setProject] = useState(null);
  const [commands, setCommands] = useState([]);
  const [newCommand, setNewCommand] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const details = await fetchProjectDetails(id);
        setProject(details.project);
        setCommands(details.commands);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };
    loadProjectDetails();
  }, [id]);

  const handleExecuteCommand = async () => {
    try {
      const response = await executeCommand(id, newCommand);
      alert(`Command executed: ${response.action}`);
      setNewCommand('');
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  if (!project) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Title title={project.name} subtitle={project.description} />
        <Card.Content>
          <Text style={styles.sectionTitle}>Available Commands:</Text>
          {commands.map(command => (
            <View key={command._id} style={styles.commandItem}>
              <Text style={styles.commandName}>{command.name}</Text>
              <Text>{command.description}</Text>
              {command.parameters && command.parameters.length > 0 && (
                <View>
                  <Text style={styles.parameterTitle}>Parameters:</Text>
                  {command.parameters.map((param, index) => (
                    <Text key={index} style={styles.parameter}>{param}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Enter a command"
            value={newCommand}
            onChangeText={setNewCommand}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleExecuteCommand} style={styles.button}>
            Execute Command
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  commandItem: {
    marginBottom: 10,
  },
  commandName: {
    fontWeight: 'bold',
  },
  parameterTitle: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  parameter: {
    marginLeft: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default ProjectDetails;