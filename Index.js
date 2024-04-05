const contractAddress = '0x29aB41469Ec4CeD62d62574Aa3C312ed7B921605';
const contractABI = [
    {
        "inputs": [],
        "name": "getVotedCandidates",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "candidate",
                "type": "string"
            }
        ],
        "name": "getVotesForCandidate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "candidate",
                "type": "string"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "votedCandidates",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "votes",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(contractABI, contractAddress);


window.addEventListener('load', async () => {
    // Attach event listener to the voting form
    document.getElementById('votingForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const candidateName = document.getElementById('candidateName').value;
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            await contract.methods.vote(candidateName).send({ from: accounts[0] });
            console.log('Vote successful');
            // After voting, update the displayed candidates
            displayCandidates();
        } catch (error) {
            console.error('Error while voting:', error);
        }
    });
        const votedCandidates = await contract.methods.getVotedCandidates().call();
        console.log('Voted candidates:', votedCandidates);

    // Call the displayCandidates function when the page loads
    displayCandidates();
});

async function displayCandidates() {
    try {
        // Clear the existing candidates list
        const candidatesElement = document.getElementById('candidates');
        candidatesElement.innerHTML = '';

        // Get the total number of candidates from the smart contract
        const totalCandidates = await contract.methods.totalCandidates().call();

        // Loop through each candidate and retrieve their information
        for (let i = 1; i <= totalCandidates; i++) {
            const candidate = await contract.methods.candidates(i).call();
            // candidate structure should include candidate's name and vote count
            const candidateName = candidate.name;
            const voteCount = candidate.voteCount;

            // Only display candidates who have received votes
            if (voteCount > 0) {
                // Create HTML elements to display the candidate information
                const candidateDiv = document.createElement('div');
                candidateDiv.classList.add('candidate');
                candidateDiv.innerHTML = `
                    <div>Name: ${candidateName}</div>
                    <div>Votes: ${voteCount}</div>
                `;

                // Append the candidate information to the candidatesElement
                candidatesElement.appendChild(candidateDiv);
            }
        }
    } catch (error) {
        console.error('Error while retrieving candidates:', error);
    }
}
