import { createContext, useContext, useState, ReactNode } from "react";

interface UserData {
  matricula: string;
  nome: string;
}

interface UserContextType {
  user: UserData | null;
  login: (matricula: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const login = (matricula: string) => {
    // Generate mock name based on matricula
    const mockNames = [
      "Ana Silva",
      "Carlos Santos",
      "Maria Oliveira",
      "João Souza",
      "Paula Costa",
      "Roberto Lima",
      "Fernanda Alves",
      "Lucas Pereira",
    ];
    const index = parseInt(matricula.slice(-1)) || 0;
    const nome = mockNames[index % mockNames.length];
    setUser({ matricula, nome });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
