import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";

const Credits = async () => {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // const user = await getUserById(userId);


  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section className="px-6 py-10 bg-black">
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className="rounded-lg bg-[#1f1e24] shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col items-center gap-3">
                <Image src={plan.icon} alt="check" width={60} height={60} />
                <p className="mt-2 text-lg font-semibold text-[#6556cd]">
                  {plan.name}
                </p>
                <p className="text-2xl font-bold text-gray-50">
                  ${plan.price}
                </p>
                <p className="text-sm text-gray-400">
                  {plan.credits} Credits
                </p>
              </div>

              <ul className="mt-4 border-t border-gray-700 pt-4">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="text-gray-400">
                      {inclusion.label}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {plan.name === "Free" ? (
                  <Button
                    variant="outline"
                    className="w-full py-2 text-[#6556cd] border-[#6556cd] hover:bg-[#6556cd] hover:text-white transition-colors"
                  >
                    Free Consumable
                  </Button>
                ) : (
                  <SignedIn>
                    {/* <Checkout
                      plan={plan.name}
                      amount={plan.price}
                      credits={plan.credits}
                      buyerId={user._id}
                    /> */}
                  </SignedIn>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;
