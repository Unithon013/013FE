import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(onboarding)/1_launsh");
  }, [router]);
  return null;
}
