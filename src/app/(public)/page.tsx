// components
import PageHeader from "@/components/PageHeader";
import SectionHeader from "@/components/SectionHeader";
import Hero from "@/components/hero";
import TestimonialSlider from "@/components/testimonial-slider";
import SignInDemoUser from "@/features/auth/components/SignInDemoUser";

export default function Page() {
  return (
    <>
      <PageHeader title="Home" description="Welcome to Total Recall AI!" />
      <Hero />
      <SectionHeader title="Testimonials from our Satisfied Users" />
      <TestimonialSlider />
      <SectionHeader title="Try out Total Recall AI right now!" />
      <SignInDemoUser />
    </>
  );
}
