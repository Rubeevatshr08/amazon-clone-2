import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import { useEffect } from "react";
import Banner from "./components/Banner";
import Productfeed from "./components/Productfeed";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


export default function Home({ products }) {
  return (
    <div >
      <Header />
      <main>
        <div className="max-w-screen-2xl mx-auto">
          <Banner />
          <Productfeed products={products} />
        </div>
      </main>
    </div>
  );
}
export async function getServerSideProps(context) {
  const products = await fetch('https://fakestoreapi.com/products').then(
    (res) => res.json()
  );

  return {
    props: {
      products,
    },
  };
}