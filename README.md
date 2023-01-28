# Polygon bor-receipt Checker

This script is used to check for the existence of Polygon bor-receipts in a specified range of blocks.
A bor-receipt is a special kind of receipt that is emitted when a validator confirms a block on the Polygon network.
These receipts are important because they are used to prove that a block has been confirmed by a validator, which is necessary for finality on the Polygon network.

The goal of this script is to make sure the RPC node contains all the bor-receipts that are expected to exist in a given a starting block number.

## Prerequisites
- Node.js
- npm
- web3.js
- semaphore-async-await

## Installation
1. Clone the repository
2. Run `npm install` to install the dependencies


## Usage

The script can be run with the following command:
    
    node script.js --url <JSON-RPC node URL> --startBlock <starting block number>


## Options
```
--version      Show version number                               [boolean]
-u, --url          HttpProvider URL                        [string] [required]
-c, --max-calls    Maximum concurrent calls             [number] [default: 10]
-s, --start-block  Start block number. Has to be a multiple of 64.
[number] [required]
--help         Show help                                         [boolean]
```
## Example

The following command checks for bor-receipts from block number 38598848, using a maximum of 10 concurrent calls to the JSON-RPC endpoint located at http://10.1.1.80:8765:
    
        node index.js --url http://10.1.1.80:8765 --max-calls 10 --start-block 38598848

## Output

The script outputs a list of block numbers that are missing bor-receipts. If the list is empty, then all bor-receipts are present.
