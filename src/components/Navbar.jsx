import React, { useState } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import logo from "../assets/logo.svg";
import QuestsIcon from "../assets/QuestsIcon.svg";
import SearchIcon from "../assets/SearchIcon.svg";
import BridgeIcon from "../assets/BridgeIcon.svg";

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const handleNav = () => {
        setNav(!nav);
    }
    return (
        <div style={{ borderBottomWidth: '1px', borderColor: 'rgb(47, 54, 69' }}>
            <div className="flex justify-between items-center h-14 max-w-full my-1 mx-auto md:mx-10 px-4 text-white">
                <a className="w-full" href="/">
                    <img src={logo} alt="logo" style={{ width: "105.6px", height: "28px" }} />
                </a>
                <ul className="hidden md:flex">
                    <li className="p-4 flex items-center">
                        <span style={{ marginRight: '5px', width: '15px', height: '15px' }}>
                            <img src={QuestsIcon} alt="" />
                        </span>
                        Quests
                    </li>
                    <li className="p-4 flex items-center">
                        <span style={{ marginRight: '5px', width: '15px', height: '15px' }}>
                            <img src={SearchIcon} alt="" />
                        </span>
                        Search
                    </li>
                    <li className="p-4 flex items-center">
                        <span style={{ marginRight: '5px', width: '15px', height: '15px' }}>
                            <img src={BridgeIcon} alt="" />
                        </span>
                        Bridge
                    </li>
                </ul>
                <ul>
                    <button className="inline-flex items-center justify-center" style={{ width: 'max-content', padding: "5px 10px", fontFamily: 'inherit', borderRadius: 10, margin: "0 16px 0 16px", cursor: "pointer", backgroundColor: "#2F3645", color: 'white' }}>
                        Sign in
                    </button>
                </ul>
                <div onClick={handleNav} className="block md:hidden">
                    {
                        nav ? <AiOutlineClose size={20} /> :
                            <AiOutlineMenu size={20} />
                    }
                </div>
                <div className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500' : 'fixed left-[-100%]'}>
                    <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">Menu</h1>
                    <ul className="uppercase p-4">
                        <li className="p-4 border-b border-gray-600 flex items-center">
                            <span style={{ marginRight: '5px', width: '15px', height: '15px' }}>
                                <img src={QuestsIcon} alt="" />
                            </span>
                            Quests
                        </li>
                        <li className="p-4 border-b border-gray-600 flex items-center">
                            <span style={{ marginRight: '5px', width: '15px', height: '15px' }}>
                                <img src={SearchIcon} alt="" />
                            </span>
                            Search
                        </li>
                        <li className="p-4 border-b border-gray-600 flex items-center">
                            <span style={{ marginRight: '5px', width: '15px', height: '15px' }}>
                                <img src={BridgeIcon} alt="" />
                            </span>
                            Bridge
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar