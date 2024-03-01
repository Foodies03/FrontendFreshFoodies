import React, { useCallback, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { PieChart, BarChart } from 'react-native-chart-kit';

const AnalyticsScreen = (navigation) => {
  const nav = useNavigation();
  
  // Sample data for food waste
  const foodWasteData = [
    { name: 'Meat', percentage: 20, color: '#FF0000' },
    { name: 'Vegetables', percentage: 20, color: '#FFC531' },
    { name: 'Fruit', percentage: 60, color: '#13DF73' }
  ];

  // Sample data for poultry waste
  const poultryWasteData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr',],
    datasets: [{
      data: [4, 2, 1, 3],
      color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`
    }]
  };

  // Sample data for cost savings
  const costSavingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr',],
    datasets: [{
      data: [10, 22, 20, 22],
      color: (opacity = 1) => `rgba(255, 159, 64, ${opacity})`
    }]
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Analytics</Text>
      <View style={styles.container}>
        {/* Cylinder */}
        <View style={[styles.cylinder, styles.cylinderContainer]}>
          <View style={styles.cylinderYellow}>
            <Text style={[styles.cylinderText, styles.whiteText]}>Week</Text>
          </View>
          <Text style={styles.cylinderText}>Month</Text>
          <Text style={styles.cylinderText}>3M</Text>
          <Text style={styles.cylinderText}>6M</Text>
          <Text style={styles.cylinderText}>Year</Text>
          <Text style={styles.cylinderText}>All</Text>
        </View>
        {/* Food Waste Module */}
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
      </View>
      <View style={styles.containerBar}>
      <View style={styles.sideBySideContainer}>
        {/* Poultry Waste Module */}
        <View style={styles.sideBySideModule}>
          <View style={styles.moduleTitleContainer}>
            <Text style={styles.moduleTitle}>Poultry Waste lbs</Text>
          </View>
          <BarChart
            data={poultryWasteData}
            width={160}
            height={200}
            yAxisLabel="lbs"
            withHorizontalLabels={false}
            withInnerLines={false}
            showValuesOnTopOfBars={true}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 0) => `rgba(255, 76, 76, ${opacity})`
            }}
            style={styles.barChart}
            fromZero={true}
            
          />
        </View>

        {/* Cost Savings Module */}
        <View style={styles.sideBySideModule}>
        <View style={styles.moduleTitleContainer}>
          <Text style={styles.moduleTitle}>Cost Savings $</Text>
        </View>
          <BarChart
            data={costSavingsData}
            width={160}
            height={200}
            yAxisLabel="$"
            withHorizontalLabels={false}
            withInnerLines={false}
            showValuesOnTopOfBars={true}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(65, 130, 255, ${opacity})`
            }}
            style={styles.barChart}
            fromZero={true}
          />
        </View>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#2FC6B7",
  },
  container: {
    paddingTop: 52,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
  },
  containerBar: {
    backgroundColor: '#fff',
    paddingRight: 10,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: "1%",
  },
  module: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
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
  cylinderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    paddingRight: 15,
  },
  cylinder: {
    width: 365,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#E0E0E0', // Gray color
    justifyContent: 'center',
    alignItems: 'center',
  },
  cylinderYellow: {
    width: 60,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#FFC531',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cylinderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  whiteText: {
    color: '#FFFFFF',
  },
});

export default AnalyticsScreen;
