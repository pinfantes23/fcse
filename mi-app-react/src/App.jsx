// App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaDetalle from "./components/PantallaDetalle";

import { db } from "./firebase"; // Solo Firestore
import { doc, setDoc, getDoc } from "firebase/firestore";

import {
  temasPoliciaNacional,
  temasGuardiaCivil,
  temasFuncionarioPrisiones,
} from "./temas";

import { v4 as uuidv4 } from "uuid"; // Para generar ID único por usuario

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [bolaActiva, setBolaActiva] = useState(null);
  const [contador, setContador] = useState(0);
  const [progreso, setProgreso] = useState({});
  const [color, setColor] = useState("#444");
  const [organizacion, setOrganizacion] = useState("");
  const [objetivos, setObjetivos] = useState({});
  const [usuarioId, setUsuarioId] = useState(null);

  // Generar un ID único para el usuario
  useEffect(() => {
    let id = localStorage.getItem("usuarioId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("usuarioId", id);
    }
    setUsuarioId(id);

    // Cargar datos desde Firestore
    (async () => {
      const docSnap = await getDoc(doc(db, "usuarios", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgreso(data.progreso || {});
        setObjetivos(data.objetivos || {});
        setOrganizacion(data.organizacion || "");
      }
    })();
  }, []);

  // Guardar datos en Firestore
  const guardarDatosUsuario = async (nuevosProgreso = progreso, nuevosObjetivos = objetivos) => {
    if (!usuarioId) return;
    await setDoc(
      doc(db, "usuarios", usuarioId),
      { progreso: nuevosProgreso, objetivos: nuevosObjetivos, organizacion },
      { merge: true }
    );
  };

  const guardarBola = (nuevoColor, nuevoContador) => {
    const nuevos = {
      ...progreso,
      [bolaActiva]: { color: nuevoColor, contador: nuevoContador },
    };
    setProgreso(nuevos);
    guardarDatosUsuario(nuevos, objetivos);
  };

  const cambiarColor = (nuevoColor) => {
    setColor(nuevoColor);
    guardarBola(nuevoColor, contador);
  };

  const cambiarContador = (delta) => {
    const nuevo = Math.max(0, contador + delta);
    setContador(nuevo);
    guardarBola(color, nuevo);
  };

  const añadirObjetivo = (nuevo) => {
    if (!nuevo.trim()) return;
    const claveTema = `${organizacion}-${bolaActiva}`;
    const nuevos = {
      ...objetivos,
      [claveTema]: [...(objetivos[claveTema] || []), nuevo.trim()],
    };
    setObjetivos(nuevos);
    guardarDatosUsuario(progreso, nuevos);
  };

  // Selección de temas según organización
  let temas;
  if (organizacion === "Policía Nacional") temas = temasPoliciaNacional;
  else if (organizacion === "Guardia Civil") temas = temasGuardiaCivil;
  else if (organizacion === "Funcionario de prisiones") temas = temasFuncionarioPrisiones;
  else temas = {};

  const abrirBola = (num) => {
    const info = progreso[num] || { color: "#444", contador: 0 };
    setBolaActiva(num);
    setColor(info.color);
    setContador(info.contador);
    setPantalla("detalle");
  };

  return (
    <>
      {pantalla === "inicio" && (
        <PantallaInicio setPantalla={setPantalla} setOrganizacion={setOrganizacion} />
      )}

      {pantalla === "principal" && (
        <PantallaPrincipal
          temas={temas}
          progreso={progreso}
          abrirBola={abrirBola}
          setPantalla={setPantalla}
          organizacion={organizacion}
        />
      )}

      {pantalla === "detalle" && (
        <PantallaDetalle
          temas={temas}
          bolaActiva={bolaActiva}
          contador={contador}
          setContador={setContador}
          color={color}
          cambiarColor={cambiarColor}
          cambiarContador={cambiarContador}
          organizacion={organizacion}
          objetivos={objetivos}
          setObjetivos={setObjetivos}
          setPantalla={setPantalla}
          añadirObjetivo={añadirObjetivo}
        />
      )}
    </>
  );
}
