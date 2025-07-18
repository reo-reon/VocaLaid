"use client";
import { useRouter } from "next/navigation";
import HomeScreen from "@/features/HomeScreen";

export default function HomePage() {
  const router = useRouter();
  return <HomeScreen onNext={() => router.push("/category")} />;
}