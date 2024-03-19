// Loading path module for operations with file paths.
const path = require('path');

// Ethers JS: Signers.
//////////////////////

// A Signer wraps all operations that interact with an account. An account
// generally has a private key located somewhere, which can be used to sign a
// variety of types of payloads.

// The private key may be located in memory (using a Wallet) or protected via
// some IPC layer, such as MetaMask which proxies interaction from a website to
// a browser plug-in, which keeps the private key out of the reach of the 
// website and only permits interaction after requesting permission from the
// user and receiving authorization.

// See: https://docs.ethers.org/v6/getting-started/

// Exercise 0. Load dependencies and network provider.
//////////////////////////////////////////////////////

// a. Require the `dotenv` and `ethers` packages.
// Hint: As you did in file 1_wallet and 2_provider.

// Your code here!
const pathToDotEnv = path.join(__dirname, ".", "..", ".env");
require('dotenv').config({path: pathToDotEnv});

const ethers = require('ethers');

// b. Create a Sepolia provider.
const providerKey = process.env.ALCHEMY_KEY;

const sepoliaUrl = `${process.env.ALCHEMY_SEPOLIA_API_URL}${providerKey}`;
const sepoliaProvider = new ethers.JsonRpcProvider(sepoliaUrl);

// Your code here!

// Exercise 1. Create a Signer.
///////////////////////////////

// Important! Do not use the private key of an account where actual money
// is held. Use only a test account. 

// Create with the Metamask private key saved in your .env file. No need to 
// connect to provider now.

// Verify that the address matches your Metamask address.

// Hint: a signer is a wallet.
// Hint2: if you get an error here, check that the private key begins with "0x".

// Your code here!
let signer = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY);
console.log(signer.address);

// Exercise 2. Sign something.
//////////////////////////////

const sign = async (message = 'Hello world') => {
    const signature = await signer.signMessage(message);
    
    const verifiedSigner = ethers.verifyMessage(message, signature);

    if (verifiedSigner === signer.address){
        console.log("Signature verified");
    }
    else {
        console.log("Signature not verified");
    }

    let anotherMessage = "Give me 5 ETH";

    const verifiedSigner2 = ethers.verifyMessage(anotherMessage, signature)

    if (verifiedSigner2 === signer.address) {
        console.log('Tampered signature is valid.');
    }
    else {
        console.log('Tampered signature is NOT valid.');
    }


};

sign();

// Exercise 3. Connect to the blockchain. 
/////////////////////////////////////////

// a. Connect the signer to the Sepolia network.
// signer is a wallet that's accessed using a private key.
// To interact with the blockchain, it needs to be connected to a provider using your alchemy key.
// Hint: .connect()

// b. Print the next nonce necessary to send a transaction.
// Hint: .getNonce()

const connect = async() => {
    
    signer = await signer.connect(sepoliaProvider);

    let nonce = await signer.getNonce();
    console.log('The nonce is', nonce);

};

connect();

// c. Replace the signer created above at exercise 1 with one that takes the 
// Sepolia provider as second parameter. This is necessary even
// if you connected inside the function connect() because there might be
// some issues with the asynchronicity of when the connection is established
// and the remaning of the exercises. If unclear, just check the solution :)

// Replace the signer created above.

// to create a wallet, we need a private key and a provider key. 
signer = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, sepoliaProvider);


// Exercise 4. Send a transaction.
//////////////////////////////////

// The time has come to send a transaction programmatically! 

// a. Send some Ether from one of your accounts to another one using the
// method `sendTransaction()`. Obtain the transaction id and check on Etherscan
// when the transaction get mined.
// Hint: `sendTransaction()` returns an object with info about the transaction.
// Hint2: The `value` field is specified in XX. You could use the utility
// function `parseEther()` to format the number accordingly.

// b. Instead of looking on Etherscan, wait for the transaction to be mined,
// then compare the balance of both addresses before and after.
// Hint: `sendTransaction()` returns an object with a `wait()` method.
// Hint2: `formatEther()` can print a nicer balance.

const account2 = process.env.METAMASK_2_ADDRESS;

const sendTransaction = async () => {
    // Your code here!
    let b1 = await sepoliaProvider.getBalance(signer.address);
    let b2 = await sepoliaProvider.getBalance(account2);
    b1 = ethers.formatEther(b1);
    b2 = ethers.formatEther(b2);

    tx = await signer.sendTransaction({
        to: account2,
        value: ethers.parseEther('0.01')
    });

    console.log(tx);

    console.log('Transaction is in the mempool...');
    // When we send a transaction in Ethereum, it's added to a pool of pending transactions.
    // The wait() method waits for the transaction to be mined.
    // It returns a Promise that resolves when the transaction is mined (included in the blockchain).
    await tx.wait();

    console.log('Transaction mined!');

    let updatedB1 = await sepoliaProvider.getBalance(signer.address);
    let updatedB2 = await sepoliaProvider.getBalance(account2);
    updatedB1 = ethers.formatEther(updatedB1);
    updatedB2 = ethers.formatEther(updatedB2);

    console.log('Balance for', signer.address, 'changed from', b1, 'to', updatedB1);
    console.log('Balance for', account2, 'changed from', b2, 'to', updatedB2);


};

sendTransaction();

