import Image from "next/image";
import { HomeIcon, ShoppingBagIcon, Search } from "lucide-react";


export default function Header() {
    return (
        <header>
            <div className="flex items-center bg-black p-1 flex-grow py-2 ">
                <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
                    <Image src={"/amazonlogo.png"}
                        width={100}
                        height={100}
                        objectFit="contain"
                        className="cursor-pointer" />
                </div>
                <div className="hidden sm:flex items-center h-full rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
                    <input type="text" className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 text-black" />
                    < Search className="h-12 p-4" color="black" />
                </div>
                <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                    <div className="link">
                        <p>hello</p>
                        <p className="font-extrabold">Accounts & lists</p>
                    </div>
                    <div className="link">
                        <p>Returns</p>
                        <p className="font-extrabold"> & Orders </p>
                    </div>
                    <div className="relative link flex items-center">
                        <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">0</span>
                        <ShoppingBagIcon className="h-10" />
                        <p className="font-extrabold">Baskett</p>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </header>
    );
}