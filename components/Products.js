import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Picker, FlatList, ScrollView } from "react-native";
import { Button, Snackbar, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';
import firebase, { db } from "../services/connectionFirebase";
import { addDoc, collection, doc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import ListProducts from './listProducts';

const Separator = () => <View style={styles.separator} />;

const theme = {
  colors: {
    primary: '#F6AA43',
  },
};

export default function Products() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [plataforms, setPlataforms] = useState("");
  const [studio, setStudio] = useState("");
  const [price, setPrice] = useState("");
  const [key, setKey] = useState('');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderBy, setOrderBy] = useState('name');

  const inputRef = useRef(null);

  useEffect(() => {
    search();
  }, []);

  async function search() {
    try {
      const querySnapshot = await getDocs(collection(db, 'games'));
      const productsData = [];
      querySnapshot.forEach(doc => {
        productsData.push({ key: doc.id, ...doc.data() });
      });
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setSnackbarMessage('Erro ao buscar produtos!');
      setSnackbarVisible(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return -1;
      if (a[orderBy] > b[orderBy]) return 1;
      return 0;
    });
    setProducts(sortedProducts);
  }, [orderBy]);

  async function insertUpdate() {
    try {
      if (name && plataforms && gender && studio && price) {
        const productsCollectionRef = collection(db, 'games');
        const productData = {
          name: name,
          platforms: plataforms,
          gender: gender,
          studio: studio,
          price: parseFloat(price.replace(',', '.')) // Converte para float
        };

        if (key) {
          await updateDoc(doc(db, 'games', key), productData);
          const updatedProducts = products.map(product =>
            product.key === key ? { ...product, ...productData } : product
          );
          setProducts(updatedProducts);
          setSnackbarMessage('Produto atualizado!');
        } else {
          await addDoc(productsCollectionRef, productData);
          setSnackbarMessage('Produto inserido!');
        }
        search();
        setSnackbarVisible(true);
        clearData();
        setModalVisible(false);
      } else {
        setSnackbarMessage('Preencha todos os campos obrigatórios!');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Erro ao inserir/atualizar produto:", error);
      setSnackbarMessage('Erro ao inserir/atualizar produto!');
      setSnackbarVisible(true);
    }
  }

  function promptDelete(key) {
    setSelectedProduct(key);
    setConfirmationModalVisible(true);
  }

  async function confirmDelete() {
    try {
      await deleteDoc(doc(db, 'games', selectedProduct));
      const updatedProducts = products.filter(item => item.key !== selectedProduct);
      setProducts(updatedProducts);
      setSnackbarMessage('Produto excluído!');
      setSnackbarVisible(true);
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setSnackbarMessage('Erro ao excluir produto!');
      setSnackbarVisible(true);
    }
  }

  function handleEdit(data) {
    setKey(data.key);
    setName(data.name);
    setPlataforms(data.platforms);
    setGender(data.gender);
    setStudio(data.studio);
    setPrice(data.price.toString()); // Converte para string para exibir no TextInput
    setModalVisible(true);
  }

  function clearData() {
    setKey('');
    setName('');
    setPlataforms('');
    setGender('');
    setStudio('');
    setPrice('');
  }

  const handleOrderByChange = (value) => {
    setOrderBy(value);
  };

  const formatPrice = (value) => {
    // Remove tudo que não é dígito
    let formattedValue = value.replace(/\D/g, '');

    // Formata para o padrão de moeda (70,00)
    formattedValue = (parseFloat(formattedValue) / 100).toFixed(2).replace('.', ',');

    // Atualiza o estado com o valor formatado
    setPrice(formattedValue);
  };

 


  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Button style={styles.buttonAddP} mode="contained" onPress={() => { setModalVisible(true); clearData(); }}>Adicionar Produto</Button>
        <Separator />
        <View style={styles.orderByContainer}>
          <Text style={styles.listar}>Listar Produtos</Text>
          <Picker
            selectedValue={orderBy}
            style={styles.picker}
            onValueChange={(itemValue) => handleOrderByChange(itemValue)}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Ordenar por Nome" value="name" />
            <Picker.Item label="Ordenar por Plataforma" value="platforms" />
            <Picker.Item label="Ordenar por Genero" value="gender" />
            <Picker.Item label="Ordenar por Studio" value="studio" />
            <Picker.Item label="Ordenar por Preço" value="price" />
          </Picker>
        </View>
        {loading ? (
          <ActivityIndicator color="#121212" size={45} />
        ) : (
          <FlatList
            keyExtractor={item => item.key}
            data={products}
            renderItem={({ item }) => (
              <ListProducts data={item} deleteItem={promptDelete} editItem={handleEdit} />
            )}
          />
        )}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Nome"
                maxLength={40}
                style={styles.input}
                onChangeText={(texto) => setName(texto)}
                value={name}
                ref={inputRef}
              />
              <Separator />
              <TextInput
                placeholder="Plataformas"
                style={styles.input}
                onChangeText={(texto) => setPlataforms(texto)}
                value={plataforms}
                ref={inputRef}
              />
              <Separator />
              <TextInput
                placeholder="Genero"
                style={styles.input}
                onChangeText={(texto) => setGender(texto)}
                value={gender}
                ref={inputRef}
              />
              <Separator />
              <TextInput
                placeholder="Studio"
                style={styles.input}
                onChangeText={(texto) => setStudio(texto)}
                value={studio}
                ref={inputRef}
              />
              <Separator />
              <TextInput
                placeholder="Preço"
                style={styles.input}
                onChangeText={(texto) => formatPrice(texto)}
                value={price}
                keyboardType="numeric"  // Define o teclado como numérico
                ref={inputRef}
              />
              <Separator />
              <Button mode="contained" onPress={insertUpdate} style={styles.modalButton}>Salvar</Button>
              <Separator />
              <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.modalButton}>Fechar</Button>
            </View>
          </Modal>

          <Modal
            visible={confirmationModalVisible}
            onDismiss={() => setConfirmationModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text>Tem certeza que deseja excluir este produto?</Text>
              <Separator />
              <Button mode="contained" onPress={confirmDelete} style={styles.modalButtonConfirm}>Confirmar</Button>
              <Separator />
              <Button mode="contained" onPress={() => setConfirmationModalVisible(false)} style={styles.modalButtonDelet}>Cancelar</Button>
            </View>
          </Modal>
        </Portal>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
    },
    buttonAddP: {
      backgroundColor: 'rgb(135, 206, 250)',
    },
    separator: {
      marginVertical: 10,
    },
    orderByContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    listar: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    picker: {
      height: 50,
      width: 150,
      borderRadius: 10,
    },
    pickerItem: {
      height: 44,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#6A5ACD',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    snackbar: {
      backgroundColor: theme.colors.primary,
    },
    modalButton: {
      width: '100%',
      marginBottom: 10,
    },
    modalButtonConfirm: {
      backgroundColor: '#00FF00',
      marginBottom: 10,
    },
    modalButtonDelet: {
      backgroundColor: '#FF0000',
      marginBottom: 10,
    },
  });
  
  