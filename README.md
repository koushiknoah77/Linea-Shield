Linea Shield

Overview
Linea Shield is a powerful tool that helps users analyze blockchain tokens to detect potential risks such as rug pulls, honeypots, and blacklisted tokens. It provides real-time warnings and detailed token information to safeguard users from malicious projects.

Features
> Token Information: Displays token name, symbol, total supply, and decimals (if available).
> Rug Pull Detection: Scans the contract code for signs of rug pull tactics.
> Honeypot Detection: Identifies if the token is designed to trap investors by preventing sales.
> Blacklist Check: Flags tokens that are on known blacklists.
> Instant Alerts: Gives immediate warnings if a token is flagged as a rug pull, honeypot, or scam.

Shielding Logic
Linea Shield checks token safety with these methods:

Supply Check: Verifies that the total supply is public and consistent with the circulating tokens.
Smart Contract Analysis: Scans the contract for risky code patterns such as buy/sell restrictions and access control flaws.
Blacklist Lookup: Cross-checks tokens against known scam and blacklist databases.
Liquidity Check: Ensures the liquidity pool is secure and transparent.
Audit Review: Flags tokens lacking reputable third-party audits.

Usage
- Paste the token contract address into the input field.
- The system retrieves token details and runs a series of checks.
- View results, including warnings if the token is flagged as a rug pull, honeypot, or scam.

** Important: Please use your own API Key

Before you start testing, please ensure that you replace the placeholder API key with your own Infura API key. This is necessary for the application to interact with the Linea blockchain.

Steps:

Go to your Infura account and generate an API key.

Open the script.js file in the project folder.

Replace the value of INFURA_API_KEY with your personal API key

Save the file.

Once this is done, you can start the application and proceed with testing.

If you don't have an Infura account, you can create one here.

Let me know if you need any further assistance!

