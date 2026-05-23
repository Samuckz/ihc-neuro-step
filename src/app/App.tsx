import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <div className="size-full bg-[#0F172A] overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </UserProvider>
  );
}
