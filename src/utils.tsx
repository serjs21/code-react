import abi from './abi.json';
import Web3, { HexString } from 'web3';
import { isAddress } from 'web3-validator';

let selectedAccount;

const contractAddress = "0xE72c69b02B4B134fb092d0D083B287cf595ED1E6";
const providerUrl = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

export interface Methods {
	balanceOf: (address: string) => {call: () => Promise<number>};
	transferFrom: (sourceAddress: string, targetAddress: string, amount: HexString) => {call: () => Promise<boolean>}
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

export const getContract = (): { methods: Methods } => {
	const web3 = new Web3(providerUrl);
	const contract = new web3.eth.Contract(abi, contractAddress);
	Object.assign(window,{web3, contract})
	return contract as unknown as { methods: Methods };
}

export const getAccountBalance = (contactAddress: string) => getContract().methods.balanceOf(contactAddress).call();

export const transfer = async (sourceAddress: string, targetAddress: string, amount: number): Promise<boolean> => {
	return getContract().methods.transferFrom(selectedAccount, targetAddress, Web3.utils.utf8ToHex(amount.toString())).call();
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