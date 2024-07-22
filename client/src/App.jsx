import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="w-full p-0 h-full">
      <Outlet />
    </div>
  );
};
export default App