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

            const services = await manager.servicesForDevice(device.id);
            // services.forEach((service, i) => {
            //   // console.log('service uuid', service.uuid);
            //   service.characteristics().then(characteristic => {
            //     characteristic.forEach(c => {
            //       console.log(
            //         'characteristic',
            //         c.uuid,
            //         'service',
            //         service.uuid,
            //         c.isReadable && 'isReadable',
            //         c.isNotifiable && 'isNotifiable',
            //         c.isNotifying && 'isNotifying',
            //         c.isIndicatable && 'isIndicatable',
            //       );
            //     });
            //   });
            // });

            services.forEach((service, i) => {
              console.log('service uuid', service.uuid);
              service.characteristics().then(characteristic => {
                characteristic.forEach(c => {
                  console.log(
                    'characteristics uuid',
                    c.uuid,
                    c.isReadable && 'isReadable',
                    c.isNotifiable && 'isNotifiable',
                    c.isNotifying && 'isNotifying',
                    c.isIndicatable && 'isIndicatable',
                  );

                  c.isReadable &&
                    device
                      .readCharacteristicForService(service.uuid, c.uuid)
                      .then(r => {
                        console.log('value r', r.value, Buffer.from(r.value, 'base64'));
                      })
                      .catch(error => {
                        console.log('r err', error.message, error);
                      });

                  c.isNotifiable &&
                    service.monitorCharacteristic(c.uuid, (error, char) => {
                      console.log('Notifiable', c.uuid, error, char);
                    });
                });
              });
            });
          })
          .catch(error => {
            console.log('xxxxxxxx-14', error.message, error);
          });
      }
    });
  };

  return (
    <SafeAreaView>
      <Text>BLE1234567</Text>
    </SafeAreaView>
  );
};

export default App;
