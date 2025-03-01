import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Check if user is already logged in (e.g., from a token)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found!");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();

          setUser(userData); // Store user info
          setTimeout(() => {
            console.log("Updated User:", user);
          }, 1000); // Wait for state update
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Login failed:", errorData.error);
        return false;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token); // Store token
      setUser(data.user); // Only set the user data

      setTimeout(() => {
        console.log("Updated User:", user);
      }, 1000); // Wait for state update

      return true;
    } catch (error) {
      console.error("Error in login function:", error);
      return false;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
