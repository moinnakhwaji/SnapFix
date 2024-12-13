import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const publicRoutes = ['/', '/api/webhook/clerk', '/api/webhook/stripe', '/sign-in(.*)', '/sign-up(.*)'];

// Create a route matcher for the public routes
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request) => {
  console.log('Request URL:', request.url);
  
  if (!isPublicRoute(request)) {
    console.log('Protecting route:', request.url);
    await auth.protect(); // Protect routes that are not public
  } else {
    console.log('Public route, no protection needed');
  }
});

export const config = {
  matcher: [
    // Match all API and app routes except for certain file types
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
