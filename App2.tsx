import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import base64 from 'react-native-base64';

// "deviceID": "8ACF79D9-A972-C6FA-3429-F83C4368AB0F", "id": 10739517024, "isIndicatable": false, "isNotifiable": true, "isNotifying": false, "isReadable": true, "isWritableWithResponse": false, "isWritableWithoutResponse": false, "serviceID": 10791388032, "serviceUUID": "0000fee0-0000-1000-8000-00805f9b34fb", "uuid": "00000007-0000-3512-2118-0009af100700", "value": "DFECAACMAQAAEQAAAA=="}

const manager = new BleManager();
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
            console.log('xxxxxxxx-11');
            // const services = await manager.servicesForDevice(device.id);

            //auth
            device
              .characteristicsForService('0000fee1-0000-1000-8000-00805f9b34fb')
              .then(characteristics => {
                console.log('_char_auth', characteristics);

                const characteristicAuth = characteristics[0];

                characteristicAuth
                  .descriptors()
                  .then(descriptors => {
                    console.log('descriptors', descriptors);

                    const notif = descriptors[0];
                    notif
                      .write(base64.encodeFromByteArray([1, 0]))
                      .then(result => {
                        console.log('result', result);
                      })
                      .catch(error => {
                        console.log('write err', error.message, error);
                      });

                    // .write(b"\x01\x00", True)
                    // descriptors[
                    //   {
                    //     _manager: {
                    //       _activePromises: [Object],
                    //       _activeSubscriptions: [Object],
                    //       _errorCodesToMessagesMapping: [Object],
                    //       _eventEmitter: [NativeEventEmitter],
                    //       _scanEventSubscription: null,
                    //       _uniqueId: 9,
                    //     },
                    //     characteristicID: 54,
                    //     characteristicUUID:
                    //       '00000009-0000-3512-2118-0009af100700',
                    //     deviceID: 'CB:FB:7D:5B:44:F9',
                    //     id: 55,
                    //     serviceID: 53,
                    //     serviceUUID: '0000fee1-0000-1000-8000-00805f9b34fb',
                    //     uuid: '00002902-0000-1000-8000-00805f9b34fb',
                    //     value: null,
                    //   }
                    // ];
                  })
                  .catch(error => {
                    console.log('descriptors err', error.message, error);
                  });

                // [
                //   {
                //     _manager: {
                //       _activePromises: ['Object'],
                //       _activeSubscriptions: ['Object'],
                //       _errorCodesToMessagesMapping: ['Object'],
                //       _eventEmitter: ['NativeEventEmitter'],
                //       _scanEventSubscription: null,
                //       _uniqueId: 8,
                //     },
                //     deviceID: 'CB:FB:7D:5B:44:F9',
                //     id: 54,
                //     isIndicatable: false,
                //     isNotifiable: true,
                //     isNotifying: false,
                //     isReadable: true,
                //     isWritableWithResponse: false,
                //     isWritableWithoutResponse: true,
                //     serviceID: 53,
                //     serviceUUID: '0000fee1-0000-1000-8000-00805f9b34fb',
                //     uuid: '00000009-0000-3512-2118-0009af100700',
                //     value: null,
                //   },
                // ];
              })
              .catch(error => {
                console.log('_char_auth err', error.message, error);
              });

            // device.monitorCharacteristicForService(
            //   '0000fee1-0000-1000-8000-00805f9b34fb',
            //   '00000007-0000-3512-2118-0009af100700',
            //   (error, char) => {
            //     console.log('ZZZZZZZZZZZ', error, char);
            //   },
            // );

            // console.log('Services:', services);

            //

            // services.forEach((service, i) => {
            //   console.log('service uuid', service.uuid);
            //   service.characteristics().then(characteristic => {
            //     characteristic.forEach(c => {
            //       console.log(
            //         'characteristics uuid',
            //         c.uuid,
            //         c.isReadable && 'isReadable',
            //         c.isNotifiable && 'isNotifiable',
            //         c.isNotifying && 'isNotifying',
            //         c.isIndicatable && 'isIndicatable',
            //       );
            //       // characteristic.monitor((error, char) => {
            //       //   console.log('xxxxxxxx-13-3', error, char);
            //       // });
            //
            //       // c.isReadable &&
            //       //   characteristic
            //       //     .read()
            //       //     .then(value => {
            //       //       console.log('value', value);
            //       //     })
            //       //     .catch(error => {
            //       //       console.log('value-error-14', error.message, error);
            //       //     });
            //       //
            //       // c.isReadable &&
            //       //   device
            //       //     .readCharacteristicForService(service.uuid, c.uuid)
            //       //     .then(r => {
            //       //       console.log('value r', r.value);
            //       //
            //       //       const readValueInRawBytes = Buffer.from(r.value, 'base64');
            //       //
            //       //       console.log('readValueInRawBytes', readValueInRawBytes)
            //       //       console.log('readValueInRawBytes-1', readValueInRawBytes.readInt8(0))
            //       //       console.log('readValueInRawBytes-2', readValueInRawBytes.readInt8(0) & 0x01)
            //       //       console.log('readValueInRawBytes-3', readValueInRawBytes.readInt8(1))
            //       //
            //       //     })
            //       //     .catch(error => {
            //       //       console.log('r err', error.message, error);
            //       //     });
            //
            //       c.isNotifiable &&
            //         device.monitorCharacteristicForService(
            //           service.uuid,
            //           c.uuid,
            //           (error, char) => {
            //             console.log('value char', char?.value);
            //
            //             // const readValueInRawBytes = Buffer.from(r.value, 'base64');
            //             //
            //             // console.log('readValueInRawBytes', readValueInRawBytes)
            //             // console.log('readValueInRawBytes-1', readValueInRawBytes.readInt8(0))
            //             // console.log('readValueInRawBytes-2', readValueInRawBytes.readInt8(0) & 0x01)
            //             // console.log('readValueInRawBytes-3', readValueInRawBytes.readInt8(1))
            //           },
            //         );
            //
            //       // c.isNotifiable &&
            //       //   service.monitorCharacteristic(c.uuid, (error, char) => {
            //       //     console.log('xxxxxxxx-13-3', c.uuid, error, char);
            //       //   });
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
      <Text>BLE123456</Text>
    </SafeAreaView>
  );
};

export default App;
