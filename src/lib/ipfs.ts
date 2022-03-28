export const rewriteIpfsUrl = (url: string): string => {
  if (!url || url.startsWith("ipfs://") === false) {
    return url;
  }

  // Rewrites ipfs://abcde...xyz/1234.png -> https://ipfs.io/ipfs/abcde...xyz/1234.png
  let ipfsRegex = /ipfs:\/\/(.+)/;

  // @ts-ignore
  let [_, capture] = ipfsRegex.exec(url);
  let urlData: string = capture;

  return `https://ipfs.io/ipfs/${urlData}`;
};
