// ListaDeChecks.js
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const diasSemana = [
  {id: 0, nombre: 'Domingo'},
  {id: 1, nombre: 'Lunes',},
  {id: 2, nombre: 'Martes',},
  {id: 3, nombre: 'Miércoles',},
  {id: 4, nombre: 'Jueves',},
  {id: 5, nombre: 'Viernes',},
  {id: 6, nombre: 'Sábado',},
];

const ListaDeChecks = ({ onChangeSeleccion }) => {
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);

  const toggleDia = (dia) => {
    const nuevosSeleccionados = diasSeleccionados.includes(dia)
      ? diasSeleccionados.filter((d) => d !== dia)
      : [...diasSeleccionados, dia];

    setDiasSeleccionados(nuevosSeleccionados);
  };

  // Cuando cambia la selección, informamos al padre
  useEffect(() => {
    if (onChangeSeleccion) {
      onChangeSeleccion(diasSeleccionados);
    }
  }, [diasSeleccionados]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccioná los días:</Text>
      {diasSemana.map((dia) => (
        <Pressable
          key={dia.id}
          style={styles.item}
          onPress={() => toggleDia(dia.id)}
        >
          <Text style={styles.checkbox}>
            {diasSeleccionados.includes(dia.id) ? '☑️' : '⬜'}
          </Text>
          <Text style={styles.label}>{dia.nombre}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ListaDeChecks;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  checkbox: { fontSize: 22, marginRight: 10 },
  label: { fontSize: 16 },
});
