import { ethers } from "./libs/ethers-5.1.esm.min.js";

window.provider = window.passport.connectEvm();

const connectPassport = async function(){
    window.accounts = await window.provider.request({ method: "eth_requestAccounts" });
    console.log(window.accounts)
    if (window.accounts){
        getUserInfo();
    }
}

const config = {
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX,
  }),
};

const client = new window.immutable.blockchainData.BlockchainData(config);

const getUserInfo = async function(){
    window.userProfile = await window.passport.getUserInfo();
}

const passportLogout = async function(){
    let logout = await window.passport.logout();
    console.log(logout, "logout");
    window.userProfile = {};
}

// Insert Contract Address
const CONTRACT_ADDRESS = '0xEF0D2628F2377Bb09b0868D3863EF2EE32A41849';
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mintTypeOne",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "mintTypeTwo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function getData(tokenId) {
  try {
    const response = await client.getNFT({
      chainName: 'imtbl-zkevm-testnet',
      contractAddress: CONTRACT_ADDRESS,
      tokenId: tokenId,
    });
    console.log(response.result);
    let nft = document.getElementById("nft");
    nft.innerHTML = `
    <div class="alert alert-success"> Great Score! Claim this NFT, then resume the game.</div>
    <div class="card" >
    <div class="card-body">
      <div class="media">
        <img src='${response.result.image}' class="mr-3 img-thumbnail" alt="nft" style="width: 30%;">
        <div class="media-body">
          <h5 class="card-title">${response.result.name}</h5>
          <p class="card-text">'${response.result.description}'</p>    
        </div>
      </div>
    </div>
    <div class="card-body">
      <button id="claim-btn" class="btn btn-success"> Claim</button>
    </div>
  </div>
    `;
    const claimBtn = this.document.getElementById('claim-btn');
    claimBtn.onclick = async function(){
      if (tokenId === '1') {
        await mintFirstNft();
      } else if (tokenId === '2') {
        await mintSecondNft();
      }
    }
    return response.result;
  } catch (error) {
    console.error(error);
    alert(error)
  }
}

window.getData = getData;

// Mint NFTs
const mintFirstNft = async function () {
  if (window?.provider) {
      const provider = new ethers.providers.Web3Provider(window.provider);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress(); // User's address to mint NFT to

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      try {
          const tx = await contract.mintTypeOne(userAddress);
          const receipt = await tx.wait();
          console.log('First NFT minted successfully!', receipt);
          let nft = document.getElementById("nft");
          nft.innerHTML += `
            <div class="alert alert-success"> 
              NFT minted successfully! Transaction hash: ${receipt.transactionHash}
            </div>`;
      } catch (error) {
          console.error('Error minting the first NFT:', error);
      }
  } else {
      console.log("No provider found.");
  }
};

const mintSecondNft = async function () {
  if (window?.provider) {
      const provider = new ethers.providers.Web3Provider(window.provider);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress(); // User's address to mint NFT to

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      try {
          const tx = await contract.mintTypeTwo(userAddress);
          const receipt = await tx.wait();
          console.log('Second NFT minted successfully!', receipt);
          let nft = document.getElementById("nft");
      nft.innerHTML += `
        <div class="alert alert-success"> 
          NFT minted successfully! Transaction hash: ${receipt.transactionHash}
        </div>`;

        // upgrade ship
        const upgradeEvent = new CustomEvent('upgradeSpaceship', { detail: { transactionHash: receipt.transactionHash } });
        window.dispatchEvent(upgradeEvent);
      } catch (error) {
          console.error('Error minting the second NFT:', error);
      }
  } else {
      console.log("No provider found.");
  }
};

window.addEventListener('load', function() {
    const passportBtn = this.document.getElementById('btn-passport');
    const logoutBtn = this.document.getElementById('btn-logout');
    
    passportBtn.onclick = function(){
       window.isconnecting = true;
       connectPassport();
    }

    logoutBtn.onclick = passportLogout;
    window.passport.loginCallback();
});

/*// Retrieve NFT list
async function fetchUserNFTs() {
  try {
      const chainName = 'imtbl-zkevm-testnet';
      const provider = new ethers.providers.Web3Provider(window.provider);
      const userAddress = await provider.getSigner().getAddress(); // Fetch the current user's address

      // Use the Immutable SDK client to list NFTs by account address
      const response = await client.listNFTsByAccountAddress({ chainName, userAddress, CONTRACT_ADDRESS });

      const nfts = response.result;
      return nfts; // Return the NFTs for further processing
  } catch (error) {
      console.error('Error fetching user NFTs:', error);
      return []; // Return an empty array in case of an error
  }
}

async function checkForLevel2Badge() {
  try {
      const nfts = await fetchUserNFTs();

      // Look for an NFT with the name "Level 2 Badge" in the user's collection. But this only works after the API service indexes the NFT
      //const level2Badge = nfts.find(nft => nft.name === "Level 2 Badge");

      if (level2Badge) {
          console.log('Level 2 Badge NFT found:', level2Badge);
          const event = new CustomEvent('onLevel2BadgeFound', { detail: level2Badge });
          window.dispatchEvent(event);
      } else {
          console.log('Level 2 Badge NFT not found in the user collection.');
      }
  } catch (error) {
      console.error('Error checking for Level 2 Badge NFT:', error);
  }
} */

/* const mintNFTWithBackoff = async (userAddress, contract) => {
  const maxRetries = 3;
  const baseDelay = 1000; // Delay in milliseconds
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      console.log("Minting in progress");
      const tx = await contract.mintTypeTwo(userAddress);
      const receipt = await tx.wait();
      console.log('Second NFT minted successfully!', receipt);

      let nft = document.getElementById("nft");
      nft.innerHTML += `
        <div class="alert alert-success"> 
          NFT minted successfully! Transaction hash: ${receipt.transactionHash}
        </div>`;

      // Dispatch the upgrade event
      const upgradeEvent = new CustomEvent('upgradeSpaceship', { detail: { transactionHash: receipt.transactionHash } });
      window.dispatchEvent(upgradeEvent);

      return receipt; // Exit the loop on success
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      attempt++;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Waiting for ${delay}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Throw error after last attempt
      }
    }
  }
};

const mintSecondNft = async () => {
  if (window?.provider) {
    const provider = new ethers.providers.Web3Provider(window.provider);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      await mintNFTWithBackoff(userAddress, contract);
    } catch (error) {
      console.error('All minting attempts failed:', error);
    }
  } else {
    console.log("No provider found.");
  }
}; */