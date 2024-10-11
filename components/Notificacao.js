import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, Animated } from 'react-native';
import { TextInput, Button, Snackbar, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';
import { db } from "../services/connectionFirebase";
import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";

const Separator = () => <View style={styles.separator} />;

const theme = {
  colors: {
    primary: '#F6AA43',
  },
};

export default function Products() {
  const [mensagem, setMensagem] = useState("");
  const [descricao, setDescricao] = useState("");
  const [key, setKey] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [orderBy, setOrderBy] = useState('mensagem');

  // Estado para controlar a animação da barra de progresso
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    search();
  }, []);

  async function search() {
    try {
      const querySnapshot = await getDocs(collection(db, 'notificacao'));
      const notificationsData = [];
      querySnapshot.forEach(doc => {
        notificationsData.push({ key: doc.id, ...doc.data() });
      });
      setNotifications(notificationsData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      setSnackbarMessage('Erro ao buscar notificações!');
      setSnackbarVisible(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    const sortedNotifications = [...notifications].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return -1;
      if (a[orderBy] > b[orderBy]) return 1;
      return 0;
    });
    setNotifications(sortedNotifications);
  }, [orderBy]);

  async function insertUpdate() {
    try {
      if (mensagem && descricao) {
        const notificationsCollectionRef = collection(db, 'notificacao');
        const notificationData = {
          mensagem: mensagem,
          descricao: descricao,
        };

        if (key) {
          await updateDoc(doc(db, 'notificacao', key), notificationData);
          const updatedNotifications = notifications.map(notification =>
            notification.key === key ? { ...notification, ...notificationData } : notification
          );
          setNotifications(updatedNotifications);
          setSnackbarMessage('Notificação atualizada!');
        } else {
          await addDoc(notificationsCollectionRef, notificationData);
          setSnackbarMessage('Notificação inserida!');
        }
        search();
        setSnackbarVisible(true);
        clearData();
        setModalVisible(false);

        // Exibir a notificação na parte superior da tela
        showTopNotification(mensagem); // Chamada para exibir notificação

        // Animação da barra de progresso
        animateProgressBar();
      } else {
        setSnackbarMessage('Preencha todos os campos obrigatórios!');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Erro ao inserir/atualizar notificação:", error);
      setSnackbarMessage('Erro ao inserir/atualizar notificação!');
      setSnackbarVisible(true);
    }
  }

  function showTopNotification(message) {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  }

  function promptDelete(key) {
    setSelectedNotification(key);
    setConfirmationModalVisible(true);
  }

  async function confirmDelete() {
    try {
      await deleteDoc(doc(db, 'notificacao', selectedNotification));
      const updatedNotifications = notifications.filter(item => item.key !== selectedNotification);
      setNotifications(updatedNotifications);
      setSnackbarMessage('Notificação excluída!');
      setSnackbarVisible(true);
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
      setSnackbarMessage('Erro ao excluir notificação!');
      setSnackbarVisible(true);
    }
  }

  function handleEdit(data) {
    setKey(data.key);
    setMensagem(data.mensagem);
    setDescricao(data.descricao);
    setModalVisible(true);
  }

  function clearData() {
    setKey('');
    setMensagem('');
    setDescricao('');
  }

  const handleOrderByChange = (value) => {
    setOrderBy(value);
  };

  // Função para animar a barra de progresso
  const animateProgressBar = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // Duração da animação em milissegundos (10 segundos)
      useNativeDriver: false,
    }).start(() => {
      // Limpar barra de progresso após a animação
      progress.setValue(0);
      setSnackbarVisible(false); // Esconder o Snackbar após a animação
    });
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>
        <Button style={styles.buttonAddP} mode="contained" onPress={() => { setModalVisible(true); clearData(); }}>Adicionar Notificação</Button>
        <Separator />
        <View style={styles.orderByContainer}>
          <Text style={styles.listar}>Notificações</Text>
        </View>
        {loading ? (
          <ActivityIndicator color="#121212" size={45} />
        ) : (
          <FlatList
            keyExtractor={item => item.key}
            data={notifications}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.title}>{item.mensagem}</Text>
                <Text>{item.descricao}</Text>

                <Button onPress={() => promptDelete(item.key)}>Excluir</Button>
              </View>
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
                placeholder="Mensagem"
                maxLength={40}
                style={styles.input}
                onChangeText={(texto) => setMensagem(texto)}
                value={mensagem}
              />
              <Separator />
              <TextInput
                placeholder="Descrição"
                style={styles.input}
                onChangeText={(texto) => setDescricao(texto)}
                value={descricao}
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
              <Text>Tem certeza que deseja excluir esta notificação?</Text>
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
            duration={Snackbar.DURATION_LONG} // Duração aumentada para 15 segundos
            style={styles.snackbar}
            wrapperStyle={styles.snackbarWrapper}
      >
        <View style={styles.snackbarWrapper}>
          <Text style={styles.snackbarMessage}>{snackbarMessage}</Text>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'],
                }),
              },
            ]}
          />
        </View>
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
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
  snackbarWrapper: {
    top: 0,
  },
  snackbar: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'purple',
    borderWidth: 2,
  },
  snackbarContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressBar: {
    height: 2,
    backgroundColor: 'red',
    marginTop: 5,
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

