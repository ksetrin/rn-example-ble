import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';
import base64 from 'react-native-base64';

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
      console.log(
        'xxxxxxxx-6',
        device.name,
        // device.localName,
        device.isConnectable,
      );

      if (error) {
        console.log('xxxxxxxx-7');
        // Handle error (scanning will be stopped automatically)
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'MI Band 2') {
        console.log('xxxxxxxx-8');
        // Stop scanning as it's not necessary if you are scanning for one device.
        manager.stopDeviceScan();
        console.log('xxxxxxxx-9');

        device
          .connect()
          .then(device1 => {
            device.onDisconnected((error,device) => {
              console.log('>> onDisconnected', error,device)
            });

            console.log('xxxxxxxx-10');
            return device1.discoverAllServicesAndCharacteristics();
          })
          .then(async device2 => {
            console.log('xxxxxxxx-10');
            const services = await manager.servicesForDevice(device.id);

            // console.log('Services:', services);

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
                  ),
                    // characteristic.monitor((error, char) => {
                    //   console.log('xxxxxxxx-13-3', error, char);
                    // });

                    c.isNotifiable &&
                      service.monitorCharacteristic(c.uuid, (error, char) => {
                        console.log('xxxxxxxx-13-3', c.uuid, error, char);
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
      <Text>BLE</Text>
    </SafeAreaView>
  );
};

export default App;
