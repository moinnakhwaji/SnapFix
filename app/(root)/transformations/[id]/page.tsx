import { auth } from '@clerk/nextjs/server';
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/actions/image.action";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";


interface SearchParamProps {
  params: Promise<{
    id: string | any;
    type: TransformationTypeKey;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


const transformations = async ({ params }: SearchParamProps) => {
//@ts-ignore
  const { id } = params; // Now params is properly destructured
  const { userId } = await auth(); // Await auth before proceeding

  const image = await getImageById(id); // Make sure to use the awaited id
  
  return (
    <>
      <Header title={image.title} subtitle={""} />

      <section className="mt-6 px-4 md:px-8">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex gap-2 items-center">
            <p className="text-gray-300 font-medium">Transformation:</p>
            <p className="capitalize text-purple-500 font-semibold">
              {image.transformationType}
            </p>
          </div>

          {image.prompt && (
            <>
              <div className="hidden md:block text-gray-400">&bull;</div>
              <div className="flex gap-2 items-center">
                <p className="text-gray-300 font-medium">Prompt:</p>
                <p className="capitalize text-purple-500 font-semibold">
                  {image.prompt}
                </p>
              </div>
            </>
          )}

          {image.color && (
            <>
              <div className="hidden md:block text-gray-400">&bull;</div>
              <div className="flex gap-2 items-center">
                <p className="text-gray-300 font-medium">Color:</p>
                <p className="capitalize text-purple-500 font-semibold">
                  {image.color}
                </p>
              </div>
            </>
          )}

          {image.aspectRatio && (
            <>
              <div className="hidden md:block text-gray-400">&bull;</div>
              <div className="flex gap-2 items-center">
                <p className="text-gray-300 font-medium">Aspect Ratio:</p>
                <p className="capitalize text-purple-500 font-semibold">
                  {image.aspectRatio}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mt-10 border-t border-gray-700 pt-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-gray-300">Original</h3>

            <Image
              width={getImageSize(image.transformationType, image, "width")}
              height={getImageSize(image.transformationType, image, "height")}
              src={image.secureURL}
              alt="Original Image"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Transformed Image */}
          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            isTransforming={false}
            transformationConfig={image.config}
            hasDownload={true}
          />
        </div>

        {userId === image.author.clerkId && (
          <div className="mt-8 space-y-4">
            <Button
              asChild
              type="button"
              className="w-full  bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all"
            >
              <Link href={`/transformations/${image._id}/update`}>
                Update Image
              </Link>
            </Button>

            <DeleteConfirmation imageId={image._id} />
          </div>
        )}
      </section>
    </>
  );
};

export default transformations;
