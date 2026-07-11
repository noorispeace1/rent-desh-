import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PropertiesLayout({ children }: { children: React.ReactNode }) {
  try {
    const headersList = await headers();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/get-session`, {
      headers: headersList,
      cache: "no-store",
    });
    
    if (!res.ok) {
      redirect("/auth/signin");
    }

    const session = await res.json();
    if (!session || !session.user) {
      redirect("/auth/signin");
    }
  } catch (error) {
    // If fetch fails (e.g. server starting up or not authenticated)
    redirect("/auth/signin");
  }

  return <>{children}</>;
}
