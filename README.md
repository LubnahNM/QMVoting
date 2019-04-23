#QMVoting Application

This application requires the installation of the following:
- NPM: https://nodejs.org
- Ganache: https://truffleframework.com/ganache
- Truffle: https://github.com/trufflesuite/truffle
- MetaMask: https://metamask.io/

# Step 1: Install the dependencies

- `$ cd QMVoting`
- `$ npm install `

# Step 2: Start Ganache
Download and install Ganache from the link provided above this will be your local blockchain instance

# Step 3: Compile and Deploy the QMVoting contract in your terminal

- `$ truffle migrate --reset`

# Step 4: MetaMask
- Install MetaMask onto your chrome browser
- You will need to create an account in MetaMask
- Connect the MetaMask to your local Ethereum block which is provided by Ganache. This will be done by selecting networks and add the http:\\localhost:7545.
- click Import account and paste in the private key  provided by ganache by copying the private key.

# Step 5 : Run the application

- `$ npm run dev`
