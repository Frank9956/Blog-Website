import dynamic from 'next/dynamic';

export async function generateMetadata({ params }) {
  const { category } = await params; // 👈 must await
  const slug = category.toUpperCase();

  return {
    title: `${slug} - Entrance Fever`,
    description: `Explore posts in the ${slug} category on Entrance Fever.`,
  };
}

const CategoryPageClient = dynamic(() => import('@/app/components/CategoryPageClient'));

export default async function CategoryPageWrapper({ params }) {
  const { category } = await params; // 👈 must await
  return <CategoryPageClient category={category} />;
}
