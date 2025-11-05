import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "./Auth";

export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.replace("/login");
      }
    }, []);

    return isAuthenticated() ? <Component {...props} /> : null;
  };
}
