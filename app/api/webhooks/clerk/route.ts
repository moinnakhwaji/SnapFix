import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.action';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  // Ensure the SIGNING_SECRET is configured
  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  // Initialize Svix webhook instance
  const webhook = new Webhook(SIGNING_SECRET);

  // Extract headers
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // Verify required headers
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Read and verify the payload
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);

  let event: WebhookEvent;
  try {
    event = webhook.verify(payloadString, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Process the event
  const { id } = event.data;
  const eventType = event.type;

  try {
    if (eventType === 'user.created') {
      const { email_addresses, image_url, first_name, last_name, username } =
        event.data;

      const user = {
        clerkId: id || '',
        email: email_addresses[0].email_address,
        username: username || 'Unknown',
        firstName: first_name || 'Unknown',
        lastName: last_name || 'Unknown',
        photo: image_url,
      };

      if (!user.clerkId) {
        throw new Error('clerkId is required.');
      }

      const newUser = await createUser(user);
      console.log('New user created:', newUser);
    }

    if (eventType === 'user.updated') {
      const { email_addresses, image_url, first_name, last_name, username } =
        event.data;

      const updatedUser = {
        email: email_addresses[0].email_address,
        username: username || 'Unknown',
        firstName: first_name || 'Unknown',
        lastName: last_name || 'Unknown',
        photo: image_url,
      };

      if (!id) {
        throw new Error('clerkId is required.');
      }

      const existingUser = await updateUser(id, updatedUser);
      console.log('User updated:', existingUser);
    }

    if (eventType === 'user.deleted') {
      const deletedUser = await deleteUser(id!);
      console.log('User deleted:', deletedUser);
      return Response.json({ message: 'OK', user: deletedUser });
    }

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log('Webhook payload:', payloadString);

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response('Error: Internal server error', { status: 500 });
  }
}
