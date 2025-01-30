import React from 'react';
import Currency from 'react-currency-formatter';
function Product({ id, title, price, description, category, image }) {
    return (
        <div className="relative flex flex-col m-5 bg-white z-30 p-10 text-black">

            <p className="absolute top-2 right-2 text-xs italic text-gray-400">{category}</p>
            <img src={image} alt="" className="h-32 w-32 object-contain" />
            <h4>{title}</h4>
            <div className="text-xs my-2 line-clamp-2">
                <p >{description}</p>
            </div>
            <div className="mb-5 my-5 font-bold">
                <Currency quantity={price} currency="USD" />
            </div>
            <button className="mt-auto button ">Add to Basket</button>
        </div>
    )
}

export default Product
