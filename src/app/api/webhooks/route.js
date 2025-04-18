import { verifyWebhook } from '@clerk/nextjs/webhooks';

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req, {
      secret: process.env.CLERK_WEBHOOK_SECRET, 
    });

    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`✅ Webhook received with ID ${id} and event type: ${eventType}`);
    console.log('📦 Webhook payload:', body);

    if (eventType === 'user.created') {
      console.log('👤 New user created:', evt.data.id);
    }

    if (eventType === 'user.updated') {
      console.log('🔄 User updated:', evt.data.id);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
