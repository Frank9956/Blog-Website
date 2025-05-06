
import dynamic from 'next/dynamic';

export async function generateMetadata({ params }) {
  const slug = params.category.toUpperCase();

  return {
    title: `${slug} - Entrance Fever`,
    description: `Explore posts in the ${slug} category on Entrance Fever.`,
  };
}

const CategoryPageClient = dynamic(() => import('@/app/components/CategoryPageClient'), {
  
});

export default function CategoryPageWrapper({ params }) {
  return <CategoryPageClient category={params.category} />;
}
