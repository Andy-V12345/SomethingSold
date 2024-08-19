import { Outlet } from "react-router-dom";
import { Account } from "./components/Account";
import SessionManager from "./components/SessionManager";

const App = () => {
  return (
    <Account>
      <SessionManager>
        <Outlet />
      </SessionManager>
    </Account>
  );
};
export default App