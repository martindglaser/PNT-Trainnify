import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ListaDeChecks from '../../../components/ListaDeChecks';

export default function DetalleRoutine() {

    const { routineId } = useLocalSearchParams()
    const [rutina, setRutina] = useState(null)
    const [ejercicios, setEjercicios] = useState([])
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);

    const [nombre, setNombre] = useState('')


    useEffect(() => {
      fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine/${routineId}`)
      .then( res => res.json())
      .then(data => {
        setRutina(data)
        getEjercicios(data.exercises.exercisesIds);
        setNombre(data.name)
    })
      .catch(err => console.error(err))


        const getEjercicios = async (exercisesIds) => {
            fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise`)
            .then(res => res.json())
            .then(data => {
                const ejerciciosFiltrados = data.filter(ejercicio => exercisesIds.includes(Number(ejercicio.id)));
                setEjercicios(ejerciciosFiltrados)
            })
            .catch(err => console.error(err))
        }
    }, [])



    function guardar() {
        Alert.alert(
            "Rutina Guardada",
            "Tu rutina ha sido guardada correctamente.",
            [
                { text: "OK", onPress: () => console.log("Rutina guardada") }
            ]
        );
    }



    if(!rutina){
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={"red"} />
                <Text style={{ marginTop: 10, fontSize: 26}}>Cargando Rutina...</Text>
            </View>
        )
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ListaDeChecks onChangeSeleccion={setDiasSeleccionados} />
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
        />
       <Text style={styles.description}>{rutina.description}</Text>
        {
            ejercicios.map((exercise, index) => {

                return(
                    <View key={index} style={{marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8}}>
                        
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{exercise.name}</Text>
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
                    </View>
                );
        })
        }
        <View style={styles.buttons}>
            <TouchableOpacity style={styles.cartButton} onPress={() => guardar()}>
                <Text style={styles.cartText}> Guardar </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: '#FFF',
      alignContent: 'center',
      paddingBottom: 40,
    },
    loadingContainer:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width: 260,
        height: 260,
        resizeMode: 'contain',
        marginBottom: 20
    },
    title:{
        fontSize: 22,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        marginBottom: 10,
    },
    price:{
        fontSize: 20,
        fontWeight: '700',
        color: "#43a047",
        marginBottom: 10,
    },
    description:{
        fontSize: 16,
        color: '#555',
        textAlign: 'justify',
        marginBottom: 30,
    },
    buttons:{
        width: '100%',
        gap: 16,
    },
    cartButton:{
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
    buyButton:{
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#007aff',
        alignItems: 'center'
    },
    buyText:{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
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
  });


  
  