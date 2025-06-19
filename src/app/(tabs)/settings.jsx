import React, { useState } from 'react';
import { Button, Text, View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/authContext';
import * as ImagePicker from 'expo-image-picker';

export default function Settings() {
  const { logout, setFotoPerfil, user } = useAuth();
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const cambiarFotoDePerfil = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleUpload(uri);
    }
  };

  const uploadImageToCloudinary = async (photoUri) => {
    const data = new FormData();
    data.append('file', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    data.append('upload_preset', 'unsigned_preset');

    const res = await fetch('https://api.cloudinary.com/v1_1/dghgwmyut/image/upload', {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    return json.secure_url;
  };

  const handleUpload = async (uri) => {
    setSubiendoFoto(true);
    const url = await uploadImageToCloudinary(uri);
    setFotoPerfil(url);
    setSubiendoFoto(false);
    console.log('Imagen subida: ' + url);
  };

  if (subiendoFoto) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Subiendo foto...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>?</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={cambiarFotoDePerfil}>
        <Text style={styles.buttonText}>Cambiar foto de perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
        <Text style={[styles.buttonText, { color: '#c62828' }]}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 32,
    letterSpacing: 1,
  },
  avatarContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 60,
    color: '#90caf9',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    marginTop: 18,
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonText: {
    color: '#1976d2',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: '#ffcdd2',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: '#1976d2',
  },
});