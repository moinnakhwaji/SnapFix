"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/databases/models/image.model";
import { formUrlQuery } from "@/lib/utils";

import { Button } from "../ui/button";
import { Search } from "./Search";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-200">Recent Edits</h2>
        {hasSearch && <Search  />}
      </div>

      {images.length > 0 ? (
        <ul className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <Card image={image} key={image._id as string} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-400 text-lg">
          <p>Empty List</p>
        </div>
      )}

      {totalPages > 0 && (
        <Pagination className="mt-10 flex justify-center">
          <PaginationContent className="flex items-center space-x-4">
            <Button
              disabled={Number(page) <= 1}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:text-gray-100" />
            </Button>

            <p className="text-gray-300">
              {page} / {totalPages}
            </p>

            <Button
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 disabled:opacity-50"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:text-gray-100" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const Card = ({ image }: { image: IImage }) => {
  return (
    <li className="relative group">
      <Link href={`/transformations/${image._id}`} className="block overflow-hidden rounded-lg shadow-lg bg-gray-900">
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width}
          height={image.height}
          {...image.config}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="p-4 flex items-center justify-between">
         
        <Image
  src={`/assets/icons/${
    transformationTypes[image.transformationType as keyof typeof transformationTypes]?.icon
  }`}
  alt={image.title}
  width={24}
  height={24}
  className="ml-2"
/>

        </div>
      </Link>
    </li>
  );
};
