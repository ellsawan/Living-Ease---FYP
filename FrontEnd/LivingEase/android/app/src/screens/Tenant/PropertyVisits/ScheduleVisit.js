import React, {useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import apiClient from '../../../../../../apiClient';
import commonStyles from '../../../constants/styles';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Font';

const ScheduleVisit = () => {
  const navigation = useNavigation(); // Get navigation object
  const route = useRoute(); // Access route parameters
  const {propertyId, ownerId, tenantId} = route.params;
  const currentDate = new Date(); // Get the current date

  // Initialize states with default values
  const [selectedDate, setSelectedDate] = useState(
    currentDate.toISOString().split('T')[0],
  ); // Default to current date
  const [selectedHour, setSelectedHour] = useState('1');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedAmPm, setSelectedAmPm] = useState('AM');

  const hours = [...Array(12).keys()].map(i => (i + 1).toString());
  const minutes = ['00', '15', '30', '45'];
  const amPm = ['AM', 'PM'];

  const handleDateChange = date => {
    setSelectedDate(date.dateString);
  };

  const handleScheduleVisit = async () => {
    const appointmentTime = `${selectedHour}:${selectedMinute} ${selectedAmPm}`;

    try {
      const response = await apiClient.post('/appointment/appointments', {
        tenantId,
        propertyId,
        ownerId,
        appointmentDate: selectedDate,
        appointmentTime,
      });

      Alert.alert('Success', 'Visit request is sent to landlord.');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response
          ? error.response.data.message
          : 'Error scheduling appointment',
      );
    }
  };

  const renderTimeSelector = (data, selectedValue, setValue) => (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[
            styles.timeSlot,
            selectedValue === item && styles.selectedTimeSlot,
          ]}
          onPress={() => {
            setValue(item);
          }}>
          <Text
            style={[
              styles.timeSlotText,
              selectedValue === item && styles.selectedTimeSlotText,
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={50} // Ensure this matches the height of each item
      showsVerticalScrollIndicator={false}
      style={styles.flatList}
      contentContainerStyle={{alignItems: 'center'}}
      pagingEnabled
      onMomentumScrollEnd={event => {
        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(contentOffsetY / 50); // Round to the nearest index

        if (index >= 0 && index < data.length) {
          setValue(data[index]);
        }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Date:</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          minDate={currentDate.toISOString().split('T')[0]}
          onDayPress={handleDateChange}
          markedDates={{
            [selectedDate]: {selected: true, marked: true},
          }}
          theme={{
            arrowColor: Colors.primary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: Colors.primary,
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 16,
            textDayHeaderFontFamily: Fonts.bold,
            textMonthFontFamily: Fonts.bold,
            textDayFontFamily: Fonts.semiBold,
          }}
        />
      </View>

      <Text style={styles.title}>Select a Time:</Text>

      <View style={styles.timePickerContainer}>
        {renderTimeSelector(hours, selectedHour, setSelectedHour)}
        {renderTimeSelector(minutes, selectedMinute, setSelectedMinute)}
        {renderTimeSelector(amPm, selectedAmPm, setSelectedAmPm)}
      </View>

      <TouchableOpacity
        style={[commonStyles.button, {marginTop: 40}]}
        onPress={handleScheduleVisit}>
        <Text style={commonStyles.buttonText}>Schedule Visit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginVertical: 10,
    color: Colors.darkText,
  },
  calendarContainer: {
    borderWidth: 5,
    borderColor: Colors.gray,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: Colors.lightgrey,
  },
  flatList: {
    height: 50, // Ensure this matches the height of each item
    width: 70,
  },
  timeSlot: {
    height: 40, // Fixed height for each time slot
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.lightgrey,
  },
  timeSlotText: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.darkText,
  },
  selectedTimeSlotText: {
    color: Colors.blue,
  },
});

export default ScheduleVisit;
