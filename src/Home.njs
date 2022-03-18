import Nullstack from 'nullstack';
import './Home.scss';
import Web3 from 'web3/dist/web3.min.js'
import MetaMaskOnboarding from "@metamask/onboarding"

const SIGNING_MESSAGE = "Hello from Token Runners!"

class Home extends Nullstack {

  // This is hard-coded but in a normal scenario, each user would have this
  // stored as part of their user data, managed by your app.
  userSignature = "0x77d63a4f000dc3af3456968df95a42c2b72fd3d2144bc527a9e87bdbea25a8e56dd868670fe57d3261fd968fa985d7c62e95fec553454c7349be0953e31ff9f61c";

  prepare({project, page}) {
    page.title = `${project.name} - Welcome to Nullstack!`;
    page.description = `${project.name} was made with Nullstack`;
  }

  async hydrate(context) {
    const {wallet} = context;

    this._onboarding = new MetaMaskOnboarding()

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const [account] = await window.ethereum.request({method: 'eth_accounts'})

      const _web3 = new Web3(Web3.givenProvider)

      if (account) {
        context.connected = true
        wallet.type = 'metamask'
        wallet.address = account
        wallet.balance = Web3.utils.fromWei(await _web3.eth.getBalance(account), 'ether')
        wallet.signature = this.userSignature

        const signingAddress = await _web3.eth.personal.ecRecover(
          SIGNING_MESSAGE,
          this.userSignature,
        )

        console.log(`signed properly: ${signingAddress}`)
      }

      window.ethereum.on('accountsChanged', async ([account]) => {
        wallet.address = account
        wallet.balance = account ? Web3.utils.fromWei(await _web3.eth.getBalance(account), 'ether') : 0

        if (!account) {
          location.reload()
        }
      })

      window.ethereum.on('chainChanged', () => window.location.reload())

      context._web3 = _web3
      this._onboarding.stopOnboarding()
    }
  }

  renderLink({children, href}) {
    const link = href + '?ref=create-nullstack-app';
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  disconnect(context) {
    context.connected = false
    context.wallet = {
      signature: undefined,
      type: undefined,
      address: undefined,
      balance: 0
    }

    location.reload()
  }

  async connect(context) {
    const {_web3, signed, wallet} = context
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})


      if (account) {
        const sig = await _web3.eth.personal.sign(
          SIGNING_MESSAGE,
          account,
          // "test password",
        )

        console.log(`signed: ${sig}`)
        wallet.address = account
        wallet.signature = sig

        context.connected = true

        console.log(context)
      }
    } else {
      this._onboarding.startOnboarding()
    }
  }

  render({connected, instance, wallet}) {
    return (
      <main>
        <button
          onclick={async () => {
            if (!connected) {
              await this.connect({wallet})
            } else {
              this.disconnect()
            }
          }}>{connected ? 'Disconnect' : 'Connect Wallet'}</button>
      </main>
    )
  }

}

export default Home;
