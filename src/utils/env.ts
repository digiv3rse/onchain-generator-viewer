import { generatorDeployments } from "../deployments/generator";
import { coreDeployments } from "../deployments/cores";
import { sepolia } from "viem/chains";
import { dependencyRegistryDeployments } from "../deployments/dependencyRegistries";

export const networkNameToChainMap = {
  sepolia: sepolia,
};

// @dev default to mainnet if network env var not populated
export const network =
  networkNameToChainMap[
    (import.meta.env.VITE_NETWORK || "sepolia") as "sepolia" | "sepolia"
  ];

export const generatorAddress = generatorDeployments[network.id];
export const dependencyRegistryAddress =
  dependencyRegistryDeployments[network.id];
export const networkCoreDeployments = coreDeployments[network.id];
