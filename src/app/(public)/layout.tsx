// components
import Header from "@/components/header";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="[grid-area:main]">{children}</main>
    </>
  );
}
