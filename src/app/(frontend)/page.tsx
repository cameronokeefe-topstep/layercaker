import type { Metadata } from "next";
import { PageBuilder } from "@/components/page-builder";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";


type RouteProps = {
  params: Promise<{ slug: string }>;
};

const getPage = async (params: RouteProps["params"]) =>
  sanityFetch({
    query: HOME_PAGE_QUERY,
    params: await params,
  });

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { data: page } = await getPage(params);

  if (!page) {
    return {}
  }

  const metadata: Metadata = {
    title: page.homePage.seo.title,
    description: page.homePage.seo.description,
  };

  if (page.homePage.seo.image) {
    metadata.openGraph = {
      images: {
        url: urlFor(page.homePage.seo.image).width(1200).height(630).url(),
        width: 1200,
        height: 630,
      },
    };
  }

  if (page.homePage.seo.noIndex) {
    metadata.robots = "noindex";
  }

  return metadata;
}

export default async function Page({ params }: RouteProps) {
  const { data: page } = await getPage(params);

  return page?.homePage.content ? (
    <PageBuilder
        documentId={page?.homePage._id}
        documentType={page?.homePage._type}
        content={page?.homePage.content}
      />
  ) : null;
}