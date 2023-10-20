import React, { useEffect, useState } from 'react';
import {Button, Spinner} from 'react-bootstrap';
import useLNC from '../hooks/useLNC';

const HelloClient: React.FC = () => {
  const { lnc } = useLNC();
  const [balance, setBalance] = useState<any>();
  const [macaroon, setMacaroon] = useState<any>();
  const [invoice, setInvoice] = useState<any>();
  const [preimage, setPreimage] = useState<any>();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [helloResponse, setHelloResponse] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  useEffect(() => {
    if (lnc.isConnected) {
      const sendRequest = async () => {
        const balanceRes = await lnc.lnd.lightning.channelBalance();
        setBalance(balanceRes);
      };
      sendRequest();
    }
  }, [lnc.isConnected, lnc.lnd.lightning]);

  if (!lnc.isConnected || !balance) return null;

  async function sayHello() {
    const response = await fetch("http://localhost:3000/api/hello");
    const wwwAuthenticateHeader = response.headers.get('Www-Authenticate');
    const match = wwwAuthenticateHeader!.match(/LSAT macaroon="([\w+/=]+)", invoice="(\w+)"/);
    let macaroon = match![1];
    setMacaroon(macaroon);
    let invoice = match![2];
    setInvoice(invoice);
    setHelloResponse(`${response.status} ${response.statusText}`);
  }

  function base64ToHex(str: string) {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
  }

  async function payInvoice() {
    setShowLoader(true);
    const sendResponse = await lnc.lnd.lightning.sendPaymentSync({paymentRequest: invoice});
    const encodedPreimage = base64ToHex(sendResponse.paymentPreimage as string);
    setPreimage(encodedPreimage);
    setPaymentStatus(`invoice paid!`);
    setShowLoader(false);
    const balanceRes = await lnc.lnd.lightning.channelBalance();
    setBalance(balanceRes);
  }

  async function sayHelloAgain() {
    const authorizationHeader = `LSAT ${macaroon}:${preimage}`;
    const headers = new Headers();
    headers.append("Authorization", authorizationHeader);
    const response = await fetch("http://localhost:3000/api/hello", {
      headers: headers,
    });
    const body = await response.json();
    setHelloResponse(`${body.message}`);
  }

  return (
    <>
      <h4 className="mt-5">Balance</h4>
      <div>Balance: {balance.localBalance.sat} sats</div>
      <h4 className="mt-5">Hello</h4>
      <div><Button onClick={sayHello}>Say Hello</Button></div>

      {macaroon && <div>Macaroon: {macaroon}</div>}
      {invoice && <div>Invoice: {invoice}</div>}

      {invoice && <div><Button onClick={payInvoice}>Pay Invoice</Button>{showLoader && <Spinner></Spinner>}</div>}
      {preimage && <div>{paymentStatus}</div>}
      {preimage && <div>payment secret: {preimage}</div>}
      {preimage && <div>New balance: {balance.localBalance.sat}</div>}

      {preimage && <div><Button onClick={sayHelloAgain}>Say Hello Again</Button></div>}

      <h4 className="mt-5">Hello Response</h4>
      {helloResponse && <div>Response: {helloResponse}</div>}
    </>
  );
};

export default HelloClient;
