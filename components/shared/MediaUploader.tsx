"use client";

import { useToast } from "@/components/ui/use-toast";
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast"
    });
  };

  const onUploadErrorHandler = () => {
    toast({
      title: "Something went wrong while uploading",
      description: "Please try again",
      duration: 5000,
      className: "error-toast"
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-6 bg-[#1f1e24] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-50">
            Upload Image
          </h3>

          {publicId ? (
            <div className="relative cursor-pointer overflow-hidden rounded-md">
              <CldImage 
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="Uploaded media"
                sizes={"(max-width: 767px) 100vw, 50vw"}
                placeholder={dataUrl as any}
                className="rounded-md border border-gray-700"
              />
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-3 p-6 border border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-800 transition-all"
              onClick={() => open()}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full">
                <Image 
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="text-sm font-medium text-gray-400">
                Click here to upload an image
              </p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
