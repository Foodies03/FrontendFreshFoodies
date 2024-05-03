import React, { useCallback, useEffect, useRef } from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getEntries } from "./utils/HttpUtils";

const AnalyticsScreen = (navigation) => {
  const nav = useNavigation();

  const [entries, setEntries] = React.useState([])
  const [wasteEntries, setWasteEntries] = React.useState([])
  const [usedEntries, setUsedEntries] = React.useState([])
  const [timeFrame, setTimeFrame] = React.useState(7)
  const [meatWaste, setMeatWaste] = React.useState([])
  const [veggieWaste, setVeggieWaste] = React.useState([])
  const [fruitWaste, setFruitWaste] = React.useState([])
  const [otherWaste, setOtherWaste] = React.useState([])
  const [meatPercentage, setMeatPercentage] = React.useState(25)
  const [veggiePercentage, setVeggiePercentage] = React.useState(25)
  const [fruitPercentage, setFruitPercentage] = React.useState(25)
  const [otherPercentage, setOtherPercentage] = React.useState(25)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const tempEntries = await getEntries(timeFrame)
        setEntries(tempEntries)
        const tempUsed = tempEntries.filter(entry => entry.entry_type === 'used')

        const tempWaste = tempEntries.filter(entry => entry.entry_type === 'discarded')

        const meats = tempWaste.filter(entry => entry.category === 'Meat')
        const veggies = tempWaste.filter(entry => entry.category === 'Vegetable')
        const fruits = tempWaste.filter(entry => entry.category === 'Fruit')
        const others = tempWaste.filter(entry => entry.category !== 'Vegetable' ||
                                              entry.category !== 'Fruit' ||
                                              entry.category !== 'Meat')
        setMeatWaste(meats)
        setVeggieWaste(veggies)
        setFruitWaste(fruits)
        setOtherWaste(others)
        setWasteEntries(tempWaste)
        setUsedEntries(tempUsed)
      } catch {
        console.log('failed to get entries')
      }
    }

    fetchEntries()
  }, [timeFrame])

  useEffect(() => {
    calculateWasteData()
    console.log("Sum: " + calculateChartData('wasted', 'Other'))
  }, [wasteEntries])

  const calculateWasteData = () => {
    const totalNum = wasteEntries.length
    if (totalNum > 0) {
      setMeatPercentage(meatWaste.length / totalNum)
      setVeggiePercentage(veggieWaste.length / totalNum)
      setFruitPercentage(fruitWaste.length / totalNum)
      setOtherPercentage(otherWaste.length / totalNum)
    } else {
      setMeatPercentage(0)
      setVeggiePercentage(0)
      setFruitPercentage(0)
      setOtherPercentage(0)
    }
  }

  const calculateChartData = (type, category) => {
    const chartData = {}
    const tempEntries = type === 'saved' ? usedEntries : wasteEntries ;
    if (tempEntries.length <= 0) {
      return 0;
    }
    let data;
    if (category === 'Meat') {
      data = tempEntries.filter((e) => e.category === 'Meat')
    } else if (category === 'Vegetable') {
      data = tempEntries.filter((e) => e.category === 'Vegetable')
    } else if (category === 'Fruit') {
      data = tempEntries.filter((e) => e.category === 'Fruit')
    } else if (category === 'Other') {
      data = tempEntries.filter((e) => e.category !== 'Vegetable' ||
                                       e.category !== 'Fruit' ||
                                       e.category !== 'Meat')
    } else if (category === 'All') {
      data = tempEntries
    }
    const date = new Date()
    date.setTime(date.getDate() - timeFrame)
    const x = data.filter((e) => new Date(e.creation_time) > date)
    let sum;
    if (type === 'saved') {
      sum = x.reduce((total, curr) => {
        return total + curr.cost_per_unit
      }, 0) / 100.00
    } else {
      sum = x.reduce((total, curr) => {
        return total + curr.amount
      }, 0)
    }
    return sum;
  }

  // Sample data for food waste
  const foodWasteData = [
    { name: 'Meat', percentage: meatPercentage, color: '#FF0000' },
    { name: 'Vegetables', percentage: veggiePercentage, color: '#FFC531' },
    { name: 'Fruit', percentage: fruitPercentage, color: '#13DF73' },
    { name: 'Other', percentage: otherPercentage, color: 'grey'}
  ];

  return (
    <View style={styles.page}>
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={() => setTimeFrame(7)} style={[styles.optionsButton,timeFrame === 7 && styles.selectedButton]}>
              <Text style={[styles.optionsText, timeFrame === 7 && styles.selectedOption]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTimeFrame(31)} style={[styles.optionsButton, timeFrame === 31 && styles.selectedButton]}>
              <Text style={[styles.optionsText, timeFrame === 31 && styles.selectedOption]}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTimeFrame(90)} style={[styles.optionsButton, timeFrame === 90 && styles.selectedButton]}>
              <Text style={[styles.optionsText, timeFrame === 90 && styles.selectedOption]}>3M</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTimeFrame(180)} style={[styles.optionsButton, timeFrame === 180 && styles.selectedButton]}>
              <Text style={[styles.optionsText, timeFrame === 180 && styles.selectedOption]}>6M</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTimeFrame(365)} style={[styles.optionsButton, timeFrame === 365 && styles.selectedButton]}>
              <Text style={[styles.optionsText, timeFrame === 365 && styles.selectedOption]}>Year</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTimeFrame(10000)} style={[styles.optionsButton, timeFrame === 10000 && styles.selectedButton]}>
              <Text style={[styles.optionsText, timeFrame === 10000 && styles.selectedOption]}>All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.module}>
              <View style={styles.moduleTitleContainer}>
                <Text style={styles.moduleTitle}>Food Waste</Text>
              </View>
              <PieChart
                data={foodWasteData}
                width={345}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                }}
                accessor="percentage"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
            <View style={styles.module}>
              <View style={styles.moduleTitleContainer}>
                <Text style={styles.moduleTitle}>Cost Savings</Text>
              </View>
              <Text style={styles.centralText}>${calculateChartData('saved', 'All')} saved</Text>
            </View>
            <View style={styles.containerBar}>
              <View style={styles.sideBySideContainer}>
                <View style={styles.sideBySideModule}>
                  <View style={styles.moduleTitleContainer}>
                    <Text style={styles.moduleTitle}>Meat Waste</Text>
                  </View>
                  <Text style={styles.centralText}>{calculateChartData('discarded', 'Meat')} units</Text>
                </View>
                  <View style={styles.sideBySideModule}>
                    <View style={styles.moduleTitleContainer}>
                      <Text style={styles.moduleTitle}>Vegetable Waste</Text>
                    </View>
                    <Text style={styles.centralText}>{calculateChartData('discarded', 'Vegetable')} units</Text>
                </View>
              </View>
            </View>
            <View style={styles.containerBar}>
              <View style={styles.sideBySideContainer}>
                <View style={styles.sideBySideModule}>
                  <View style={styles.moduleTitleContainer}>
                    <Text style={styles.moduleTitle}>Fruit Waste</Text>
                  </View>
                  <Text style={styles.centralText}>{calculateChartData('discarded', 'Fruit')} units</Text>
                </View>
                  <View style={styles.sideBySideModule}>
                    <View style={styles.moduleTitleContainer}>
                      <Text style={styles.moduleTitle}>Other Waste</Text>
                    </View>
                    <Text style={styles.centralText}>{calculateChartData('discarded', 'Other')} units</Text>
                </View>
              </View>
            </View>
          </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff'
  },
  container: {
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  containerBar: {
    backgroundColor: '#fff',
    paddingRight: 10,
    paddingVertical: 10
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: "1%",
  },
  module: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    alignSelf: 'center',
    color: '#fff',
  },
  moduleTitleContainer: {
    backgroundColor: '#1CC16A',
    borderRadius: 30,
  },
  barChart: {
    paddingRight: -10,
  },
  sideBySideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sideBySideModule: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
  },
  optionsButton: {
    padding: 9,
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: '#F7B200'
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 30,
    paddingHorizontal: 25
  },
  optionsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedOption: {
    color: '#FFFFFF',
  },
  centralText: {
    fontSize: 28,
    alignSelf: 'center',
    paddingVertical: 35,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default AnalyticsScreen;
