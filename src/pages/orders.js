import React from 'react';
import Header from "../components/Header";
import { getSession, useSession } from 'next-auth/react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import Order from '../components/Order';
import Stripe from 'stripe';

import moment from 'moment';

function Orders({ orders }) {
    const { data: session } = useSession()
    console.log(orders);
    return (
        <div className='bg-gray-100 h-screen'>
            <Header />
            <main className='max-w-screen-lg mx-auto p-10'>
                <h1 className='text-3xl border-b pb-1 mb-2 border-yellow-400'>
                    Your Orders
                </h1>
                {session ? (
                    <h2> {orders.length} orders</h2>
                ) : (
                    <h2>Please sign in to see your orders</h2>
                )}
                <div className='mt-5 space-y-4'>
                    {orders?.map(
                        ({ id, amount, items, timestamp, images }) => (
                            <Order
                                key={id}
                                id={id}
                                amount={amount}
                                items={items}
                                timestamp={timestamp}
                                images={images}

                            />
                        ))}
                </div>
            </main>

        </div>
    )
}

export default Orders;

export async function getServerSideProps(context) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Get the users logged in credentials...
    const session = await getSession(context);
    if (!session) {
        return {
            props: {},
        };
    }
    // Firebase db
    const ordersCollection = await collection(db, `users/${session.user.email}/orders`);
    const stripeOrdersSnapShot = await getDocs(ordersCollection);

    const orders = await Promise.all(stripeOrdersSnapShot.docs.map(async (doc) => ({
        id: doc.id,
        amount: doc.data().amount,
        images: doc.data().images,
        timestamp: moment(doc.data().timestamp.toDate()).unix(),
        items: (
            await stripe.checkout.sessions.listLineItems(doc.id, {
                limit: 100,
            })
        )
    })));

    console.log("orders: " + JSON.stringify(orders))

    // Stripe orders
    return {
        props: {
            orders,
        },
    };
}

