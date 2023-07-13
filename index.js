const express = require('express');
const Web3 = require('web3');
const body_parser = require('body-parser')
const ipfsAPI = require('ipfs-api');
// require('dotenv').config()

const contractAddress = '0x82495cD29DA3a2ccAC4ecaCEAeBeab1F881D6112'; // Enter your contract address here
const rpcEndpoint = 'http://127.0.0.1:7545';

const ipfs = ipfsAPI('192.168.43.238', '5001', {protocol: 'http'});
const UserContract = require('./build/contracts/User.json');

const app = express();
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint));
const contract = new web3.eth.Contract(UserContract.abi, contractAddress)

app.use(express.json());

async function getAUser(index) {
    // TODO: Implement the logic to fetch user details from the blockchain
  try {
    let username;
    let ipfsHash;
    let address;
  
    username = await contract.methods.getUsernameByIndex(index).call();
    console.log('username:', web3.utils.hexToString(username), index);
  
    ipfsHash = await contract.methods.getIpfsHashByIndex(index).call();
    console.log('ipfsHash:', web3.utils.hexToString(ipfsHash), index);
  
    let userJson = {};
  
    if (web3.utils.hexToString(ipfsHash) !== 'not-available') {
      const url = 'https://ipfs.io/ipfs/' + ipfsHash;
      console.log('getting user info from', url);
        
      const response = await fetch(url);
      userJson = await response.json(); 
      console.log('got user info from IPFS', userJson);
    }
        
    address = await contract.methods.getAddressByIndex(index).call();
    console.log('address:', address, index);
        
    return {
      username: username,
      title: userJson.title || '',
      intro: userJson.intro || '',
      address: address,
    }

    } catch (error) {
      console.log('error getting user #', index, ':', error);
      throw error;
    }  
}

async function getUsers() {
    // TODO: Implement the logic to fetch all users from the blockchain
  try {
    const userCount = await contract.methods.getUserCount().call();
    console.log(userCount)
    //const rowCount = Math.ceil(parseInt(userCount) / 4);
    const users = [];

    for (let i = 1; i < userCount; i++) {
      const user = await getAUser(i);
      console.log(user)
      users.push(user);
    }
console.log(`---------------------------------`)
    console.log(user)
console.log(`---------------------------------`)
    return users;
  } catch (error) {
    console.log('Error retrieving users:', error);
    throw error;
  }      
}

// Create a new user on the blockchain
async function createUser(req) {
    // TODO: Implement the logic to create a new user on the blockchain
    try {
      const username = web3.utils.stringToHex(req.username);
      const title = web3.utils.stringToHex(req.title);
      const intro = web3.utils.stringToHex(req.intro);
  
      console.log('creating user on IPFS for', username);
  
      const userJson = {
        username: username,
        title: title,
        intro: intro
      };

      const accounts = await web3.eth.getAccounts();
      const res = await ipfs.add([Buffer.from(JSON.stringify(userJson))]);
      const ipfsHash = res[0].hash;
  
      console.log('creating user on Ethereum for', username, title, intro, ipfsHash);
        
      const created = await contract.methods.createUser(username, web3.utils.stringToHex(ipfsHash) ).send({gas: 2000000, from: accounts[0]})
      console.log(created)
      return created

    } catch (error) {
      console.log('error creating user:', req.username, ':', error);
      throw error;
    }
}

app.get('/user/:index', async (req, res) => {
    try {
      const index = req.params.index;
      const user = await getAUser(index);
      res.json(user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetches all users from the blockchain
app.get('/users', async (req, res) => {
    try {
      const users = await getUsers();
      res.json(users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new user on the blockchain
app.post('/user', async (req, res) => {
    try {
      const { username, title, intro } = req.query;
      const newUser = await createUser({ username, title, intro });
      console.log(`${newUser} new user here`)
      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/', async (req, res) => {
  //const accounts = await web3.eth.getAccounts();
  //const hasUser = await contract.methods.createUser(web3.utils.asciiToHex("Francis"),'0xB481DCF288236618e63b68785E77377e0c04B35B').send({from:accounts[0], gasPrice: 307092004, gasLimit:200000})
  //const count = await contract.methods.getUserByIndex(web3.utils.numberToHex(2)).call()
  //res.json({count})

  const user = await contract.methods.getUsernameByIndex(0).call()
  res.json({user})

});


// async function getUserFromIPFS(ipfsHash) {
//     try {
//       const result = await ipfs.cat(ipfsHash);
//       const userJson = JSON.parse(result.toString());
  
//       console.log('User info fetched from IPFS:', userJson);
//       return userJson;
//     } catch (error) {
//       console.log('Error fetching user info from IPFS:', error);
//       throw error;
//     }
// }


// Start the Express server
app.listen(3000, async() => {
  console.log('API server listening on port 3000');
});