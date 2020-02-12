import { get } from 'lodash';
import { getReserve } from '../handlers/uniswap';
import { web3Provider } from '../handlers/web3';
import { promiseUtils } from '../utils';
import { uniswapUpdateTokenReserves } from './uniswap';

// -- Actions ---------------------------------------- //
export const web3UpdateReserves = () => async (dispatch, getState) =>
  new Promise(async resolve => {
    const { inputCurrency, outputCurrency } = getState().uniswap;
    if (!(inputCurrency || outputCurrency)) return;
    const [
      inputReserve,
      outputReserve,
    ] = await promiseUtils.PromiseAllWithFails([
      getReserve(get(inputCurrency, 'address')),
      getReserve(get(outputCurrency, 'address')),
    ]);
    dispatch(uniswapUpdateTokenReserves(inputReserve, outputReserve));
    resolve({ inputReserve, outputReserve });
  });

export const web3ListenerInit = () => dispatch => {
  web3Provider.pollingInterval = 8000;
  web3Provider.on('block', () => dispatch(web3UpdateReserves()));
};

export const web3ListenerStop = () => () => {
  web3Provider.removeAllListeners('block');
};
