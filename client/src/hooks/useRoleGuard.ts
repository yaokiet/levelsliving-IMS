import { useSelector } from "react-redux";
import { RootState } from "@/app/_store/redux-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useRoleGuard(requiredRole: string) {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      setAuthorized(false);
      return;
    }
    if (user.role !== requiredRole) {
      router.replace("/unauthorized");
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [user, requiredRole, router]);

  return authorized;
}