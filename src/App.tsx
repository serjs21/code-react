import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import * as utils from './utils';


Object.assign(window, {utils})

function App() {
  const [address, setAddress] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState(0);
  const [balance, setBalance] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const shouldDisplaySourceContactInput = !window['ethereum'];

  const connectMetaMaskAccount = useCallback(async () => {
    try {
		  const provider = window['ethereum'];
        if (!!provider) {
        	const accounts = await provider?.request({ method: 'eth_requestAccounts' })
          setSelectedAccount(accounts[0]);

        	provider?.on('accountsChanged', (accounts) => {
            setSelectedAccount(accounts[0]);
        	});
        }
      } catch (e) {
        console.error(e);
      }
}, []);

const setSelectedAccountBalance = () => {
  if (!selectedAccount) return;
  utils.getAccountBalance(selectedAccount)
    .then((res) => {
      setBalance(`${res}`)
    })
    .catch((error) => {
      console.error(error);
      setBalance(`Could not resolve this account's balance`)
    })
}

useEffect(() => {
  setSelectedAccountBalance();
}, [selectedAccount])

  useEffect(() => {
    connectMetaMaskAccount();
  }, []);

  const onSubmit = async () => {
    setValidationErrors([]);

    const sourceAccount = selectedAccount.trim();
    const targetAccount = targetAddress.trim();

    const errors = await utils.validateRequestParams({
      sourceAddress: sourceAccount,
      targetAddress: targetAccount,
      amount: amountToSend
    });

    if (!!errors.length) {
      setValidationErrors(errors);
      return;
    }

    try {
      await utils.transfer(sourceAccount, targetAccount, amountToSend);
      await setSelectedAccountBalance();
    } catch (error: any) {
      console.error(error);
       setValidationErrors([error.message])
    }
  }

  return (
    <div className="App">
      <div className='accountDetails'>
        { !shouldDisplaySourceContactInput && !selectedAccount ? <button onClick={connectMetaMaskAccount}>Connect Account</button>: null}
        { !!shouldDisplaySourceContactInput ? <span className='field account'> Source account <input onChange={(e) => setAddress(e.target.value)} value={address}/></span> : null }
        { !!selectedAccount && <span className='field account'> Connected Account:  <span className='value'>{`${selectedAccount.substring(0,6)}...${selectedAccount.substring(selectedAccount.length - 4)}`}</span> </span>}
        
        {!!selectedAccount && <span className='field account'> Current balance: <span className='value'>{balance}</span> </span>}
      </div>
      <span className='field'> Target address <input onChange={(e) => setTargetAddress(e.target.value)} value={targetAddress}/></span>
      <span className='field'>Amount <input type='number' min={0} onChange={(e) => setAmountToSend(Number(e.target.value))} value={amountToSend} /></span>

      <button onClick={onSubmit}>Send</button>

      {validationErrors.map(error => <div className='error' key={error}>{error}</div>)}
    </div>
  );
}



export default App;
