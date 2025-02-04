import React from 'react';
import Image from 'next/image';
import { removeFromBasket, selectTotal } from '@/slices/basketSlice';
import { useDispatch, useSelector } from 'react-redux';

function CheckoutProduct({ id, title, price, description, category, image }) {
    const dispatch = useDispatch();
    const total = useSelector(selectTotal);

    const removeItemFromBasket = () => {
        dispatch(removeFromBasket({ id }));
    };

    return (
        <div className="grid grid-cols-5">
            <Image src={image} height={150} width={170} objectFit="contain" alt={title} />
            <div className="col-span-3 mx-5">
                <p>{title}</p>
                <p className="text-xs my-2 line-clamp-3">{description}</p>
                <p className="font-bold">${price}</p>
            </div>
            <div className="flex flex-col space-y-2 my-auto justify-self-end">
                <button onClick={removeItemFromBasket} className="button">Remove from Basket</button>
            </div>
        </div>
    );
}

export default CheckoutProduct;