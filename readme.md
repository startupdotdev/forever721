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

- [ ] Top-level IPFS
- [x] Top-level base64 encoded json
- [ ] Top-level some random server
- [ ] Top-level JSON

Within each top-level data structure, handle:

- [ ] URLs with IPFS
- [ ] URLs not IPFS

## Development

```
$ npm i
$ npm test
```

## Questions

- Can we know if an IPFS item is pinned?

## Contributing

TODO
