const { ethers } = require("hardhat");

async function main() {
    // const [deployer] = await ethers.getSigners();
    // console.log("Deploying contracts with the account:", deployer.address);
  
    // const DataConsumerV3 = await ethers.getContractFactory("DataConsumerV3");
    // const dataConsumerV3 = await DataConsumerV3.deploy();
  
    // console.log("DataConsumerV3 deployed to:", dataConsumerV3.address);
    const provider = new  ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Generate a wallet from a mnemonic or use an existing one
    const wallet = new ethers.Wallet('0x63b3cf628f7476f2fa1c0e89b9cf7a052fb29e18f7639424af515173cd3567e7',provider);
    // console.log("Deploying contracts with the account:", wallet.address);
    const abi=[
      {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
    ];
    const contract =new ethers.Contract('0x59256Bf07Df7Ac24d2Eff805023D62c54996CABa',abi,wallet);
   await contract.balanceOf('0xF3Ac9F0aD72059D1A3690102A16e328faad9bb9c')
   const balance=await provider.balanceOf('0xF3Ac9F0aD72059D1A3690102A16e328faad9bb9c')

    console.log(   balance
  )
    // const PKMToken = await ethers.getContractFactory("PKMToken",wallet);
    // const pKMToken = await PKMToken.deploy(100);

    // console.log("pKMToken deployed to:", pKMToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  