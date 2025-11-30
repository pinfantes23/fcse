export default function PantallaPrincipal({ temas, progreso, abrirBola, setPantalla, organizacion }) {
  let encabezado = "";
  let colorEncabezado = "#000"; // declaramos la variable con valor por defecto

  if (organizacion === "Policía Nacional") {
    encabezado = "CUERPO NACIONAL DE POLICÍA";
    colorEncabezado = "#3498db"; // azul
  } else if (organizacion === "Guardia Civil") {
    encabezado = "GUARDIA CIVIL";
    colorEncabezado = "#28a745"; // verde
  } else if (organizacion === "Funcionario de prisiones") {
    encabezado = "FUNCIONARIO DE PRISIONES";
    colorEncabezado = "#8b4513"; // marrón
  }

  const anchoBolas = 5 * 60 + 4 * 10; // 5 columnas * 60px + 4 gaps de 10px

  return (
    <div
      className="pantalla-principal"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
        gap: "20px", // espacio entre encabezado y bolas
      }}
    >
      {/* Botón volver */}
      <button
        className="volver"
        onClick={() => setPantalla("inicio")}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1000,
        }}
      >
        ←
      </button>

      {/* Encabezado centrado y con ancho igual al grid */}
      <div
        style={{
          width: `${anchoBolas}px`,
          textAlign: "center",
          whiteSpace: "nowrap", // evita que se divida en dos líneas
        }}
      >
        <h2 style={{ margin: 0, color: colorEncabezado }}>{encabezado}</h2>
      </div>

      {/* Contenedor de bolas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 60px)",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {Object.keys(temas).map((num) => {
          const color = progreso[num]?.color || "#444";
          return (
            <div
              key={num}
              className="bola"
              style={{
                backgroundColor: color,
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => abrirBola(Number(num))}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
