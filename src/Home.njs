import Nullstack from 'nullstack';
import './Home.scss';
import Web3 from 'web3/dist/web3.min.js'
import MetaMaskOnboarding from "@metamask/onboarding"

class Home extends Nullstack {
  connected = false

  prepare({project, page}) {
    page.title = `${project.name} - Welcome to Nullstack!`;
    page.description = `${project.name} was made with Nullstack`;
  }

  async hydrate(context) {
    const {wallet} = context;
    this._onboarding = new MetaMaskOnboarding()
    context.connected = false

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const [selectedAddress] = await window.ethereum.request({method: 'eth_accounts'})

      context._web3 = new Web3(Web3.givenProvider)

      if (selectedAddress) {
        wallet.type = 'metamask'
        wallet.address = selectedAddress
        wallet.balance = Web3.utils.fromWei(await context._web3.eth.getBalance(selectedAddress), 'ether')
      }

      window.ethereum.on('accountsChanged', async ([account]) => {
        wallet.address = account
        wallet.balance = account ? Web3.utils.fromWei(await context._web3.eth.getBalance(account), 'ether') : 0

        if (!account) {
          location.reload()
        }
      })

      window.ethereum.on('chainChanged', () => window.location.reload())

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

  disconnect({wallet}) {

  }

  async connect(context) {
    const {wallet} = context
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})

      if (account) {
        wallet.address = account
        context.connected = true
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
              instance.disconnect()
            }
          }}>{connected ? 'Disconnect' : 'Connect'}</button>
      </main>
    )
  }

}

export default Home;
