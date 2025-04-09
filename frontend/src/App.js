import { useEffect } from "react";
import useAuthStore from "./stores/authStore";

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // try to fetch user on load (valid session or refresh)
  }, []);

  return (
    <div>
      <div></div>
    </div>
  );
};

export default App;
