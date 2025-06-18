import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ListaDeChecks from '../../../components/ListaDeChecks';
import { useRutina } from '../../../context/routineContext';

export default function DetalleRoutine() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams();
  const {rutina, setRutina,origenRutina,setOrigenEjercicio} = useRutina();
  const [ejercicios, setEjercicios] = useState([]);

  useEffect(() => {
    if(origenRutina === 'rutina') {
      fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine/${routineId}`)
        .then(res => res.json())
        .then(data => {
          setRutina(data);
          getEjercicios(data.exercises.exercisesIds);
        })
        .catch(err => console.error(err));
    }else if(origenRutina === 'ejercicio') {
      getEjercicios(rutina.exercises.exercisesIds);
    }
  }, []);

  const getEjercicios = async (exercisesIds) => {
    fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise`)
      .then(res => res.json())
      .then(data => {
        const ejerciciosFiltrados = data.filter(ejercicio => exercisesIds.includes(Number(ejercicio.id)));
        setEjercicios(ejerciciosFiltrados);
      })
      .catch(err => console.error(err));
  };

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
        Alert.alert('✅ Rutina actualizada', 'Tu rutina fue actualizada con éxito');
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
        <ActivityIndicator size="large" color={"#1976d2"} />
        <Text style={{ marginTop: 10, fontSize: 22, color: "#1976d2" }}>
          Cargando Rutina...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar rutina</Text>

      <View style={styles.card}>
        <ListaDeChecks
          selectedDays={rutina.days}
          onChangeSeleccion={(nuevosDias) =>
            setRutina(prev => ({
              ...prev,
              days: nuevosDias,
            }))
          }
        />

        <Text style={styles.label}>Nombre</Text>
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

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { minHeight: 48 }]}
          placeholder="Descripción"
          value={rutina.description}
          multiline
          onChangeText={(nuevoDesc) =>
            setRutina(prev => ({
              ...prev,
              description: nuevoDesc,
            }))
          }
        />

        <Text style={[styles.label, { marginTop: 18 }]}>Ejercicios</Text>
        {ejercicios.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Series</Text>
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
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Reps</Text>
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
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
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
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        
        <TouchableOpacity style={styles.saveButton} onPress={()=>{
          router.push({ pathname: '/(tabs)/ejercicios', params: { from: 'rutina' } })
        }}
        >
          <Text style={styles.saveButtonText}> + Agregar Ejercicio</Text>
          
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 18 }]}>Descanso entre ejercicios (segundos)</Text>
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

        <Text style={styles.label}>Descanso entre series (segundos)</Text>
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

        <TouchableOpacity style={styles.saveButton} onPress={guardar}>
          <Text style={styles.saveButtonText}>💾 Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    paddingBottom: 40,
    minHeight: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 24,
    alignSelf: "center",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#1976d2",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
  },
  input: {
    borderWidth: 1,
    borderColor: "#b0bec5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    marginBottom: 6,
  },
  exerciseCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    marginTop: 4,
    shadowColor: "#1976d2",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1976d2",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    backgroundColor: "#ffcdd2",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: "#c62828",
    fontWeight: "bold",
    fontSize: 20,
  },
  saveButton: {
    backgroundColor: "#1976d2",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#1976d2",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});