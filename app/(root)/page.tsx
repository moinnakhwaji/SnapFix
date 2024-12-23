import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.action";
import Image from "next/image";
import Link from "next/link";

interface SearchParamProps {
  searchParams: Promise<{
    page?: string | any;
    query?: string | any;
  }>;
}


const Home = async ({ searchParams }: { searchParams: Promise<SearchParamProps["searchParams"]> }) => {
  // Await the searchParams to ensure they are resolved
  const resolvedSearchParams = await searchParams;

  // Extract and handle search parameters with default values
  const page = parseInt(resolvedSearchParams?.page || "1", 10); // Default to page 1
  const searchQuery = resolvedSearchParams?.query || ""; // Default to an empty string

  // Fetch images based on search parameters
  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      {/* Hero Section */}
      <section className="home bg-gradient-to-b from-purple-800 to-gray-900 text-white py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
          Unleash Your Creative Vision with <span className="text-indigo-500">SnapFix</span>
        </h1>
      <ul className="flex justify-center flex-wrap gap-10">
  {navLinks.slice(1, 5).map((link) => (
    <Link
      key={link.route}
      href={link.route}
      className="group flex flex-col items-center gap-4 transition-transform hover:scale-110"
    >
      <li className="flex items-center justify-center w-16 h-16 rounded-full bg-white group-hover:bg-purple-800 transition-colors">
        <Image src={link.icon} alt={link.label} width={24} height={24} />
      </li>
      <p className="text-lg font-medium text-center text-white group-hover:text-indigo-400">
        {link.label}
      </p>
    </Link>
  ))}
</ul>

      </section>

      {/* Collection Section */}
      <section className="mt-16 sm:mt-12 px-4">
        <Collection
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
