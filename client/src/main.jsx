import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Landing from "./components/Landing";
import "./index.css";
import AuthPage from "./components/AuthPage";
import Home from "./components/Home";
import ListItem from "./components/ListItem";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/auth/:mode", element: <AuthPage /> },
      { path: "/home", element: <Home /> },
      { path: "/sell", element: <ListItem /> }
    ],
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);