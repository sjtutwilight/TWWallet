const { ethers } = require("hardhat");

async function main() {
  // 获取最新区块
  const block = await ethers.provider.getBlock("latest");
  
  // 打印区块的 timestamp
  console.log("Block Timestamp:", block.timestamp);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});