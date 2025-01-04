import { Hex } from "viem";

export type CoreDeployment = {
  label ? : string;
  address: Hex;
  version ? : 0 | 1 | 3;
  startingProjectId ? : number;
};

export const coreDeployments: {
  [key: string]: CoreDeployment[];
} = {
  "1": [
    {
      label: "Art Blocks Flagship: V0",
      address: "0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a",
      version: 0,
      startingProjectId: 0,
    },
    {
      label: "Art Blocks Flagship: V1",
      address: "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270",
      version: 1,
      startingProjectId: 3,
    },
    {
      label: "Art Blocks Flagship: V3",
      address: "0x99a9B7c1116f9ceEB1652de04d5969CcE509B069",
      version: 3,
      startingProjectId: 374,
    },
    {
      label: "Art Blocks Curated: V3.2",
      address: "0xAB0000000000aa06f89B268D604a9c1C41524Ac6",
      version: 3,
      startingProjectId: 495,
    },
  ],
  "11155111": [
    {
      label: "DiGi Art Flagship v3",
      address: "0x151B912f2c7c1CB9CEc9d4e86cd1c2F7f2ECF77b",
      version: 3,
      startingProjectId: 0,
    },
    {
      label: "DiGi Art Flagship v3",
      address: "0xCe25B22f5a55982fe5551267AD48bbCeF3cAbDcF",
      version: 3,
      startingProjectId: 0,
    },
    {
      label: "DiGi Art Flagship v3",
      address: "0xcF624B26d58bbBB96b5BE871938fA77c98Bacf4A",
      version: 3,
      startingProjectId: 0,
    },
    {
      label: "DiGi Art Flagship v3",
      address: "0xc9181e6FC8A7Cfe16a296ec59c53B0B131597F0a",
      version: 3,
      startingProjectId: 0,
    },
  ],
};
