import styled from "styled-components";
import "./App.css";
import Canvas from "./components/Canvas";

function App() {
  return (
    <AppComponent>
      <Canvas />
    </AppComponent>
  );
}

export default App;

const AppComponent = styled.div`
  width: 100%;
  height: 100vh;
`;
