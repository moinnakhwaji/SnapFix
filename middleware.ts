import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const publicRoutes = ['/', '/api/webhooks/clerk', '/api/webhooks/stripe', '/sign-in(.*)', '/sign-up(.*)'];

// Create a route matcher for the public routes
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // Protect routes that are not public
  }
});

export const config = {
  matcher: [
    // Match all API and app routes except for certain file types
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
