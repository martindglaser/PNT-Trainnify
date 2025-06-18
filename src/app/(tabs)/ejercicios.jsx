import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useAuth } from '../../context/authContext'
import { useLocalSearchParams } from 'expo-router';
import { useRutina } from '../../context/routineContext';


export default function Home() {
  const router = useRouter()
  const {rutina,setOrigenRutina ,setRutina} = useRutina();
  const {origenEjercicio ,setOrigenEjercicio } = useRutina()
  const [DATA, setDATA] = React.useState([])
console.log(rutina)
useFocusEffect(
    useCallback(() => {
      fetch('https://683f7dae5b39a8039a54c1fa.mockapi.io/api/v1/Exercise')
      .then(response => response.json())
      .then(data => setDATA(data))
      .catch(err => console.error(err))
      
      return () => {
        setOrigenEjercicio(null);
      };
    }, [])

  )

  // useEffect(() => {
  //   if(origenEjercicio === 'rutina'){
  //     // router.push(`/rutinas/${rutina.id}/edit`)
  //     console.log(rutina)
  //   }
  // }, [rutina]);

  if (DATA.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando ejercicios...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Ejercicios</Text>
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
              onPress={() => {
                if(origenEjercicio === 'ejercicio'){
                  router.push(`../ejercicios/${item.id}/detalle`)
                }else if(origenEjercicio === 'rutina') {
                  console.log('rutina sin actualizar: '+ rutina);
                  setRutina(
                    (prev)=> ({
                    ...prev,
                    exercises: {
                      ...prev.exercises,
                      exercisesIds: [...prev.exercises.exercisesIds, parseInt(item.id)],
                      series: [...prev.exercises.series, 0],
                      reps: [...prev.exercises.reps, 0],
                    }
                    })
                  )
                  setOrigenRutina("ejercicio")
                  setTimeout(() => {
                    router.push(`/rutinas/${rutina.id}/edit`)
                  }, 500);
                }
              }
              }
              
            >
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseDesc} numberOfLines={2}>
                {item.movement || 'Sin movimiento'}
              </Text>
              <View style={styles.tagContainer}>
                {Array.isArray(item.muscle_group) && item.muscle_group.map((group, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{group}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>


      {
        origenEjercicio !== 'rutina' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('../ejercicios/agregar')}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>＋ Agregar ejercicio</Text>
        </TouchableOpacity>  
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
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
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  exerciseDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#1976d2',
    fontWeight: '600',
    fontSize: 13,
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