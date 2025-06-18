import { createContext, useContext, useState } from "react";

const RutinaContext = createContext();

export const useRutina = () => useContext(RutinaContext);

export const RutinaProvider = ({ children }) => {
  const [rutina, setRutina] = useState(null);
  const [origenRutina, setOrigenRutina] = useState('rutina');

  return (
    <RutinaContext.Provider
      value={{ rutina, setRutina, origenRutina, setOrigenRutina }}
    >
      {children}
    </RutinaContext.Provider>
  );
};
