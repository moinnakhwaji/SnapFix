import { Webhook } from 'svix';
import { WebhookEvent, clerkClient } from '@clerk/clerk-sdk-node'; // Correct import
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.action';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  const webhook = new Webhook(SIGNING_SECRET);

  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const payloadString = JSON.stringify(payload);

  let event: WebhookEvent;

  try {
    event = webhook.verify(payloadString, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  const { type: eventType, data } = event;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, username } = data;

      const user = {
        clerkId: id,
        email: email_addresses[0]?.email_address || '',
        username: username || ' ',
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url,
      };

      console.log("user",user)
      const newUser = await createUser(user);

      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: { userId: newUser._id },
        });
      }

      return NextResponse.json({ message: 'OK', user: newUser });
    }

    if (eventType === 'user.updated') {
      const { id, image_url, first_name, last_name, username } = data;

      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        username: username || '',
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json({ message: 'OK', user: updatedUser });
    }

    if (eventType === 'user.deleted') {
      const { id } = data;

      if (!id) {
        throw new Error('Invalid ID: ID is undefined');
      }

      const deletedUser = await deleteUser(id);

      return NextResponse.json({ message: 'OK', user: deletedUser });
    }

    return new Response('Unhandled event type', { status: 400 });
  } catch (err) {
    console.error(`Error handling event type ${eventType}:`, err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
