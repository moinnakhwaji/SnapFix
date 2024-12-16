import React from 'react';
import Header from '@/components/shared/Header';
import { transformationTypes } from '@/constants';
import TransformationForm from '@/components/shared/TransformationForm';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.action';

interface SearchParamProps {
  params: Promise<{
    id: string | any;
    type: TransformationTypeKey;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}


// Ensure 'params' is awaited
const AddtransFormtypePage = async ({ params }: SearchParamProps) => {
  // Await the dynamic parameter `params`
  const { type } = await params;  // Make sure params are awaited

  const transformation = transformationTypes[type];
  const { userId, redirectToSignIn } = await auth();

  // Redirect to sign-in if no userId is found
  if (!userId) return redirectToSignIn();

  const user = await getUserById(userId);

  try {
    // Fetch the user by userId
    // If user is not found, redirect to sign-in
    if (!user) {
      console.error("[Server] User not found");
      return redirectToSignIn();
    }

    // Log user details
  
  } catch (error) {
    // Handle any unexpected errors
    console.error("[Server] Error fetching user:", error);
    return redirectToSignIn();
  }

  if (!transformation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">Invalid transformation type.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        subtitle={transformation.subTitle}
        title={transformation.title}
      />
      <div className="mt-6">
        <section className="mt-10">
          <TransformationForm
            action="Add"
            userId={userId}
            type={transformation.type as keyof typeof transformationTypes}
            creditBalance={user.creditBalance} // Ensure this field exists
          />
        </section>
      </div>
    </div>
  );
};

export default AddtransFormtypePage;
