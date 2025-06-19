import { Routes, Route } from "react-router-dom";
import { PublicRoute } from "./auth/PublicRoute";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Callback } from "./pages/Callback";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";

export function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/callback" element={<Callback />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Routes>
    </>
  );
}
