import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useAuth } from '../../context/authContext'
import { useRutina } from '../../context/routineContext'

export default function Home() {
  const router = useRouter()
  const { isAuth, user } = useAuth()
  const [DATA, setDATA] = React.useState([])
const { setOrigenRutina } = useRutina();

useFocusEffect(
    useCallback(() => {
      obtenerRutinas();
      setOrigenRutina('rutina')
    }, [])

  )


  function obtenerRutinas(){
      fetch('https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Routine')
      .then(response => response.json())
      .then(data => setDATA(data))
      .catch(err => console.error(err))
  }


  if (DATA.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando rutinas...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>🏠 Rutinas</Text>
        <FlatList
          data={DATA}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && { backgroundColor: '#e3f2fd' }
              ]}
              onPress={() => router.push(`../rutinas/${item.id}/detalle`)}
            >
              <Text style={styles.routineName}>{item.name}</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('../rutinas/create')}
        activeOpacity={0.85}
      >
        <Text style={styles.addButtonText}>＋ Agregar rutina</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1976d2',
    alignSelf: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginHorizontal: 2,
    minWidth: 250,
  },
  routineName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  routineDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
    backgroundColor: '#1976d2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
})