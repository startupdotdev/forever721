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

Within each top-level data structure, handle:

- [ ] IPFS

  - Image stored on that IPFS hash
  - Image stored on anohter IPFS
  - Image stored on rando server

- [ ] Http

  - Image stored as base64
  - Image stored on IPFS
  - Image stored on HTTP

- [ ] JSON
  - Image stored as base64
  - Image stored on IPFS
  - Image stored on HTTP

## Development

```
$ npm i
$ npm test
```

## Questions

- Can we know if an IPFS item is pinned?

## Contributing

TODO
