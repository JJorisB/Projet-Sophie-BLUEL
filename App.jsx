import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Logement from "./pages/Logement.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
             <Route path="/about" element={<About />} />
              <Route path="/logement/:id" element={<Logement />} />
              <Route path="*" element={<ErrorPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
