import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { API_BASE_URL } from './config';
import * as FileSystem from 'expo-file-system';

export default function AddItemScreen() {
  const [ownerName, setOwnerName] = useState('');
  const [cleanerName, setCleanerName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to pick an image.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!ownerName || !cleanerName) {
        Alert.alert('Missing fields', 'Please provide owner and cleaner names.');
        return;
      }

      if (!image) {
        Alert.alert('No image', 'Please pick an image to upload.');
        return;
      }

      // Convert image URI to base64
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });

      const res = await fetch(`${API_BASE_URL}/log-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_name: ownerName,
          cleaner_name: cleanerName,
          base64_image: base64,
          price: Number(price) || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Upload failed', err);
        Alert.alert('Upload failed', 'Could not log item.');
        return;
      }

      const data = await res.json();
      console.log('Logged item:', data);
      Alert.alert('Item Submitted', 'Your item has been logged.');

      setOwnerName('');
      setCleanerName('');
      setPrice('');
      setImage(null);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Owner Name</Text>
      <TextInput
        style={styles.input}
        value={ownerName}
        onChangeText={setOwnerName}
        placeholder="Enter owner name"
      />

      <Text style={styles.label}>Cleaner Name</Text>
      <TextInput
        style={styles.input}
        value={cleanerName}
        onChangeText={setCleanerName}
        placeholder="Enter cleaner name"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />

      <Button title="Pick an image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 20,
  },
});
