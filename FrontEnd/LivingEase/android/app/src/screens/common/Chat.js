import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import apiClient from '../../../../../apiClient';
import Colors from '../../constants/Colors';
import fonts from '../../constants/Font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import io from 'socket.io-client';

const Chat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {senderId, receiverId} = route.params;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [receiverName, setReceiverName] = useState({
    firstName: '',
    lastName: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // For image modal
  const socket = io('http://10.0.2.2:5000'); // Replace with your socket server URL

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.get(
          `/messages/${senderId}/${receiverId}`,
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReceiverDetails = async () => {
      try {
        const response = await apiClient.get(`/user/users/${receiverId}`);
        const {firstName, lastName} = response.data;
        setReceiverName({firstName, lastName});

        navigation.setOptions({
          headerTitle: `${firstName} ${lastName}`,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            marginTop: 10,
            fontFamily: fonts.semiBold,
            fontSize: 20,
            color: Colors.blue,
          },
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    // Mark messages as read when the component mounts or messages are fetched
    const markMessagesAsRead = async () => {
      try {
        console.log('marking as read by',senderId,receiverId)
        await apiClient.post('/messages/markAsRead', {
          userId: senderId,
          senderId: receiverId,
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    fetchMessages();
    fetchReceiverDetails();
    markMessagesAsRead();

    socket.on('newMessage', message => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [senderId, receiverId, navigation]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' && attachments.length === 0) return;

    const formData = new FormData();
    formData.append('senderId', senderId);
    formData.append('receiverId', receiverId);
    formData.append('text', newMessage);

    attachments.forEach((attachment, index) => {
      const fileObject = {
        uri:
          Platform.OS === 'android'
            ? attachment.uri
            : attachment.uri.replace('file://', ''),
        type: attachment.type || 'image/jpeg',
        name: attachment.fileName || `photo_${index}.jpg`,
      };
      formData.append('attachments[]', fileObject);
    });

    try {
      const response = await apiClient.post(`/messages/send`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      socket.emit('sendMessage', response.data.newMessage);
      setMessages(prevMessages => [...prevMessages, response.data.newMessage]);
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message with attachment:', error);
    }

    setNewMessage('');
  };

  const handleAttachment = () => {
    if (attachments.length >= 5) {
      Alert.alert('Limit Exceeded', 'You can only upload up to 5 photos.');
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        selectionLimit: 5 - attachments.length,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.error('ImagePicker Error: ', response.error);
        } else {
          setAttachments(prev => [...prev, ...response.assets]);
        }
      },
    );
  };

  const removeAttachment = indexToRemove => {
    setAttachments(prevAttachments =>
      prevAttachments.filter((_, index) => index !== indexToRemove),
    );
  };

  const openImageModal = uri => {
    setSelectedImage(uri); // Open modal with selected image
  };

  const closeImageModal = () => {
    setSelectedImage(null); // Close modal
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          const isSender = item.senderId === senderId; // Check if the message is from the sender
          return (
            <View
              style={
                isSender ? styles.senderContainer : styles.receiverContainer
              }>
              {item.text && (
                <View
                  style={
                    isSender ? styles.senderMessage : styles.receiverMessage
                  }>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
              {item.attachments && item.attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {item.attachments.map((attachment, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => openImageModal(attachment.uri)}>
                      <Image
                        source={{uri: attachment.uri}}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />

      <View style={styles.attachmentsContainer}>
        {attachments.map((attachment, index) => (
          <View key={index} style={styles.attachmentWrapper}>
            <Image source={{uri: attachment.uri}} style={styles.attachment} />
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => removeAttachment(index)}>
              <Icon name="cancel" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handleAttachment}>
          <Icon name="attach-file" size={32} color={Colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <Icon name="send" size={32} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Modal for displaying full-size image */}
      {selectedImage && (
        <Modal visible={true} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={closeImageModal}>
              <Icon name="close" size={30} color={Colors.white} />
            </TouchableOpacity>
            <Image source={{uri: selectedImage}} style={styles.fullImage} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  senderContainer: {
    alignItems: 'flex-end', // Align sender messages to the right
    marginBottom: 10,
  },
  receiverContainer: {
    alignItems: 'flex-start', // Align receiver messages to the left
    marginBottom: 10,
  },
  senderMessage: {
    backgroundColor: Colors.lightgrey,
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  receiverMessage: {
    backgroundColor: Colors.lightgrey, // Use a different color for received messages
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  attachmentWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  attachment: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  removeIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  tenantMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.lightgrey,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontFamily: fonts.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightgrey,
    padding: 10,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontFamily: fonts.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullImage: {
    width: '100%',
    height: '50%',
    borderRadius: 10,
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});

export default Chat;
