import Home from "./views/home";
import { Routes, Route } from "react-router-dom";
import Punks from './views/punks'
import MainLayout from "./layouts/main";
import Punk from "./views/Punk";
import './App.css'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/punks" element={<Punks />}/>
        <Route path="/punks/:tokenId" element={ <Punk/> }/>
      </Routes>
    </MainLayout>
  );
}

export default App;
