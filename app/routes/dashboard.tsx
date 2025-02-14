
import { logoutUser } from "~/utils/auth";
import { useNavigate } from "@remix-run/react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    
      <div>
        <h2>Welcome to Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
  
  );
}
