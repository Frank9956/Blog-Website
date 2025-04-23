import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req) {
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error(
      'Please add CLERK_WEBHOOK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  const { id } = evt?.data;
  const eventType = evt?.type;
  console.log(`Webhook with ID: ${id} and Event Type: ${eventType}`);
  console.log('Webhook body:', body);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { first_name, last_name, image_url, email_addresses, username } = evt?.data;
    try {
      const user = await createOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      );
      if (user && eventType === 'user.created') {
        try {
          // Ensure clerkClient is available
          if (clerkClient && clerkClient.users) {
            console.log('Updating user metadata for ID:', id);
            await clerkClient.users.updateUserMetadata(id, {
              publicMetadata: {
                userMongoId: user._id,
                isAdmin: user.isAdmin,
              },
            });
            console.log('User metadata updated successfully');
          } else {
            console.error('clerkClient or clerkClient.users is undefined');
          }
        } catch (error) {
          console.error('Error updating user metadata:', error);
          return new Response('Error updating user metadata', { status: 500 });
        }
      }
    } catch (error) {
      console.error('Error creating or updating user:', error);
      return new Response('Error creating or updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt?.data;
    try {
      await deleteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
