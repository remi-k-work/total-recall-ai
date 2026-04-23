// components
import Header from "@/components/Header";

export default function Layout({ children }: LayoutProps<"/test">) {
  return (
    <>
      <Header />
      <main className="mx-4 [grid-area:main]">{children}</main>
    </>
  );
}
