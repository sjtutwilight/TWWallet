// scripts/transfer.js
const { ethers } = require("hardhat");
//const { ethers } = require('ethers');

async function main() {
    // Connect to the Hardhat local network
    const provider = new  ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Generate a wallet from a mnemonic or use an existing one
    const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',provider);
    
    // Connect the wallet to the provider

    // The recipient address (replace with the desired address)
    const recipient = "0xF3Ac9F0aD72059D1A3690102A16e328faad9bb9c"; // Replace with your recipient address

    // Amount to send (in wei)
    const amount = ethers.parseEther("100"); // 1 ETH

    // Create the transaction
    const tx = {
        to: recipient,
        value: amount,
    };

    // Send the transaction
    const transaction = await wallet.sendTransaction(tx);

    console.log(`Transaction hash: ${transaction.hash}`);

    // Wait for the transaction to be mined
    const receipt = await transaction.wait();
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}
//async function aaa() {
    // server/server.js


// Listen to Ethereum blocks and send transactions to Kafka
// const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
// console.log(provider);

// provider.on('block', async (blockNumber) => {

//     const block = await provider.getBlockWithTransactions(blockNumber);
//     block.transactions.forEach((tx) => {
//         const transaction = {
//             txHash: tx.hash,
//             from: tx.from,
//             to: tx.to,
//             value: ethers.utils.formatEther(tx.value),
//             blockNumber: tx.blockNumber,
//             timestamp: block.timestamp,
//         };
//         console.log(tx);
//     });
// });

//}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
