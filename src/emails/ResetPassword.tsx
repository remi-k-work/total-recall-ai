// Load environment variables
import "dotenv/config";

// components
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components";

// types
interface ResetPasswordProps {
  url: string;
}

ResetPassword.PreviewProps = { url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/reset-password` } satisfies ResetPasswordProps;

export default function ResetPassword({ url }: ResetPasswordProps) {
  return (
    <Html>
      <Head>
        <title>Total Recall AI ► Reset Password</title>
      </Head>
      <Tailwind>
        <Body className="bg-white text-center font-sans text-indigo-950">
          <Preview>Total Recall AI ► Reset Password</Preview>
          <Container className="mx-auto max-w-xl border border-solid border-indigo-950 p-0">
            <Section className="border-b border-solid border-indigo-950">
              <Img src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/logo.jpg`} alt="Total Recall AI" width={1200} height={630} className="mx-auto h-36 w-auto" />
            </Section>
            <Section className="px-4">
              <Heading className="uppercase">Reset Password</Heading>
              <Text>Click the link below to reset your password:</Text>
              <Button href={url} className="bg-purple-900 px-5 py-3 font-semibold text-white uppercase no-underline">
                Reset Password
              </Button>
            </Section>
            <Section className="mt-8 bg-indigo-950 px-4">
              <Img
                src={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/logo.webp`}
                alt="Total Recall AI"
                width={756}
                height={756}
                className="mx-auto my-3 h-16 w-auto"
              />
              <Text className="my-3 text-white">Thanks, The Total Recall AI Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
