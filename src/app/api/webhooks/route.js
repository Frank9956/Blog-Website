// route.js or route.ts (if using TypeScript)
import { Webhook } from '@clerk/backend';

const webhookHandler = new Webhook({ secret: process.env.CLERK_WEBHOOK_SIGNING_SECRET });

export async function POST(req) {
  try {
    const payload = await req.text(); // read raw body
    const signature = req.headers.get('clerk-signature'); // read signature header

    const evt = webhookHandler.verifySignature({
      payload,
      headers: { 'clerk-signature': signature },
    });

    console.log('✅ Webhook verified:', evt.type);
    console.log('📦 Payload:', evt.data);

    if (evt.type === 'user.created') {
      console.log('👤 New user created:', evt.data.id);
    }

    if (evt.type === 'user.updated') {
      console.log('🔄 User updated:', evt.data.id);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
