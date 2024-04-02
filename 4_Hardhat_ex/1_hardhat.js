// Hardhat: First interaction with Hardhat blockchain.
//////////////////////////////////////////////////////

// Exercise 0. Load dependencies and network provider.
//////////////////////////////////////////////////////

// a. Require the `dotenv` and `ethers` packages.
// Hint: As you did multiple times now.

// Your code here!
const path = require('path');
let pathToDotEnv = path.join(__dirname, '.', '..', '.env');
require('dotenv').config()

const ethers = require('ethers');

// Exercise 1. Create a JSON RPC Provider for the Hardhat blockchain.
/////////////////////////////////////////////////////////////////////

// Hint: you will find the info printed to console after you start the hardhat
// blockchain.

// Your code here!
const hardhatProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');


// Exercise 2. Let's query the provider.
////////////////////////////////////////

// Hardhat Blockchain si too long. Let's call it NUMA.
// Print to console the network name, chain id, and block number of NUMA.

const networkInfo = async () => {
   
    // Your code here!
    const network = await hardhatProvider.getNetwork();
    console.log('Network:', network.name);
    console.log('Chain ID:', network.chainId);
    console.log('Block number:', await hardhatProvider.getBlockNumber()); 
};

// networkInfo();



// Exercise 3. Signer on the Hardhat blockchain.
////////////////////////////////////////////////

// a. Connect one a signer with one of the default private keys on
// the Hardhat blockchain.
// Hint: check the Hardhat console output.

// Your code here.
let signer = new ethers.Wallet('0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e', hardhatProvider);



console.log('Signer:', signer.getAddress());
// b. Check the balance of the signer.

const checkBalance = async () => {
    // Your code here.
    const balance = await hardhatProvider.getBalance((await signer).getAddress());
    console.log('Balance:', ethers.formatEther(balance));
};

// checkBalance();

// c. Print the signer's next nonce necessary to send a transaction.
// Hint: .getNonce()

const getNonce = async() => {
    let nonce = await signer.getNonce();
    console.log('Nonce:', nonce);
};

getNonce();


// Exercise 4. Send a transaction.
//////////////////////////////////

// Send some Ether from the address of the signer in Exercise 3 to one of your
// accounts on Metamask (e.g., the one used to make the submissions in 
// this course).
const account = process.env.METAMASK_ACCOUNT_1;

const sendTransaction = async () => {

    const hardhatSigner = signer;

    let b1 = await hardhatProvider.getBalance(hardhatSigner.address);
    let b2 = await hardhatProvider.getBalance(account);
    b1 = ethers.formatEther(b1);
    b2 = ethers.formatEther(b2);


    tx = await hardhatSigner.sendTransaction({
        to: account,
        value: ethers.parseEther("0.01")
    });


    console.log("Transaction in mempool");
    await tx.wait();

    console.log("Transaction mined");

    let updatedB1 = await hardhatProvider.getBalance(signer.address);
        let updatedB2 = await hardhatProvider.getBalance(account);
        updatedB1 = ethers.formatEther(updatedB1);
        updatedB2 = ethers.formatEther(updatedB2);

        console.log('Balance for', signer.address, 'changed from', b1, 'to', updatedB1);
        console.log('Balance for', account, 'changed from', b2, 'to', updatedB2);

};

sendTransaction();

