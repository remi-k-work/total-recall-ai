// components
import Header from "@/components/header";

export default function Layout({ notes, children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="mx-4 [grid-area:main]">
        {notes}
        {children}
      </main>
    </>
  );
}
