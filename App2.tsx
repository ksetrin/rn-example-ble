import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import base64 from 'react-native-base64';

const SERVICE_UUID = '0000fee0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00000007-0000-3512-2118-0009af100700';

const manager = new BleManager();
manager.setLogLevel('Verbose');

const App = () => {
    React.useEffect(() => {
        console.log('xxxxxxxx-1');

        // const values = [
        //   'R1MtU2Fsc2FDb25uZWN0',
        //   'AAA=',
        //   'AA==',
        //   'CAAIAAAA9AE=',
        //   'AQD//w==',
        //   'SEotNTgwWFA=',
        //   'QkxFLVZpdmFjaGVr',
        //   'SEoxOTA2MTNYUA==',
        //   'VkVSMi4xU04=',
        //   'VkVSMy4wU04tTk0=',
        //   'WbYCAADTEIk=',
        //   'AdIAgAUAAQ==',
        //   '',
        // ];
        // values.forEach(val => console.log('READ VALUE', base64.decode(val)));
        //
        // const notification = {
        //   deviceID: '89:10:D3:02:B6:59',
        //   id: 18,
        //   isIndicatable: false,
        //   isNotifiable: true,
        //   isNotifying: true,
        //   isReadable: false,
        //   isWritableWithResponse: false,
        //   isWritableWithoutResponse: false,
        //   serviceID: 17,
        //   serviceUUID: '0003cdd0-0000-1000-8000-00805f9b0131',
        //   uuid: '0003cdd1-0000-1000-8000-00805f9b0131',
        //   // value: 'ewEgARDSZgAACwkHAH0=',
        //   value: 'ewEgARDSZgAACwkHAH0=',
        // };
        //
        // //          var bytes = $cordovaBluetoothLE.encodedStringToBytes(obj.value);
        // //           stringBuilder(bytes);
        // //           searchForNextRespone();
        // // function stringBuilder(byte) {
        // //   for (let i = 0; i < byte.length; i++) {
        // //     let temp = byte[i].toString(16).toUpperCase();
        // //     if (temp.length == 1) {
        // //       resultString += '0' + temp;
        // //     } else {
        // //       resultString += temp;
        // //     }
        // //   }
        // // }
        //
        // const readValueInRawBytes = Buffer.from(notification.value, 'base64'); //
        // console.log('readValueInRawBytes', readValueInRawBytes, readValueInRawBytes.toJSON().data)
        //
        // const heightMostSignificantByte = readValueInRawBytes.toJSON().data[1];
        // const heightLeastSignificantByte = readValueInRawBytes.toJSON().data[0];
        //
        // console.log('Most Least', heightMostSignificantByte, heightLeastSignificantByte)
        //
        // const heightInCentimeters = (heightMostSignificantByte << 8) | heightLeastSignificantByte;
        // console.log('>>>>>', heightInCentimeters);
        //
        // return;

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

    //   /**
    //    * converts decimal byte to hex string.
    //    * puts all recived subcribed values into one sting
    //    */
    //
    //   const stringBuilder = (byte) => {
    //     for (let i = 0; i < byte.length; i++) {
    //       let temp = byte[i].toString(16).toUpperCase();
    //       if (temp.length == 1) {
    //         resultString += '0' + temp;
    //       } else {
    //         resultString += temp;
    //       }
    //     }
    //   }
    //   /**
    //    * extract Bloodsugar value from subcribed value.
    //    *
    //    */
    //
    //   const searchForNextRespone = () => {
    //     let start = resultString.indexOf('7B');
    //     let end = resultString.indexOf('7D');
    //
    //     if (start >= 0 && end > 0) {
    //       answer = resultString.substring(start, end + 2);
    //       message = answer;
    //     } else {
    //       answer = '';
    //     }
    //   }
    //   return deferred.promise;
    // };

    const scanAndConnect = () => {
        console.log('xxxxxxxx-5');
        manager.startDeviceScan(null, null, (error, device) => {
            console.log('xxxxxxxx-6', device.name, device.isConnectable);

            if (error) {
                console.log('xxxxxxxx-7');
                return;
            }

            // if (device.name === 'GS-SalsaConnect') {
            if (device.name === 'MI Band 2') {
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
                            (error, obj1) => {
                                const obj = {
                                    deviceID: '89:10:D3:02:B6:59',
                                    id: 18,
                                    isIndicatable: false,
                                    isNotifiable: true,
                                    isNotifying: true,
                                    isReadable: false,
                                    isWritableWithResponse: false,
                                    isWritableWithoutResponse: false,
                                    serviceID: 17,
                                    serviceUUID: '0003cdd0-0000-1000-8000-00805f9b0131',
                                    uuid: '0003cdd1-0000-1000-8000-00805f9b0131',
                                    // value: 'ewEgARDSZgAACwkHAH0=',
                                    value: 'ewEgARDSZgAACwkHAH0=',
                                };

                                console.log(
                                    'error',
                                    error,
                                    'NOTIFICATION>>>',
                                    JSON.stringify(obj),
                                );
                                // if (error) {
                                //   console.log('monitorCharacteristicForService ERROR');
                                //   return;
                                // }

                                console.log('Subscribed Result 1');

                                const bytes = Buffer.from(obj.value); //{"data": [123, 1, 32, 1, 16, 210, 102, 0, 0, 11, 9, 7, 0, 125], "type": "Buffer"}
                                console.log('Subscribed Result 2', bytes, bytes.toJSON().data);

                                let resultString = '';
                                for (let i = 0; i < bytes.toJSON().data.length; i++) {
                                    let temp = bytes.toJSON().data[i].toString(16).toUpperCase();
                                    console.log('Subscribed Result 2-1', bytes.toJSON().data[i], bytes.toJSON().data[i].toString(16), temp);
                                    if (temp.length == 1) {
                                        resultString += '0' + temp;
                                    } else {
                                        resultString += temp;
                                    }
                                }
                                console.log('Subscribed Result 3', resultString);

                                let start = resultString.indexOf('7B');
                                let end = resultString.indexOf('7D');

                                console.log('Subscribed Result 4', start, end);

                                let answer = '';
                                let message = '';
                                let value;
                                let unit;
                                let concentration;
                                if (start >= 0 && end > 0) {
                                    answer = resultString.substring(start, end + 2);
                                    message = answer;
                                } else {
                                    answer = '';
                                }

                                console.log('Subscribed Result 5', answer);

                                if (answer.length > 0) {
                                    let protocolCode = answer.slice(10, 12);
                                    // console.log("protocolCode: "+ protocolCode);
                                    if (protocolCode === 'AA') {
                                        unit = answer.slice(18, 20);
                                        if (unit === '22') {
                                            unit = 'mmol/L';
                                        } else if (unit === '11') {
                                            unit = 'mg/dL';
                                        }
                                        console.log('Unit: ' + unit);
                                        value = 0;
                                    }
                                    console.log('Subscribed Result 6', protocolCode);
                                    if (protocolCode === 'DD') {
                                        let tempvalue = answer.slice(28, 32);
                                        let highvalue = tempvalue.slice(0, 2);
                                        let lowvalue = tempvalue.slice(2, 4);

                                        let high = parseInt(highvalue, 16);
                                        let low = parseInt(lowvalue, 16);
                                        if (unit === 'mmol/L') {
                                            concentration = (high * 100 + low) / 10;
                                        } else if (unit === 'mg/dL') {
                                            concentration = high * 100 + low;
                                        }
                                        value = concentration;
                                        // deferred.resolve(concentration);
                                    } else {
                                        console.log('Subscribed Result 7');
                                        // deferred.resolve(null);
                                    }
                                } else {
                                    console.log('Subscribed Result 8');
                                    value = 0;
                                }
                                console.log('Value: ' + value);
                            },
                        );

                        // const services = await manager.servicesForDevice(device.id);
                        //
                        // services.forEach((service, i) => {
                        //   console.log('service uuid', uuid);
                        //   characteristics().then(characteristic => {
                        //     characteristic.forEach(c => {
                        //       console.log(
                        //         'characteristic',
                        //         c.uuid,
                        //         'service',
                        //         uuid,
                        //         c.isReadable && 'isReadable',
                        //         c.isNotifiable && 'isNotifiable',
                        //         c.isNotifying && 'isNotifying',
                        //         c.isIndicatable && 'isIndicatable',
                        //       );
                        //
                        //       c.isReadable &&
                        //         device
                        //           .readCharacteristicForService(uuid, c.uuid)
                        //           .then(r => {
                        //             console.log(
                        //               'value r',
                        //               r.value,
                        //               Buffer.from(r.value, 'base64'),
                        //             );
                        //           })
                        //           .catch(error => {
                        //             console.log('r err', error.message, error);
                        //           });
                        //
                        //       c.isNotifiable &&
                        //         monitorCharacteristic(c.uuid, (error, char) => {
                        //           console.log(
                        //             'characteristic',
                        //             c.uuid,
                        //             'service',
                        //             uuid,
                        //             'error',
                        //             error,
                        //             'NOTIFICATION>>>',
                        //             JSON.stringify(char),
                        //           );
                        //         });
                        //     });
                        //   });
                        // });
                    })
                    .catch(error => {
                        console.log('xxxxxxxx-14', error.message, error);
                    });
            }
        });
    };

    return (
        <SafeAreaView>
            <Text>BLE12345678</Text>
        </SafeAreaView>
    );
};

export default App;
