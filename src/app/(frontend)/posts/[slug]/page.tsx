import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY } from "@/sanity/lib/queries";
import { Post } from '@/components/post';

type RouteProps = {
  params: Promise<{ slug: string }>;
};

const getPage = async (params: RouteProps["params"]) =>
  sanityFetch({
    query: POST_QUERY,
    params: await params,
  });

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { data: post } = await getPage(params);

  if (!post) {
    return {}
  }

  const metadata: Metadata = {
    title: post.seo.title,
    description: post.seo.description,
  };

  if (post.seo.image) {
    metadata.openGraph = {
      images: {
        url: urlFor(post.seo.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
      },
    };
  }

  if (post.seo.noIndex) {
    metadata.robots = "noindex";
  }

  return metadata;
}

export default async function Page({ params }: RouteProps) {
  const { data: post } = await getPage(params);

  if (!post) {
    notFound()
  }

  return (
    <>
    <main className="container mx-auto grid grid-cols-1 gap-6 p-12">
      <Post {...post} />
    </main>
    </>
  )
}

