// src/abis/index.js

import RouterABI from './Router.json';
import MyERC20ABI from './MyERC20.json';
import ERC20ABI from './ERC20.json';

import SwapFactoryABI from './SwapFactory.json';
import CloneFactoryABI from './CloneFactory.json';
import UniswapPairABI from './UniswapPair.json';
import LoanPoolABI from './LoanPool.json';
// 导入其他合约的 ABI

const ABIs = {
    Router: RouterABI,
    MyERC20: MyERC20ABI,
    SwapFactory:SwapFactoryABI,
    CloneFactory:CloneFactoryABI,
    UniswapPair:UniswapPairABI,
    ERC20:ERC20ABI,
    Pool:LoanPoolABI
    // 添加其他合约
};
const Address={
    Router: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    SwapFactory:'0x0165878A594ca255338adfa4d48449f69242Eb8F',
    CloneFactory:'0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    MyERC20:'0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
    Pool:'0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
}

export  {ABIs,Address};

