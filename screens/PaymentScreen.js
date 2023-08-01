import { initStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { fetchPublishableKey } from '../helpers/fetchPublishableKey';
import { colors } from '../colors';

const PaymentScreen = ({children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const data = await fetchPublishableKey();
      const publishableKey = data.key;

      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.com.stripe.react.native',
          urlScheme: 'stripe-example',
          setUrlSchemeOnAndroid: true,
        });
        setLoading(false);
      }
     }
     initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    
    <ScrollView
      accessibilityLabel="payment-screen"
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      {children}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Text style={{ opacity: 0 }}>appium fix</Text>
    </ScrollView>
   
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.slate,
    marginTop:20,
    justifyContent:'center',
    paddingHorizontal: 16,
  },
});

export default PaymentScreen;
