import abi from './abi.json';
import Web3, { HexString } from 'web3';
import { isAddress } from 'web3-validator';

let selectedAccount;

const contractAddress = "0xE72c69b02B4B134fb092d0D083B287cf595ED1E6";
const providerUrl = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

interface MethodActions {
	call: () => Promise<number>
}

export interface Methods {
	balanceOf: (address: string) => {call: () => Promise<number>};
	transfer: any;
	increaseAllowance: any;
}

export const connectMetaMaskAccount = async () => {
		const provider = window['ethereum'];
	
        if (!!provider) {
        	const accounts = await provider.request({ method: 'eth_requestAccounts' })

			selectedAccount = accounts[0];
        	window['ethereum']?.on('accountsChanged', (accounts) => {
        		selectedAccount = accounts[0];
        		console.log(`Selected account changed to ${selectedAccount}`);
        	});
        }
}

export const getContract = (shouldUseMetamaskProvider: boolean = false): { methods: Methods } => {
	const web3 = new Web3(shouldUseMetamaskProvider ? window['ethereum']: providerUrl);
	const contract = new web3.eth.Contract(abi, contractAddress);
	Object.assign(window,{web3, contract})
	return contract as unknown as { methods: Methods };
}

export const getAccountBalance = (contactAddress: string) => getContract().methods.balanceOf(contactAddress).call();

export const transfer = async (sourceAddress: string, targetAddress: string, amount: number, privateKey: string): Promise<any> => {
	const web3 = new Web3(window['ethereum']);
	const val = Web3.utils.toBigInt(amount);
	const gasPrice = await web3.eth.getGasPrice();
	const transaction = {
		to: contractAddress,
		from: sourceAddress,
		value: '0x00',
		data: getContract(true).methods.transfer(targetAddress, val).encodeABI(),
		gasPrice,
	}

	const signedTrx = await web3.eth.accounts.signTransaction(transaction, privateKey);

	return await web3.eth.sendSignedTransaction(signedTrx.rawTransaction)
}

export interface RequestParams {
	sourceAddress: string,
	targetAddress: string,
	amount: number,
}

export const validateRequestParams = async (params: RequestParams) : Promise<string[]> => {
	const validationErrors: string[] = [];
	
	if (!params.amount || typeof params.amount !== 'number' || params.amount <= 0) {
		validationErrors.push('Amount should be larget than zero');
	}
	
	if (!isAddress(params.sourceAddress)) {
		validationErrors.push('Source address is not valid');
	}

	if (!isAddress(params.targetAddress)) {
		validationErrors.push('Target address is not valid');
	} else {
		const sourceBalance = await getAccountBalance(params.sourceAddress);
		if (sourceBalance < params.amount) {
			validationErrors.push('Not sufficient balance');
		}
	}

	return validationErrors;
}