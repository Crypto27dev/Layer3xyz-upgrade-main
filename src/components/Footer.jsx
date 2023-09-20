import React from 'react'
// import {
//     FaDribbbleSquare,
//     FaFacebookSquare,
//     FaGithubSquare,
//     FaInstagram,
//     FaTwitterSquare
// } from 'react-icons/fa';

import logo from "../assets/logo.svg";

const Footer = () => {
    return (
        // <div className="max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300">
        <div className="max-w-full text-white my-24" style={{ borderTopWidth: '1px', borderColor: 'rgb(47, 54, 69' }}>
            <div className="lg:col-span-3 flex flex-col justify-between mt-6 py-10 mx-11 md:flex md:flex-row md:justify-between md:mx-0 md:my-0 md:px-8">
                <div className='flex flex-col justify-start md:px-10 md:mx-10'>
                    <a className="w-full" href="/">
                        <img src={logo} alt="logo" style={{ width: "105.6px", height: "28px" }} />
                    </a>
                    <h2 className="font-medium text-gray-400 my-3 md:py-6">© 2023 Layer3</h2>
                </div>
                <div className='flex flex-col justify-start md:px-10 md:mx-10'>
                    <h2 className="font-medium text-gray-400 md:text-xl">Product</h2>
                    <ul>
                        <li className="py-2 text-sm md:text-lg">Bridge</li>
                        <li className="py-2 text-sm md:text-lg">Quests</li>
                        <li className="py-2 text-sm md:text-lg">Journeys</li>
                        <li className="py-2 text-sm md:text-lg">For Business</li>
                    </ul>
                </div>
                <div className='flex flex-col justify-start md:px-10 md:mx-10'>
                    <h2 className="font-medium text-gray-400 md:text-xl">Docs</h2>
                    <ul>
                        <li className="py-2 text-sm md:text-lg">Help Center</li>
                        <li className="py-2 text-sm md:text-lg">API</li>
                        <li className="py-2 text-sm md:text-lg">Terms of Service</li>
                        <li className="py-2 text-sm md:text-lg">Privacy Policy</li>
                    </ul>
                </div>
                <div className='flex flex-col justify-start md:px-10 md:mx-10'>
                    <h2 className="font-medium text-gray-400 md:text-xl">Company</h2>
                    <ul>
                        <li className="py-2 text-sm md:text-lg">Blog</li>
                        <li className="py-2 text-sm md:text-lg">Careers</li>
                    </ul>
                </div>
                <div className='flex flex-col justify-start md:px-10 md:mx-10'>
                    <h2 className="font-medium text-gray-400 md:text-xl">Connect</h2>
                    <ul>
                        <li className="py-2 text-sm md:text-lg">Email Us</li>
                        <li className="py-2 text-sm md:text-lg">Twitter</li>
                        <li className="py-2 text-sm md:text-lg">Discord</li>
                        <li className="py-2 text-sm md:text-lg">Discord Bot</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Footer;