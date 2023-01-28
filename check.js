const Web3 = require('web3');
const yargs = require('yargs');
const Semaphore = require('semaphore-async-await').default;

const argv = yargs
    .option('url', {
        alias: 'u',
        describe: 'HttpProvider URL',
        type: 'string',
        demandOption: true
    })
    .option('max-calls', {
        alias: 'c',
        describe: 'Maximum concurrent calls',
        type: 'number',
        default: 10
    })
    .option('start-block', {
        alias: 's',
        describe: 'Start block number. Has to be a multiple of 64.',
        type: 'number',
        demandOption: true
    })
    .help()
    .argv;

const web3 = new Web3(new Web3.providers.HttpProvider(argv.url));
const semaphore = new Semaphore(argv['max-calls']);

async function checkTransaction(startBlockNumber) {
    let latestBlockNumber;
    try {
        latestBlockNumber = await web3.eth.getBlockNumber();
    } catch (err) {
        console.log(err);
    }
    for (let i = startBlockNumber; i <= latestBlockNumber; i += 64) {
        await semaphore.acquire();
        checkBlock(i).finally(() => semaphore.release());
    }
}

async function verifyTransaction(transactionHash, blockNumber) {
    let receipt;
    try {
        receipt = await web3.eth.getTransactionReceipt(transactionHash);
    } catch (err) {
        if (err.message.startsWith("Returned error: block has less receipts than expected: 0 <= 0")) {
            console.warn(`Warning: ${err.message}`);
        } else {
            throw err;
        }
    }

    if (!receipt) {
        console.error(`Error: Transaction not found in block ${blockNumber}.`);
        return;
    }
    // transaction receipt found, continue with other verification steps if necessary
}

async function checkBlock(blockNumber) {
    let block;
    block = await web3.eth.getBlock(blockNumber);
    if (!block) {
        return;
    }
    const uint64BlockNumber = web3.utils.padLeft(blockNumber.toString(16), 16, '0').slice(-16);
    // remove "0x" prefix from block.hash
    const blockHash = block.hash.slice(2);
    // calculate the hash
    const hash = web3.utils.keccak256(web3.utils.fromAscii("matic-bor-receipt-") + uint64BlockNumber + blockHash);
    for (const transaction of block.transactions) {
        if (transaction === hash) {
            //Transaction found
            await verifyTransaction(transaction, blockNumber);
        }
    }
}

checkTransaction(argv['start-block']).then();
