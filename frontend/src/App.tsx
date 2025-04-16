import { Routes, Route } from "react-router-dom";
import { Login } from "./login";
import { Callback } from "./callback";
import { Home } from "./Home";

function App() {
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

export default App;
