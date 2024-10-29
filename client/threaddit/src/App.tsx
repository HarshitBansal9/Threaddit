import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Home from "./views/Home";
import Rooms from "./views/Rooms";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
