import { useState } from "react";
import PopupObjetivo from "./PopupObjetivo";

export default function PantallaDetalle({
  temas,
  bolaActiva,
  contador,
  setContador,
  color,
  cambiarColor,
  cambiarContador,
  organizacion,
  objetivos,
  setObjetivos,
  setPantalla
}) {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [objetivoAEliminar, setObjetivoAEliminar] = useState(null);

  const claveTema = `${organizacion}-${bolaActiva}`;
  const comentariosTema = objetivos[claveTema] || [];

  const añadirObjetivo = (nuevo) => {
    if (nuevo.trim() === "") return;
    if (comentariosTema.length >= 10) return; // extra seguridad
    const actualizados = {
      ...objetivos,
      [claveTema]: [...comentariosTema, nuevo.trim()]
    };
    setObjetivos(actualizados);
    localStorage.setItem("objetivos", JSON.stringify(actualizados));
  };

  const pedirEliminar = (idx) => {
    setObjetivoAEliminar(idx);
    setMostrarConfirmar(true);
  };

  const eliminarObjetivo = () => {
    const actualizados = {
      ...objetivos,
      [claveTema]: comentariosTema.filter((_, idx) => idx !== objetivoAEliminar)
    };
    setObjetivos(actualizados);
    localStorage.setItem("objetivos", JSON.stringify(actualizados));
    setMostrarConfirmar(false);
    setObjetivoAEliminar(null);
  };

  return (
    <div className="pantalla-detalle">
      {/* Botón volver */}
      <button
        className="volver"
        onClick={() => setPantalla("principal")}
        style={{ top: "10px", left: "10px", position: "fixed" }}
      >
        ←
      </button>

      {/* Título del tema */}
      <h2 className="titulo">{temas[bolaActiva]}</h2>

      {/* Bola seleccionada */}
      <div className="bola-seleccionada" style={{ backgroundColor: color }}>
        {bolaActiva}
      </div>

      {/* Contador */}
      <div className="contador-area">
        <button onClick={() => cambiarContador(-1)}>−</button>
        <div className="contador-valor">{contador}</div>
        <button onClick={() => cambiarContador(1)}>+</button>
      </div>

      {/* Botones de colores y objetivos */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button className="color-boton verde-oscuro" onClick={() => cambiarColor("#1e8449")}>Dominio absoluto!</button>
          <button className="color-boton verde-claro" onClick={() => cambiarColor("#58d68d")}>Se defiende.</button>
          <button className="color-boton amarillo" onClick={() => cambiarColor("#f1c40f")}>Más o menos me lo sé.</button>
          <button className="color-boton marron" onClick={() => cambiarColor("#8b4513")}>Me lo he leído un par de veces.</button>
          <button className="color-boton azul" onClick={() => cambiarColor("#3498db")}>Me lo quiero estudiar.</button>
          <button className="color-boton gris" onClick={() => cambiarColor("#444")}>Sin empezar.</button>
          <button
            className="color-boton vino"
            onClick={() => setMostrarPopup(true)}
            disabled={comentariosTema.length >= 10} // ❌ Deshabilita si hay 10 objetivos
            style={{
              opacity: comentariosTema.length >= 10 ? 0.5 : 1,
              cursor: comentariosTema.length >= 10 ? "not-allowed" : "pointer"
            }}
          >
            Objetivos
          </button>
        </div>

        {/* Lista de objetivos */}
        <div style={{ flex: 1 }}>
          <h3>Objetivos :</h3>
          {comentariosTema.length === 0 ? (
            <p>No hay objetivos aún.</p>
          ) : (
            <ul>
              {comentariosTema.map((obj, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {obj}
                  <button
                    onClick={() => pedirEliminar(idx)}
                    style={{
                      backgroundColor: "#8B0000",
                      color: "#fff",
                      border: "1px solid #8B0000",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      cursor: "pointer"
                    }}
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Popup para añadir objetivo */}
      {mostrarPopup && (
        <PopupObjetivo
          onClose={() => setMostrarPopup(false)}
          onAñadir={añadirObjetivo}
        />
      )}

      {/* Popup de confirmación eliminar */}
      {mostrarConfirmar && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "90%",
            maxWidth: "400px",
            textAlign: "center"
          }}>
            <h3 style={{ color: "#000" }}>¿Deseas eliminar este objetivo?</h3>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={() => setMostrarConfirmar(false)}
                style={{
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "1px solid #ff4d4d",
                  borderRadius: "4px",
                  padding: "5px 15px",
                  cursor: "pointer"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={eliminarObjetivo}
                style={{
                  backgroundColor: "#8B0000",
                  color: "#fff",
                  border: "1px solid #8B0000",
                  borderRadius: "4px",
                  padding: "5px 15px",
                  cursor: "pointer"
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
