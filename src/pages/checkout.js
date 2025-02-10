import React from 'react';
import Header from "../components/Header"
import { useSelector } from 'react-redux';
import { selectItems, selectTotal } from '@/slices/basketSlice';
import CheckoutProduct from '@/components/CheckoutProduct';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {
    const items = useSelector(selectItems);
    const total = useSelector(selectTotal);
    const { data: session } = useSession();

    const createCheckoutSession = async () => {
        // API call to create a checkout session
        const stripe = await stripePromise;
        const checkoutSession = await axios.post('/api/create-checkout-session', {
            items: items,
            email: session.user.email,
        });

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id,
        });

        if (result.error) alert(result.error.message);


    };

    return (
        <div className='bg-gray-100'>
            <Header />
            <main className='lg:flex max-w-screen-2xl mx-auto'>
                <div className='flex flex-col p-5 space-y-10 bg-white '>
                    <div className='text-xl border-b pb-4 '>
                        {items.length === 0 ? 'Your amazon Basket is empty' : 'Shopping basket'}


                        {items.map((item, i) => (
                            <CheckoutProduct
                                key={i}
                                id={item.id}
                                title={item.title}
                                price={item.price}
                                description={item.description}
                                category={item.category}
                                image={item.image}

                            />
                        )
                        )}
                    </div>
                </div>
                <div className='flex flex-col bg-white p-10 shadow-md'>
                    {items.length > 0 && (
                        <>
                            <h2 className='whitespace-nowrap'>
                                Subtotal ({items.length} items ):
                                <span className='font-bold'>
                                    ${total}
                                </span>
                            </h2>
                            <button
                                role="link"
                                onClick={createCheckoutSession}
                                disabled={!session}
                                className={`button mt-2 ${!session && 'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'}`}>
                                {!session ? "Sign in to checkout" : "Proceed to checkout"}
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Checkout;