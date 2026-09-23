import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia', // Utilisation d'une version récente de l'API
});

export async function POST(req: Request) {
  try {
    const { amount, items, userEmail } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1000, // Montant par défaut 10.00 € (en centimes)
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        cart_items: items ? JSON.stringify(items.map((i: any) => ({
          id: i.id,
          q: i.quantity,
          p: i.price,
          n: i.name.substring(0, 30) // limit name length to save space
        }))) : '[]',
        userEmail: userEmail || 'guest',
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Erreur Stripe:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du PaymentIntent' },
      { status: 500 }
    );
  }
}
