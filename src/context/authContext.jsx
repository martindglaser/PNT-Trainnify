import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const cargarEstadoAuth = async () => {
      const isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      const userData = await AsyncStorage.getItem("userData");

      if (isAuthenticated === "true" && userData) {
        const compatible = await LocalAuthentication.hasHardwareAsync();

        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (compatible && enrolled) {
          const results = await LocalAuthentication.authenticateAsync({
            promptMessage: "Verifica tu identidad",
            fallbackLabel: "Usar contrasenia",
            cancelLabel: "Cancelar",
          });

          if (results.success) {
            setUser(JSON.parse(userData));
            setStatus("authenticated");
            setIsAuth(true);
          } else {
            alert("Authenticacion cancelada o fallida");
            await AsyncStorage.removeItem("isAuthenticated");
            await AsyncStorage.removeItem("userData");
            setStatus("unauthenticated");
            setIsAuth(false);
          }
        } else {

          setUser(JSON.parse(userData));
          setStatus("authenticated");
          setIsAuth(true);
        }
      } else {
        setStatus("unauthenticated");
        setIsAuth(false);
      }
    };

    cargarEstadoAuth();
  }, []);

  const login = async ({ usuario, password }) => {
    try {

      const response = await fetch(
        "https://683f7cf35b39a8039a54c028.mockapi.io/api/v1/usuarios"
      );
      const data = await response.json();

      const user = data.find(
        (u) => u.username === usuario && u.password === password
      );

      if (user) {
        await AsyncStorage.setItem("isAuthenticated", "true");
        await AsyncStorage.setItem("userData", JSON.stringify(user));
        setUser(user);
        setIsAuth(true);
        setStatus("authenticated");
      } else {
        alert("Usuario o password incorrectos");
        setStatus("unauthenticated");
      }
    } catch (error) {
      console.error(error);
      alert("Error en la authenticacion");
      setStatus("unauthenticated");
    }
  };

  const register = async ({ usuario, email, password }) => {
    try {
      const response = await fetch(
        "https://683f7cf35b39a8039a54c028.mockapi.io/api/v1/usuarios"
      );
      const data = await response.json();
      const userExist = data.some((u) => u.usuario === usuario);
      const emailExist = data.some((u) => u.email === email);

      if (userExist) {
        alert("Usuario ya registrado");
      } else if (emailExist) {
        alert("Email ya registrado");
      } else {
        const body = JSON.stringify({
          email: email,
          username: usuario,
          password: password,
          avatar: "",
          name: "",
          admin: false,
        });


        const respuesta = await fetch(
          "https://683f7cf35b39a8039a54c028.mockapi.io/api/v1/usuarios",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          }
        );

        if (respuesta.ok) {
          alert("Registro Exitoso");
        } else {
          alert("Error al registrar el usuario");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error en la autenticacion");
    }
  };

  const logout = () => setIsAuth(false);

  const setFotoPerfil = async (uri) => {
    if (user) {
      try {
        const body = JSON.stringify({
          avatar: uri,
        });

        fetch(
          `https://683f7cf35b39a8039a54c028.mockapi.io/api/v1/usuarios/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: body,
          }
        );
        const updatedUser = { ...user, avatar: uri };
        setUser(updatedUser);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Error al actualizar la foto de perfil:", error);
      }
    }
  };


  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, register, user, setFotoPerfil }}
    >
      {children}
    </AuthContext.Provider>
  );
};
