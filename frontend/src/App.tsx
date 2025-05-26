import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Callback } from "./pages/Callback";
import { Home } from "./pages/Home";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Routes>
    </>
  );
}
