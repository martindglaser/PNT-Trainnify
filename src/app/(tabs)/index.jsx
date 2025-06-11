import { Link, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../../context/authContext'

export default function Home(){
    const router = useRouter()
    const { isAuth, user } = useAuth()
    const [DATA, setDATA] = React.useState([])

   
    useEffect(() => {
        
        console.log("test")
        fetch('https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine')
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched: ", data);
            setDATA(data)
        })
      .catch(err => console.error(err))

    },[])

    console.log("user: ", user);


    if(DATA.length === 0){
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Loading...</Text>
            </View>
        )
    }


  return (

    <View style={styles.container}>
        <Text style={styles.title}>🏠 Home Screen</Text>

        <FlatList
            data={DATA}
            renderItem={({item}) => <Button onPress={() => router.push(`../rutinas/${item.id}/detalle`)} title={item.name} />}
            keyExtractor={item => item.id.toString()}
        />
        
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title:{
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    button:{
        backgroundColor: '#2195f3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginBottom: 15,
        minWidth:200
    },
    buttonText:{
        color: 'white',
        fontSize: 18,
    }
})