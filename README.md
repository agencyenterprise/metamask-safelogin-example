# Metamask Safelogin

Hello! This is a very simple example of how to implement a signing mechanism
for a safer login flow with MetaMask. This is how it works:

1. User connects their wallet by clicking the "Connect Wallet" button
2. Pop-up for confirming the connection shows up, and user confirms it
   ![connect](https://user-images.githubusercontent.com/696982/158999992-7bb3455b-b1a6-4e03-9a5a-2562ce354eba.png)
   ![confirm_connection](https://user-images.githubusercontent.com/696982/159000001-ae36cf5d-b42e-43fc-bdac-04b75ad066da.png)
3. Pop-up for a signature request shows up, and user can sign it
   ![signature_request](https://user-images.githubusercontent.com/696982/159000010-81c92aa3-47d3-46bb-a9e4-29a503d1d5e9.png)
4. Once signed, login flow should proceed normaly.
6. To verify the user, we check the signature of the user (in the database)
   against the signature that we're generating at runtime (when logged user is
   trying to perform some action that requires verifying that he actually owns
   the wallet) (see implementation at `src/Home.njs`)
