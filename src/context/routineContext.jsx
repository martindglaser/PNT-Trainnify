import { createContext, useContext, useState } from "react";

const RutinaContext = createContext();

export const useRutina = () => useContext(RutinaContext);

export const RutinaProvider = ({ children }) => {
  const [rutina, setRutina] = useState(null);
  const [origenRutina, setOrigenRutina] = useState('rutina');
  const [origenEjercicio, setOrigenEjercicio] = useState('ejercicio');

  return (
    <RutinaContext.Provider
      value={{ rutina, setRutina, origenRutina, setOrigenRutina,origenEjercicio, setOrigenEjercicio }}
    >
      {children}
    </RutinaContext.Provider>
  );
};
