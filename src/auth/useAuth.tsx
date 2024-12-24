import { useEffect, useState } from "react";
import { fetchData } from "../utils/axios";
import { EXPIRE_MINUTES } from '../constant/constants';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Initial state is null, will be set based on auth check

  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        localStorage.clear();
        setIsAuthenticated(false);
        return;
      }

      const tokenExpiresIn = localStorage.getItem("tokenExpiresIn");
      if (tokenExpiresIn) {
        const expiresAt = new Date(tokenExpiresIn);
        const currentDateTime = new Date();
        if (expiresAt <= currentDateTime) {
          try {
            const refreshToken = localStorage.getItem("userGuid");
            if(refreshToken)
            {
              const response = await fetchData(`/user/refreshToken?refreshToken=${refreshToken}`);
              if (response?.data?.length) {
                currentDateTime.setMinutes(currentDateTime.getMinutes() + EXPIRE_MINUTES);
                localStorage.setItem("tokenExpiresIn", currentDateTime.toISOString());

                const { jwtToken, refreshToken, email, fullName, profileImage } = response.data;
                localStorage.setItem("accessToken", jwtToken);
                localStorage.setItem("userGuid", refreshToken);
                localStorage.setItem("profileImage", profileImage);
                localStorage.setItem("user", JSON.stringify({ email, fullName }));

                setIsAuthenticated(true);
                return;
              }
            }
            localStorage.clear();
            setIsAuthenticated(false);
          } catch (error) {
            localStorage.clear();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(true);
        }
      } else {
        localStorage.clear();
        setIsAuthenticated(false);
      }
    };

    checkAuthorization();
  }, []);

  return isAuthenticated;
};

export default useAuth;
