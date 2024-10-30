import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import Home from "./views/Home";
import Rooms from "./views/Rooms";
import Login from "./views/Login";
import CallBack from "./views/CallBack";
function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/login" element={<Login />} />
                <Route path="/callback" element={<CallBack />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
