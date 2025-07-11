import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetalleEjercicio() {
  const { ejercicioId } = useLocalSearchParams();
  const [ejercicio, setEjercicio] = useState(null);
    const router = useRouter();

  useEffect(() => {
    fetch(
      `https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise/${ejercicioId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setEjercicio(data);
      })
      .catch((err) => console.error(err));
  }, []);

  function guardar() {
    fetch(
      `https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise/${ejercicio.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ejercicio),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(
          "✅ Ejercicio actualizado",
          "Tu ejercicio fue actualizado con éxito"
        );
        router.replace("/(tabs)/ejercicios");
      })
      .catch((err) => {
        Alert.alert("Error", "Ocurrió un error al guardar el ejercicio");
        console.error(err);
      });
  }

  if (!ejercicio) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={"#1976d2"} />
        <Text style={{ marginTop: 10, fontSize: 22, color: "#1976d2" }}>
          Cargando Ejercicio...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar ejercicio</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={ejercicio.name}
          onChangeText={(nuevoNombre) =>
            setEjercicio((prev) => ({
              ...prev,
              name: nuevoNombre,
            }))
          }
        />

        <Text style={[styles.label, { marginTop: 18 }]}>Grupos Musculares</Text>
        {Array.isArray(ejercicio.muscle_group) &&
          ejercicio.muscle_group.map((group, index) => (
            <View key={index} style={styles.muscleRow}>
              <TextInput
                style={[styles.input, { flex: 8, marginRight: 8 }]}
                value={group}
                placeholder={`Grupo #${index + 1}`}
                onChangeText={(text) =>
                  setEjercicio((prev) => ({
                    ...prev,
                    muscle_group: prev.muscle_group.map((g, i) =>
                      i === index ? text : g
                    ),
                  }))
                }
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  setEjercicio((prev) => ({
                    ...prev,
                    muscle_group: prev.muscle_group.filter(
                      (_, i) => i !== index
                    ),
                  }))
                }
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        <TouchableOpacity
          style={styles.addMuscleButton}
          onPress={() => {
            setEjercicio((prev) => ({
              ...prev,
              muscle_group: [...(prev.muscle_group || []), ""],
            }));
          }}
        >
          <Text style={styles.addMuscleButtonText}>＋ Agregar grupo</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 18 }]}>Movimiento</Text>
        <TextInput
          style={styles.input}
          placeholder="Movimiento"
          value={ejercicio.movement}
          onChangeText={(nuevoMovimiento) =>
            setEjercicio((prev) => ({
              ...prev,
              movement: nuevoMovimiento,
            }))
          }
        />

        <TouchableOpacity style={styles.saveButton} onPress={guardar}>
          <Text style={styles.saveButtonText}>Guardar</Text>
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
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    flex: 2,
    backgroundColor: "#ffcdd2",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  deleteButtonText: {
    color: "#c62828",
    fontWeight: "bold",
    fontSize: 20,
  },
  addMuscleButton: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  addMuscleButtonText: {
    color: "#1976d2",
    fontWeight: "bold",
    fontSize: 16,
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