import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useAuth } from '../../../context/authContext';
import { useRutina } from '../../../context/routineContext';

export default function DetalleRoutine() {
  const { routineId } = useLocalSearchParams();
  const { user } = useAuth();
  const [rutina, setRutina] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const { setOrigenRutina } = useRutina();

  const diasRutina = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ]

  useEffect(() => {
    setOrigenRutina('rutina');

    fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine/${routineId}`)
      .then(res => res.json())
      .then(data => {
        setRutina(data);
        getEjercicios(data.exercises.exercisesIds);
      })
      .catch(err => console.error(err));

    const getEjercicios = async (exercisesIds) => {
      fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise`)
        .then(res => res.json())
        .then(data => {
          const ejerciciosFiltrados = data.filter(ejercicio => exercisesIds.includes(Number(ejercicio.id)));
          setEjercicios(ejerciciosFiltrados);
        })
        .catch(err => console.error(err));
    };
  }, []);

  const eliminarRutina = () => {
    Alert.alert(
      "¿Eliminar rutina?",
      "¿Estás seguro de que deseas eliminar esta rutina?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine/${routineId}`, {
                method: 'DELETE'
              });
              Alert.alert("Rutina eliminada", "La rutina fue eliminada correctamente.");
              router.replace('/(tabs)');
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar la rutina.");
            }
          }
        }
      ]
    );
  };


  
  if (!rutina) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"red"} />
        <Text style={{ marginTop: 10, fontSize: 26 }}>Cargando Rutina...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{rutina.name}</Text>
      <Text style={styles.description}>{rutina.description}</Text>

      <Text style={styles.label}>Días de la semana:</Text>
      <Text style={styles.text}>{
        rutina.days
        .map((id) => diasRutina[id])
        .filter(Boolean)
        .join(', ')
      }</Text>

      <Text style={styles.label}>Descanso entre ejercicios:</Text>
      <Text style={styles.text}>{rutina.rest_bt_exercises} segundos</Text>

      <Text style={styles.label}>Descanso entre series:</Text>
      <Text style={styles.text}>{rutina.rest_bt_series} segundos</Text>

      <Text style={styles.label}>Ejercicios:</Text>
      {ejercicios.map((exercise, index) => (
        <View key={index} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text>Series: {rutina.exercises.series[index]}</Text>
          <Text>Reps: {rutina.exercises.reps[index]}</Text>
        </View>
      ))}

      {user.id == rutina.usuarioId && (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push(`/rutinas/${routineId}/edit`)}
          >
            <Text style={styles.cartText}>Modificar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={eliminarRutina}
          >
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFF',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    marginBottom: 20,
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1976d2',
    marginTop: 14,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  exerciseCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 6,
  },
  exerciseName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#444',
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
  cartButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  cartText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffcdd2',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: {
    color: '#c62828',
    fontSize: 16,
    fontWeight: 'bold',
  },
});