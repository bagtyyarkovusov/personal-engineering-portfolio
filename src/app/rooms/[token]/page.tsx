import { notFound } from "next/navigation";
import { getPrivateRoomData } from "@/features/private-rooms/private-room-queries";
import { PrivateRoomView } from "@/features/private-rooms/private-room-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PrivateRoomPageProps {
  params: Promise<{ token: string }>;
}

export default async function PrivateRoomPage({ params }: PrivateRoomPageProps) {
  const { token } = await params;
  const data = await getPrivateRoomData(token);
  if (!data) notFound();
  return <PrivateRoomView data={data} />;
}
