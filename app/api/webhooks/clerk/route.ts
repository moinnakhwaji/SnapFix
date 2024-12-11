import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser,  deleteUser,  updateUser } from '@/lib/actions/user.action';
// deleteUser

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id || "", // Ensure it's a string even if undefined
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name || "Unknown", // Ensure valid string
        lastName: last_name || "Unknown",   // Ensure valid string
        photo: image_url,
      };

      if (!user.clerkId) {
        throw new Error("clerkId is required.");
      }

      // Create the new user
      const newUser = await createUser(user);
      console.log('New user created:', newUser);

    }  
    if (eventType === 'user.updated') {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const updatedUser = {
        email: email_addresses[0].email_address,
        username: username!,
        firstName: first_name || "Unknown", // Ensure valid string
        lastName: last_name || "Unknown",   // Ensure valid string
        photo: image_url,
      };

      if (!id) {
        throw new Error('clerkId is required.');
      }

      // Update the existing user
      const existingUser = await updateUser(id, updatedUser); // Pass both the clerkId and updatedUser object
      console.log('User updated:', existingUser);

    }
    if (eventType === "user.deleted") {
      const { id } = evt.data;
  
      const deletedUser = await deleteUser(id!);
  
      return Response.json({ message: "OK", user: deletedUser });
    }

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log('Webhook payload:', body);

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Error: Internal server error', { status: 500 });
  }
}
