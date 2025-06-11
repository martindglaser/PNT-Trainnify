import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ListaDeChecks from '../../../components/ListaDeChecks';

export default function DetalleRoutine() {
  const { routineId } = useLocalSearchParams();
  const [rutina, setRutina] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);

  useEffect(() => {
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

  function guardar() {
    fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine/${rutina.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rutina),
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert('Rutina actualizada', 'Tu rutina fue actualizada con éxito');
        console.log('Rutina actualizada:', data);
      })
      .catch(err => {
        Alert.alert('Error', 'Ocurrió un error al guardar la rutina');
        console.error(err);
      });
  }

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
     <ListaDeChecks
  selectedDays={rutina.days} // sincronizado desde la API
  onChangeSeleccion={(nuevosDias) =>
    setRutina(prev => ({
      ...prev,
      days: nuevosDias,
    }))
  }
/>


      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={rutina.name}
        onChangeText={(nuevoNombre) =>
          setRutina(prev => ({
            ...prev,
            name: nuevoNombre,
          }))
        }
      />

      <Text style={styles.description}>{rutina.description}</Text>

      {ejercicios.map((exercise, index) => (
        <View key={index} style={{ marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{exercise.name}</Text>

          <Text style={styles.label}>Series:</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={String(rutina.exercises.series[index])}
            onChangeText={(text) =>
              setRutina((prev) => {
                const nuevaSeries = [...prev.exercises.series];
                nuevaSeries[index] = parseInt(text) || 0;
                return {
                  ...prev,
                  exercises: {
                    ...prev.exercises,
                    series: nuevaSeries,
                  },
                };
              })
            }
          />

          <Text style={styles.label}>Reps:</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={String(rutina.exercises.reps[index])}
            onChangeText={(text) =>
              setRutina((prev) => {
                const nuevaReps = [...prev.exercises.reps];
                nuevaReps[index] = parseInt(text) || 0;
                return {
                  ...prev,
                  exercises: {
                    ...prev.exercises,
                    reps: nuevaReps,
                  },
                };
              })
            }
          />

          <Button
            title="Eliminar"
            onPress={() => {
              setRutina(prev => {
                const updatedExercises = {
                  exercisesIds: prev.exercises.exercisesIds.filter((_, i) => i !== index),
                  series: prev.exercises.series.filter((_, i) => i !== index),
                  reps: prev.exercises.reps.filter((_, i) => i !== index),
                };
                return {
                  ...prev,
                  exercises: updatedExercises,
                };
              });

              setEjercicios(prev => prev.filter((_, i) => i !== index));
            }}
          />
        </View>
      ))}

      <Text style={styles.label}>Descanso entre ejercicios:</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={String(rutina.rest_bt_exercises)}
        onChangeText={(text) =>
          setRutina((prev) => ({
            ...prev,
            rest_bt_exercises: parseInt(text) || 0,
          }))
        }
      />

      <Text style={styles.label}>Descanso entre series:</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={String(rutina.rest_bt_series)}
        onChangeText={(text) =>
          setRutina((prev) => ({
            ...prev,
            rest_bt_series: parseInt(text) || 0,
          }))
        }
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cartButton} onPress={guardar}>
          <Text style={styles.cartText}> Guardar </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFF',
    alignContent: 'center',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    marginBottom: 30,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  buttons: {
    width: '100%',
    gap: 16,
  },
  cartButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center'
  },
  cartText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600'
  },
});
