
// Loading path module for operations with file paths.
const path = require('path');

// Ethers JS: Providers.
////////////////////////

// A Provider is a read-only connection to the blockchain, which allows
// querying the blockchain state, such as accout, block or transaction
// details, querying event logs or evaluating read-only code using call.

// See: https://docs.ethers.org/v6/getting-started/

// Exercise 0. Require the `dotenv` and `ethers` package.
/////////////////////////////////////////////////////////

// Hint: As you did in file 1_wallet.
pathToDotEnv = path.join(__dirname, '.', '..', '.env');
require('dotenv').config({path: pathToDotEnv})
const ethers = require("ethers");
// console.log(pathToDotEnv);
// Your code here!


// Exercise 1. Connect to Mainnet (a.k.a welcome async!).
/////////////////////////////////////////////////////////

// Whenever you interact with a blockchain you are in the "async" domain. 

// In JavaScript, you generally use "promises" to handle asynchronous   
// code execution. There are two ways of working with promises:
//
// 1. .then() notation (standard Promises)
// 2. async/await pattern (newer notation)
//
// Important! You can use promises anywhere in your code, but you can use 
// "await" only inside an "async" function. This makes things a bit more
// complicated, but not too much.
// 
// If this is new to you, you can read more about these here:
// https://javascript.info/async

// You can also check the 2_JS_Async folder for exercises on asynchronous 
// code in JavaScript.

// a. Create a JSON RPC provider and connect to the Ethereum Mainnet.  

// Hint: check EthersJS docs for the method `JsonRpcProvider` and what 
// parameters it needs (nested hint: you need something from the .env file).


// Your code here!
const providerKey = process.env.ALCHEMY_KEY;

const mainnetUrl = `${process.env.ALCHEMY_MAINNET_API_URL}${providerKey}`
const mainnetProvider = new ethers.JsonRpcProvider(mainnetUrl);

// console.log(mainnetUrl)


// b. Verify that the network's name is "mainnet" and the chain id is 1.


// Hint: `getNetwork()`.

// Hint2: the value of chain id returned by Ethers JS is of type "BigInt". 
// As the name suggests, that is a very a data type capable of holding very
// large (integer) numbers. Remember to cast it to Number for a nicer display.
// https://javascript.info/bigint 

// b1. Use the async/await pattern to do the job.
const network = async () => {
    let net = await mainnetProvider.getNetwork();
    console.log('Async/Await!');
    console.log('Provider\'s network name: ', net.name);
    console.log('Provider\'s network chain id: ', Number(net.chainId));
}

network();

// The second (less compact) notation has the advantage that we can invoke
// the code only when needed, so it is preferred in this exercise sheet.

// b2. Bonus. Re-write the code above using the promise standard notation.

// Promises.

// we save the network details that we get/await into net
mainnetProvider.getNetwork().then(net => {
    console.log('Promise!');
    console.log('Provider\'s network name: ', net.name);
    console.log('Provider\'s network chain id: ', Number(net.chainId));
})

// Checkpoint. We use `return` to terminate the execution insted
// of process.exit(). Why?
// because it's not a function that we call. 
// return;



// Exercise 2. Block Number.
////////////////////////////

// a. Get the latest block number from the Ethereum mainnet. Then compare it
// with the value displayed on Etherscan.io.

// // Look up the current block number
const blockNum = async () => {
    let blockNumber = await mainnetProvider.getBlockNumber();
    console.log('Mainnet block number: ', blockNumber);
};

// blockNum();

// b. The Ethereum mainnet is one of the most secure blockchains in the world.
// The testnets of Ethereum are a bit less secure because they might have 
// experimental features, but also because they are replaced often and so
// they have a shorter chain. How shorter?

// Connect to the Goerli test net, get the latest block number and print
// the difference in chain length with mainnet.

const sepoliaUrl = `${process.env.ALCHEMY_SEPOLIA_API_URL}${providerKey}`;
const sepoliaProvider = new ethers.JsonRpcProvider(sepoliaUrl);

// Look up the current block number in Mainnet and Goerli.
const blockDiff = async () => {
    let blockNumberM = await mainnetProvider.getBlockNumber();
    console.log('Mainnet block number: ', blockNumberM);

    let blockNumberS = await sepoliaProvider.getBlockNumber();
    console.log('Sepolia block number: ', blockNumberS);

    console.log('Mainnet is '+ (blockNumberM - blockNumberS) + ' blocks ahead');
};

// blockDiff();


// Exercise 3. Block time.
//////////////////////////

// How long does it take to get a new block?

// a. Here is an elaborate solution to measure the time passed between
// two blocks. Review the function below, in particular:

// - the ternary operator,
// - the built-in Date object,
// - the setInterval and clearInterval functions

// Run the function once for Mainnet and once for Goerli. Do you get similar
// results?

// Asynchronous functions with pre-defined input parameters.
const checkBlockTime = async (providerName = "mainnet", blocks2check = 3) => {

    // JS Ternary Operator.
    // What is a JS Ternary Operator? 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    // It is a short way to write an if-else statement.
    // condition ? expressionIfTrue : expressionIfFalse

    let provider = providerName.toLowerCase() === "mainnet" ? 
        mainnetProvider : goerliProvider;

    // Get initial block number and timestamp.
    let d = Date.now();
    let blockNumber = await provider.getBlockNumber();
    console.log(providerName, 'Current Block num:', blockNumber);

    // Keep track of how many blocks to check.
    let blocksChecked = 0;

    // Poll the blockchain every second to check for a new block number.
    let myInterval = setInterval(async () => {

        let newBlockNumber = await provider.getBlockNumber();
        
        // Compare block numbers.
        if (newBlockNumber !== blockNumber) {
            // Check time.
            let d2 = Date.now();
            let timeDiff = d2 - d;
            console.log(providerName, "New Block num:", newBlockNumber);
            console.log(providerName, "It took: ", timeDiff);
            
            // Update loop variables.
            d = d2;
            if (++blocksChecked >= blocks2check) {
                clearInterval(myInterval);
            }
            blockNumber = newBlockNumber;
        }

    }, 1000);
    
};

// checkBlockTime("Mainnet");

// checkBlockTime("Goerli");

// b. Bonus. The checkBlockTime function can be rewritten more efficiently 
// using the Observer pattern offer by EtherS JS and listening to the 
// "block" event. See:
// https://docs.ethers.org/v5/api/providers/provider/#Provider--event-methods

// Do it! 
// Hint: setInterval/clearInterval are replaced by on/off calls.

const checkBlockTime2 = async (providerName = "mainnet", blocks2check = 3) => {

    // Your code here!
    let provider = providerName.toLowerCase() === "mainnet" ? 
    mainnetProvider : goerliProvider;

    let d = Date.now();
    let blocksChecked = 0;

    provider.on('block', newBlockNumber =>{
        let d2 = Date.now();
        let timeDiff = d2 - d;
        console.log(providerName, "New Block num:", newBlockNumber);
        console.log(providerName, "It took: ", timeDiff)
    })

    d = d2;

    if(++blocksChecked >= blocks2check){
        provider.off('block');
    }

};

// checkBlockTime2("mainnet");

// return;

// c. Now that you know the answer, you can check the 
// "Ethereum Average Block Time Chart": https://etherscan.io/chart/blocktime


// Exercise 4. Block info.
//////////////////////////

// a. Look up the last block in Mainnet and print it to console.
// Hint: first get the last block number, and then use .getBlock(blockNumber).

// b. How many transactions does the block contains?

// c. Pick a transaction and examine its receipt.
// Hint: use getTransactionReceipt().

// d. Transactions can be prefetched, so that you save one blockchain call.
// Hint: pass `true` as second parameter to .getBlock(blockNumber, true).


// get blocknumber
// get block through block number
// get transaction hash through block indexing
// get transaction receipt through transaction hash

const blockInfo = async () => {
    
    // Your code here!
    let blockNumber = await mainnetProvider.getBlockNumber();
    let block = await mainnetProvider.getBlock(blockNumber);
    // console.log(block);

    let tx = block.getTransaction(0);
    // console.log(tx);
    let txHash = block.transactions[0];
    console.log(txHash);

    let txReceipt = await mainnetProvider.getTransactionReceipt(txHash);
    console.log(txReceipt);
    console.log('A transaction from', txReceipt.to, 'to', txReceipt.from);

    // Long list...
    block = await mainnetProvider.getBlock(blockNumber, true);
    // console.log(block.prefetchedTransactions);


};

// blockInfo();

// Exercise 5. ENS names.
//////////////////////////

// Resolve the name 'unima.eth' on the Goerli network, then lookup the
// address.

const ens = async () => {
    
    // Your code here!
    // Name is a human-readable name for an Ethereum address which is a hexadecimal string.
    // The address is derived from the public key, but it's not the same thing. (like a nickname)
    // It takes a public key, hashes it, and truncates it to 20 bytes to form the address.
    let unimaAddress = await sepoliaProvider.resolveName('unima.eth');
    console.log(unimaAddress);

    let ensName = await sepoliaProvider.lookupAddress(unimaAddress);
    console.log(ensName);

};

ens();


// Exercise 6. Get ETH balance.
///////////////////////////////

// a. Ask for the Ether balance of "unima.eth". 
// Hint: remember to be on the Goerli net.

// b. Format the balance nicely with the formatEther utility.

// c. Compare the ETH balance for the ENS name "unima.eth" and the balance
// its address (after resolving it). Are they the same?

// d. Bonus. What is the balance for the address of Vitalik Buterin, the 
// creator of Ethereum? 
// Hint: try vitalik.eth

const balance = async (ensName = "unima.eth") => {

    let balance = await sepoliaProvider.getBalance(ensName);
    console.log('Balance of', ensName, 'is', ethers.formatEther(balance), 'ETH');

    let address = await sepoliaProvider.resolveName(ensName);
    let addressBalance = await sepoliaProvider.getBalance(address);
    console.log('Balance of', address, 'is', ethers.formatEther(addressBalance), 'ETH');
};

// balance();


// balance("vitalik.eth");


// Exercise 7. Get ERC20 Balance.
/////////////////////////////////

// To get the balance of ERC20 tokens the procedure is a bit more complex.
// ETH is the native currency of Ethereum, so it's "simply there". Instead,
// ERC20 tokens are added to Ethereum via smart contracts. So, we need to 
// interact with the smart contract of the specific token we want to know
// the balance of.

// First, we need to know the address of the smart contract. We can use the 
// LINK contract.
const linkAddress = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb';

// At the address, there is only bytecode. So we need to tell Ethers JS, what
// methods can be invoked. To do so, we pass the Application Binary Interface
// (ABI) of the contract, available at Etherscan. For your convenience, 
// the LINK ABI is stored in this directory, under "link_abi.json";

const linkABI = require('./link_abi.json');
const { pathToFileURL } = require('url');


// Now your task. Get the balance for LINK for "unima.eth" and "vitalik.eth".
// Hint: you need first to create a Contract object via `ethers.Contract`, 
// then invoke the appropriate smart contract method.
// Hint2: want to try it with your own address? Get some LINK ERC20 tokens here: 
// https://faucets.chain.link/goerli


// contract needs address of smart contract, linkABI & provider

const link = async () => {
   
    // Your code here!
    let linkContract = new ethers.Contract(linkAddress, linkABI, sepoliaProvider);

    let linkBalance = await linkContract.balanceOf('0xFe44A03b5de0852c3647ec788e06377aB76512b4');
    console.log(ethers.utils.formatEther(linkBalance))

    // let linkContract = new ethers.Contract(linkAddress, linkABI, mainnetProvider);
    // let linkBalance = await linkContract.balanceOf("unima.eth");
    // console.log(ethers.utils.formatEther(linkBalance))

    
};


link();