// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/USDCEscrow.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcToken = vm.envAddress("USDC_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);
        USDCEscrow escrow = new USDCEscrow(usdcToken);
        vm.stopBroadcast();

        console.log("USDCEscrow deployed at:", address(escrow));
    }
}
