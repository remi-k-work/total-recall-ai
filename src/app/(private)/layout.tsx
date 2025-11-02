// components
import Header from "@/components/header";

export default function Layout({ children, notes }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="mx-4 [grid-area:main]">
        {children}
        {notes}
      </main>
    </>
  );
}
