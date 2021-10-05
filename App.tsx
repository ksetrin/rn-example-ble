import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import base64 from 'react-native-base64';

const manager = new BleManager();
manager.setLogLevel('Verbose');

const App = () => {
  React.useEffect(() => {
    console.log('xxxxxxxx-1');

    console.log('xxxxxxxx-2');
    const subscription = manager.onStateChange(state => {
      console.log('xxxxxxxx-3');
      if (state === 'PoweredOn') {
        console.log('xxxxxxxx-4');
        scanAndConnect();
        subscription.remove();
      }
    }, true);
    return () => subscription.remove();
  }, []);

  const scanAndConnect = () => {
    console.log('xxxxxxxx-5');
    manager.startDeviceScan(null, null, (error, device) => {
      console.log('xxxxxxxx-6', device.name, device.isConnectable);

      if (error) {
        console.log('xxxxxxxx-7');
        return;
      }

      if (device.name === 'GS-SalsaConnect') {
        console.log('xxxxxxxx-8');
        manager.stopDeviceScan();
        console.log('xxxxxxxx-9');

        device
          .connect({autoConnect: false}) //, timeout: 0
          .then(device1 => {
            console.log('xxxxxxxx-10', new Date());

            device.onDisconnected((error, device) => {
              console.log('>> onDisconnected', error, new Date());
            });

            return device1.discoverAllServicesAndCharacteristics(); // important
          })
          .then(async device2 => {
            console.log('xxxxxxxx-11', device2);

            device.monitorCharacteristicForService(
              '0003CDD0-0000-1000-8000-00805F9B0131',
              '0003CDD1-0000-1000-8000-00805F9B0131',
              (error, obj) => {
                console.log(
                  'error',
                  error,
                  'NOTIFICATION>>>',
                  JSON.stringify(obj),
                );

                if (error) {
                  console.log('monitorCharacteristicForService ERROR');
                  return;
                }

                // // commands
                // const lastBloodValue = 'ewEgARATVQABAQQDBwd9'; // Command for last History
                // const deviceUnit = 'ewEQASCqVQAAAgENCH0='; // Device Unit
                //
                // console.log('WriteQ START ');
                //
                // device
                //   .writeCharacteristicWithoutResponseForService(
                //     '0003CDD0-0000-1000-8000-00805F9B0131',
                //     '0003CDD2-0000-1000-8000-00805F9B0131',
                //     deviceUnit,
                //   )
                //   .then(async result => {
                //     console.log('WriteQ RESULT', result);
                //     handleResult(result);
                //   })
                //   .catch(error => {
                //     console.log('xxxxxxxx-14', error.message, error);
                //   });
              },
            );
          })
          .catch(error => {
            console.log('xxxxxxxx-14', error.message, error);
          });
      }
    });
  };

  const handleResult = obj => {
    console.log('Subscribed Result');

    const bytes = Buffer.from(obj?.value, 'base64');

    console.log('xxxxxxxx-12', bytes);

    let resultString;
    for (let i = 0; i < bytes.length; i++) {
      let temp = bytes[i].toString(16).toUpperCase(); // from byte to hex
      console.log('xxxxxxxx-13', temp);
      if (temp.length == 1) {
        resultString += '0' + temp;
      } else {
        resultString += temp;
      }
    }
    console.log('xxxxxxxx-14', resultString);

    let start = resultString.indexOf('7B');
    let end = resultString.indexOf('7D');
    console.log('xxxxxxxx-15', start, end);
    let answer;
    let message;
    if (start >= 0 && end > 0) {
      answer = resultString.substring(start, end + 2);
      message = answer;
    } else {
      answer = '';
    }
    console.log('xxxxxxxx-15', answer, message);

    let unit;
    let value;
    let concentration;
    if (answer.length > 0) {
      let protocolCode = answer.slice(10, 12);
      console.log('protocolCode: ' + protocolCode);
      if (protocolCode === 'AA') {
        unit = answer.slice(18, 20);
        if (unit === '22') {
          unit = 'mmol/L';
        } else if (unit === '11') {
          unit = 'mg/dL';
        }
        console.log('Unit: ' + unit);
        value = 0;
        // deferred.resolve(null);
      }

      console.log('unit: ', unit);

      console.log('protocolCode: ', protocolCode);

      if (protocolCode === 'DD') {
        let tempvalue = answer.slice(28, 32);
        let highvalue = tempvalue.slice(0, 2);
        let lowvalue = tempvalue.slice(2, 4);

        let high = parseInt(highvalue, 16);
        let low = parseInt(lowvalue, 16);

        console.log('xxxxxxxx-16', tempvalue, highvalue, lowvalue, high, low);

        if (unit === 'mmol/L') {
          concentration = (high * 100 + low) / 10;
        } else if (unit === 'mg/dL') {
          concentration = high * 100 + low;
        }
        value = concentration;
        // deferred.resolve(concentration);
      } else {
        // deferred.resolve(null);
      }
    } else {
      value = 0;
    }

    console.log('Value: ', value);
    console.log('concentration: ', concentration);
  };

  return (
    <SafeAreaView>
      <Text>BLE12345678</Text>
    </SafeAreaView>
  );
};

export default App;
