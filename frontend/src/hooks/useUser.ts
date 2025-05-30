import { useState, useEffect } from "react";
import { User } from "../types/userType";
import axios from "axios";

export const useUser = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  return { user };
};
