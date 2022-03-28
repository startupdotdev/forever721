export const isUriBase64Json = (tokenUri: string): boolean => {
  return tokenUri.startsWith("data:application/json;base64");
};

export const isUriIpfs = (tokenUri: string): boolean => {
  return tokenUri.startsWith("ipfs") || tokenUri.includes("ipfs.io/ipfs");
};

const ipfsPinningServices = [
  "mypinata.cloud",
  "eternum.io",
  "crust.network",
  "infura.io",
  "estuary.tech",
  "web3.storage",
  "nft.storage",
];

export const isUriIpfsPinningService = (tokenUri: string): boolean => {
  for (let service of ipfsPinningServices) {
    if (tokenUri.includes(service)) {
      return true;
    }
  }

  return false;
};

export const isUriHttp = (tokenUri: string): boolean => {
  return tokenUri.startsWith("http");
};
