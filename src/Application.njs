import Nullstack from 'nullstack'
import './Application.scss'
import Home from './Home.njs'


class Application extends Nullstack {

  prepare(context) {
    context.wallet = {type: undefined, address: undefined, balance: 0}
    context._web3 = {}
    context.connected = false
  }

  renderHead() {
    return (
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
        <link
          href="https://fonts.gstatic.com" rel="preconnect"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Crete+Round&family=Roboto&display=swap"
          rel="stylesheet"/>
      </head>
    )
  }

  render() {
    return (
      <main>
        <Head/>
        <Home route="/"/>
      </main>
    )
  }

}

export default Application;
