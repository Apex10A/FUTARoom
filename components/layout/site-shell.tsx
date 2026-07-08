import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
