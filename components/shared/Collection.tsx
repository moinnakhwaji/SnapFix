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
    <div className="bg-gradient-to-b from-[#1f1e24] to-[#2a2730] p-8 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-extrabold md:text-3xl text-gray-50 mr-1">Recent Edits</h2>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <Card image={image} key={image._id as string} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-lg font-medium text-gray-400">No items found</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex items-center justify-center gap-6">
            <Button
              disabled={Number(page) <= 1}
              className="text-gray-200 disabled:text-gray-500 hover:text-purple-400"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:scale-105 transition-transform" />
            </Button>

            <p className="text-gray-300 text-lg">
              Page <span className="font-semibold text-white">{page}</span> of {totalPages}
            </p>

            <Button
              className="text-gray-200 disabled:text-gray-500 hover:text-purple-400"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:scale-105 transition-transform" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const Card = ({ image }: { image: IImage }) => {
  return (
    <li className="bg-[#2a2730] rounded-xl shadow-lg overflow-hidden group">
      <Link href={`/transformations/${image._id}`} className="block">
        <div className="relative h-52 w-full">
          <CldImage
            src={image.publicId}
            alt={image.title}
            width={image.width}
            height={image.height}
            {...image.config}
            loading="lazy"
            className="h-full w-full object-cover group-hover:opacity-90 transition-opacity duration-300"
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-gray-100 font-semibold text-lg">View Transformation</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            {/* <p className="text-gray-100 font-medium truncate">{image.title}</p> */}
            <Image
              src={`/assets/icons/$
                {transformationTypes[
                  image.transformationType as TransformationTypeKey
                ].icon
              }`}
              alt={image.title}
              width={24}
              height={24}
              className="ml-2"
            />
          </div>
        </div>
      </Link>
    </li>
  );
};
