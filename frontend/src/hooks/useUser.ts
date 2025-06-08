import { useState, useEffect } from "react";
import { User } from "../types/userType";
import { apiClient } from "../auth/apiClient";

export const useUser = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get("/users", {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("[useUser] Failed to fetch user: ", error);
      }
    };

    fetchUser();
  }, []);

  return { user };
};
