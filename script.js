document.addEventListener("DOMContentLoaded", function () {
    const { ethers } = window;

    // Connect to Linea's JSON-RPC Provider (replace with correct Linea endpoint)
    const provider = new ethers.providers.JsonRpcProvider("https://linea-mainnet.infura.io/v3/d031fe0b40f4444aa49170fac2555011");

    const tokenABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function pause() view returns (bool)", // Check for pause functionality
        "function unpause() view returns (bool)", // Check for unpause functionality
        "function mint(address to, uint256 amount) public", // Check for minting functionality
        "function burn(address from, uint256 amount) public", // Check for burning functionality
        "function isPaused() view returns (bool)", // Check if transfers are paused
        "function isBlacklisted(address account) view returns (bool)", // Check blacklisting function
        "function transfer(address recipient, uint256 amount) public returns (bool)", // Transfer function
        "function owner() view returns (address)", // Owner function to check ownership
        "function admin() view returns (address)", // Admin function to check if admin is defined
        "function onlyOwner() public", // Check for owner-only function
        "function onlyAdmin() public" // Check for admin-only function
    ];

    async function checkToken(tokenAddress) {
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = ""; // Clear previous results

        try {
            // Verify contract existence
            resultDiv.innerHTML += `<p>Checking contract existence...</p>`;
            const code = await provider.getCode(tokenAddress);
            if (code === "0x") {
                throw new Error("Contract not found at the given address.");
            }
            resultDiv.innerHTML += `<p>Contract found at the provided address.</p>`;

            // Retrieve token details
            resultDiv.innerHTML += `<p>Fetching token details (name, symbol, and total supply)...</p>`;
            const [name, symbol, totalSupplyRaw] = await Promise.all([
                tokenContract.name(),
                tokenContract.symbol(),
                tokenContract.totalSupply()
            ]);
            const totalSupply = ethers.utils.formatUnits(totalSupplyRaw, 18);
            resultDiv.innerHTML += `<p>Name: ${name}</p>`;
            resultDiv.innerHTML += `<p>Symbol: ${symbol}</p>`;
            resultDiv.innerHTML += `<p>Total Supply: ${totalSupply}</p>`;

            // Advanced Minting, Burning, and Pausing Checks
            resultDiv.innerHTML += `<p>Checking for admin controls (minting, burning, pausing)...</p>`;

            let adminControlMsg = "";
            try {
                // Check if minting is allowed
                const mintingAllowed = await tokenContract.mint(address, ethers.utils.parseUnits('1', 18));
                if (mintingAllowed) adminControlMsg += "Minting function exists. Potential rug pull risk.<br>";
            } catch (e) {}

            try {
                // Check if burning is allowed
                const burningAllowed = await tokenContract.burn(address, ethers.utils.parseUnits('1', 18));
                if (burningAllowed) adminControlMsg += "Burning function exists. Potential rug pull risk.<br>";
            } catch (e) {}

            try {
                // Check if the contract can be paused or unpaused
                const paused = await tokenContract.isPaused();
                if (paused) adminControlMsg += "Contract is paused. This could indicate control over the token.<br>";
            } catch (e) {}

            // Print any risks found with admin controls
            if (adminControlMsg) {
                resultDiv.innerHTML += `<p class="warning">${adminControlMsg}</p>`;
            } else {
                resultDiv.innerHTML += `<p>No minting, burning, or pausing functions detected. This is safer.</p>`;
            }

            // Advanced Transfer Restrictions and Blacklisting Checks
            resultDiv.innerHTML += `<p>Checking for transfer restrictions...</p>`;

            let transferRestrictionMsg = "";
            try {
                // Check for blacklisting functionality
                const isBlacklisted = await tokenContract.isBlacklisted(address);
                if (isBlacklisted) transferRestrictionMsg += "Blacklist function detected. This token may have restrictions on transfers.<br>";
            } catch (e) {}

            try {
                // Check if transfers are paused
                const isPaused = await tokenContract.isPaused();
                if (isPaused) transferRestrictionMsg += "Token transfers are paused. This is a potential risk.<br>";
            } catch (e) {}

            // Print any risks found with transfer restrictions
            if (transferRestrictionMsg) {
                resultDiv.innerHTML += `<p class="warning">${transferRestrictionMsg}</p>`;
            } else {
                resultDiv.innerHTML += `<p>No transfer restrictions or blacklisting detected. This token seems safer.</p>`;
            }

            // Check for owner/admin-related access control patterns
            resultDiv.innerHTML += `<p>Checking for access control patterns (e.g., onlyOwner, onlyAdmin)...</p>`;

            let accessControlMsg = "";
            try {
                const owner = await tokenContract.owner();
                if (owner) accessControlMsg += `Owner function detected. Token may have an owner with special privileges.<br>`;
            } catch (e) {}

            try {
                const admin = await tokenContract.admin();
                if (admin) accessControlMsg += `Admin function detected. Token may have an admin with special privileges.<br>`;
            } catch (e) {}

            try {
                const onlyOwner = await tokenContract.onlyOwner();
                if (onlyOwner) accessControlMsg += `"onlyOwner" function detected. This could indicate centralized control.<br>`;
            } catch (e) {}

            try {
                const onlyAdmin = await tokenContract.onlyAdmin();
                if (onlyAdmin) accessControlMsg += `"onlyAdmin" function detected. This could indicate centralized control.<br>`;
            } catch (e) {}

            // Print any risks found with access control
            if (accessControlMsg) {
                resultDiv.innerHTML += `<p class="warning">${accessControlMsg}</p>`;
            } else {
                resultDiv.innerHTML += `<p>No owner/admin control detected. This could be safer.</p>`;
            }

            // General safety conclusion
            resultDiv.innerHTML += `<p><strong>General Safety Check Complete.</strong></p>`;

        } catch (error) {
            console.error("Error in contract interaction:", error);
            resultDiv.innerHTML += `<p class="warning"><strong>Unable to check the token. ${error.message}</strong></p>`;
        }
    }

    document.getElementById('checkButton').addEventListener('click', function () {
        const tokenAddress = document.getElementById('tokenAddress').value.trim();

        // Validate Ethereum address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
            alert("Please enter a valid Ethereum address.");
            return;
        }

        // Display "Checking..." and clear previous results
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = "<p>Checking...</p>";

        checkToken(tokenAddress);
    });
});
