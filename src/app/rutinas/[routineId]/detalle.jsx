import { router, useLocalSearchParams } from 'expo-router';
import React, { use, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../context/authContext';
import { useRutina } from '../../../context/routineContext';

export default function DetalleRoutine() {

    const { routineId } = useLocalSearchParams()
    const { user } = useAuth()
    const [rutina, setRutina] = useState(null)
    const [ejercicios, setEjercicios] = useState([])

    const {setOrigenRutina} = useRutina()


    useEffect(() => {
        
        setOrigenRutina('rutina');
      fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine/${routineId}`)
      .then( res => res.json())
      .then(data => {
        setRutina(data)
        getEjercicios(data.exercises.exercisesIds);
    })
      .catch(err => console.error(err))


        const getEjercicios = async (exercisesIds) => {
            fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise`)
            .then(res => res.json())
            .then(data => {
                console.log('IDS '+ exercisesIds)
                console.log('Ejercicios obtenidos: ', data);
                const ejerciciosFiltrados = data.filter(ejercicio => exercisesIds.includes(Number(ejercicio.id)));
                console.log('ejercicios Filtrados: '+ ejerciciosFiltrados);
                setEjercicios(ejerciciosFiltrados)
            })
            .catch(err => console.error(err))
        }
    }, [])

    if(!rutina){
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={"red"} />
                <Text style={{ marginTop: 10, fontSize: 26}}>Cargando Rutina...</Text>
            </View>
        )
    }

    console.log(user.id)

  return (
    <ScrollView contentContainerStyle={styles.container}>
       {/* <Image
        source={{uri: producto.image}}
        style={styles.image}
       /> */}
       <Text style={styles.title}>{rutina.name}</Text>
       <Text style={styles.description}>{rutina.description}</Text>
        {
            ejercicios.map((exercise, index) => {

                return(
                    <View key={index} style={{marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{exercise.name}</Text>
                        <Text>Series: {rutina.exercises.series[index]}</Text>
                        <Text>Reps: {rutina.exercises.reps[index]}</Text>
                    </View>
                );
        })
        }
        
        <View style={styles.buttons}>
            {
            user.id == rutina.usuarioId &&
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push(`/rutinas/${routineId}/edit`)}>
                <Text style={styles.cartText}> Modificar </Text>
            </TouchableOpacity>
            }
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
    }
  });
  