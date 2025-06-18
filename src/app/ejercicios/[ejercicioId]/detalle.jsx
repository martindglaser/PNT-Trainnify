import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DetalleExercise() {

    const { ejercicioId } = useLocalSearchParams()
    const [ejercicio, setEjercicio] = useState(null)


    useEffect(() => {
      fetch(`https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise/${ejercicioId}`)
      .then( res => res.json())
      .then(data => {
        setEjercicio(data)
    })
      .catch(err => console.error(err))
    }, [])

    if(!ejercicio){
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={"red"} />
                <Text style={{ marginTop: 10, fontSize: 26}}>Cargando Ejercicio...</Text>
            </View>
        )
    }


  return (
    <ScrollView contentContainerStyle={styles.container}>
       {/* <Image
        source={{uri: producto.image}}
        style={styles.image}
       /> */}
       <Text style={styles.title}>{ejercicio.name}</Text>
       <Text style={styles.description}>{ejercicio.description}</Text>

            <View style={{marginBottom: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8}}>
                <Text style={{fontWeight: 'bold'}}>Grupos musculares:</Text>
                {
                    ejercicio.muscle_group.map((group, index) => (
                        <Text key={index}>     {group}</Text>
                    ))
                }
                <Text style={{fontWeight: 'bold'}}>Movimiento:</Text>
                <Text>     {ejercicio.movement}</Text>
            </View>

        <View style={styles.buttons}>
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push(`/ejercicios/${ejercicioId}/edit`)}>
                <Text style={styles.cartText}> Modificar </Text>
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
    }
  });
  