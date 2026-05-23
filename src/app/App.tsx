import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <div className="w-full min-h-screen bg-[#0F172A] overflow-auto">
        <RouterProvider router={router} />
      </div>
    </UserProvider>
  );
}
