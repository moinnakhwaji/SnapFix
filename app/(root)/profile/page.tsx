import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { getUserImages } from "@/lib/actions/image.action";
import { getUserById } from "@/lib/actions/user.action";

const Profile = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const images = await getUserImages({ page, userId: user._id });

  return (
    <>
    <div className="my-3">
    <Header title="Profile" subtitle={" "} />
    </div>
   

      <section className="profile bg-gray-900 text-white p-6 md:p-10 rounded-xl shadow-lg">
        <div className="profile-balance border-b border-gray-700 pb-6 mb-6">
          <p className="text-lg font-semibold text-gray-400">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="w-12 h-12 md:w-16 md:h-16"
            />
            <h2 className="text-2xl font-bold text-purple-500">{user.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="text-lg font-semibold text-gray-400">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="photo"
              width={50}
              height={50}
              className="w-12 h-12 md:w-16 md:h-16"
            />
            <h2 className="text-2xl font-bold text-purple-500">{images?.data.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;
