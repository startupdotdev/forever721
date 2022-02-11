# Forever721

Tools to analyze NFTs metadata.

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
