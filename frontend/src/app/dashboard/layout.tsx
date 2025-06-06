import Footer from "@frontend/components/common/footer";
import { ProfileBadge } from "@frontend/components/common/profile-badge";
import { retrieveUser } from "@frontend/lib/data";
import { FlyingBox } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Medusa Eats",
  description: "Order food from your favorite restaurants",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await retrieveUser();

  return (
    <>
      <nav className="flex px-4 md:px-10 py-4 h-16 bg-ui-fg-base text-ui-fg-on-inverted justify-between items-center sticky top-0 z-40">
        <Link
          href="/"
          className="flex gap-2 items-center text-xl font-semibold hover:text-ui-bg-base-hover"
        >
          <FlyingBox /> Medusa Eats
        </Link>
        <Link
          href="https://medusajs.com/"
          className="flex gap-1 items-center txt-compact-small hover:text-ui-bg-base-hover"
        >
          <Image
            src="/medusa-logo.svg"
            alt="Medusa"
            className="h-8"
            height={30}
            width={30}
          />
        </Link>
        <div className="flex gap-2 items-center">
          <ProfileBadge user={user} />
        </div>
      </nav>
<main className="flex flex-col gap-20 p-4 md:p-10 min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-content">
      {children}
      </main>
      <Footer />
    </>
  );
}
