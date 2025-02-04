import React from 'react';
import { useDispatch } from 'react-redux';
import { addToBasket } from '../slices/basketSlice';

function Product({ id, title, price, description, category, image }) {
    const dispatch = useDispatch();
    const addItemToBasket = () => {
        const product = {
            id,
            title,
            price,
            description,
            category,
            image
        }
        //Sending a product as an action to the redux store..the basket slice
        dispatch(addToBasket(product))
    }
    return (
        <div className="relative flex flex-col m-5 bg-white z-30 p-10 text-black">

            <p className="absolute top-2 right-2 text-xs italic text-gray-400">{category}</p>
            <img src={image} alt="" className="h-32 w-32 object-contain" />
            <p>{title}</p>
            <div className="text-xs my-2 line-clamp-2">
                <p >{description}</p>
            </div>
            <div className="mb-5 my-5 font-bold">
                <p>${price}</p>
            </div>
            <button onClick={addItemToBasket} className="mt-auto button ">Add to Basket</button>
        </div>
    )
}

export default Product
