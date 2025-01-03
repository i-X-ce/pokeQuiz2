import QuizPageContent from "@/app/components/quiz/QuizPageContent";

export default function Home() {
  return (
    <>
      <QuizPageContent />
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  // eslint-disable-next-line
  searchParams: any;
}) {
  const { result = "0" } = await searchParams;
  const ogImageUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/og?result=${encodeURIComponent(result)}`;

  return {
    openGraph: {
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/quiz-page`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl],
    },
  };
}
