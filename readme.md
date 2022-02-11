# Forever721

Tool to analyze NFT metadata.

## Why this tool?

While the NFTs themselves may be permanently stored on the blockchain, there are many cases where NFT metadata content can change. 

For example: some NFTs' metadata point to random private HTTP URLs and servers which could change the contents or go down at any time. Other NFTs point to IPFS URLs, which is much better but there is still risk of that content becoming unpinned and being discarded from IPFS as well.

This tool analyzes NFT metadata and gives a letter grade (A-F) to its durability as well as the reasons for that grade.

## Usage

### Basic Usage

```js
import { analyzeMetadata } from 'forever721`;
let metaData : JSON | ipfs url | url;

analyzeMetadata(metaData);
```

Handled metadata structures:

- [x] Top-level IPFS
- [x] Top-level base64 encoded json
- [x] Top-level some random server
- [ ] Top-level JSON

Within each top-level data structure, handles:

- Base64 on-chain

- IPFS

  - [x] Image stored on another IPFS
  - [x] Image stored on rando server

- Http

  - [x] Image stored on IPFS
  - [x] Image stored on HTTP

## Development

```
$ npm i
$ npm test
```

## Questions

- Can we know if an IPFS item is pinned?

## Future development

Some extra edge cases to handle:

- IPFS top-level metadtaa

  - [ ] Image stored on that IPFS hash

- Http top-level metadata

  - [ ] Image stored as base64

- JSON top-level metadata
  - [ ] Image stored as base64
  - [ ] Image stored on IPFS
  - [ ] Image stored on HTTP

## Contributing

TODO
