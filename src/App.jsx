import React from "react";
import Board from "./components/Board";
// import LoadingScreen from "./components/LoadingScreen";

function App() {
  // Si quieres pantalla de carga, descomenta abajo y ajusta el estado
  // const [loading, setLoading] = React.useState(true);
  // React.useEffect(() => {
  //   const timer = setTimeout(() => setLoading(false), 2000);
  //   return () => clearTimeout(timer);
  // }, []);
  // return loading ? <LoadingScreen /> : <Board />;
  return <Board />;
}

export default App;
