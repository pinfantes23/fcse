import { useState, useEffect } from "react";
import "./App.css";
import PantallaInicio from "./components/PantallaInicio";
import PantallaPrincipal from "./components/PantallaPrincipal";
import PantallaDetalle from "./components/PantallaDetalle";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { temasPoliciaNacional, temasGuardiaCivil, temasFuncionarioPrisiones } from "./temas";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [bolaActiva, setBolaActiva] = useState(null);
  const [color, setColor] = useState("#444");
  const [contador, setContador] = useState(0);
  const [usuarioId, setUsuarioId] = useState(null);

  const [organizacion, setOrganizacion] = useLocalStorage("organizacion", "");
  const [progreso, setProgreso] = useLocalStorage("progreso", {});
  const [objetivos, setObjetivos] = useState({});

  // Generar ID único de usuario
  useEffect(() => {
    let id = localStorage.getItem("usuarioId");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("usuarioId", id);
    }
    setUsuarioId(id);

    // Cargar datos de Firestore
    (async () => {
      if (!organizacion) return;
      const docSnap = await getDoc(doc(db, "usuarios", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgreso(data.progreso || {});
        setObjetivos(data[`objetivos-${organizacion}`] || {});
      }
    })();
  }, [organizacion]);

  // Guardar datos en Firestore
  const guardarDatosUsuario = async (nuevosProgreso = progreso, nuevosObjetivos = objetivos) => {
    if (!usuarioId || !organizacion) return;
    await setDoc(
      doc(db, "usuarios", usuarioId),
      {
        progreso: nuevosProgreso,
        [`objetivos-${organizacion}`]: nuevosObjetivos,
        organizacion,
      },
      { merge: true }
    );
  };

  const abrirBola = (num) => {
    const info = progreso[`${organizacion}-${num}`] || { color: "#444", contador: 0 };
    setBolaActiva(num);
    setColor(info.color);
    setContador(info.contador);
    setPantalla("detalle");
  };

  // Selección de temas
  let temas;
  if (organizacion === "Policía Nacional") temas = temasPoliciaNacional;
  else if (organizacion === "Guardia Civil") temas = temasGuardiaCivil;
  else if (organizacion === "Funcionario de prisiones") temas = temasFuncionarioPrisiones;
  else temas = {};

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
          color={color}
          contador={contador}
          setContador={setContador}
          cambiarColor={setColor}
          cambiarContador={setContador}
          organizacion={organizacion}
          objetivos={objetivos}
          setObjetivos={setObjetivos}
          progreso={progreso}
          setProgreso={setProgreso}
          setPantalla={setPantalla}
          guardarDatosUsuario={guardarDatosUsuario}
        />
      )}
    </>
  );
}
