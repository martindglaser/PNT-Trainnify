import React, { useEffect } from 'react'
import { Button, Text, View, Image } from 'react-native'
import { useAuth } from '../../context/authContext';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';


export default function settings() {
  const { logout, setFotoPerfil, user } = useAuth();

  const [perfil, setPerfil] = useState(null);

  const [subiendoFoto, setSubiendoFoto] = useState(false);



  const cambiarFotoDePerfil = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      handleUpload(uri)
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
  return json.secure_url; // esta es la URL pública de la imagen
};





 const handleUpload = async (uri) => {
    setSubiendoFoto(true);
    const url = await uploadImageToCloudinary(uri);
    setFotoPerfil(url);
    setSubiendoFoto(false);
    console.log('Imagen subida: ' + url);
};


  if(subiendoFoto) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Subiendo foto...</Text>
      </View>
    );
  }


  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Settings</Text>
        <Button title='Cambiar foto de perfil' onPress={cambiarFotoDePerfil} />
        {
          user.avatar ? 
          <Image
            source={{ uri: user.avatar }}
            style={{ width: 200, height: 200, borderRadius: 10 }}
          />
        : 
          <Text>Todavía no tenés foto de perfil...</Text>
        }
        
        <Button title='Log out' onPress={logout}/>
        
    </View>
  )
}
