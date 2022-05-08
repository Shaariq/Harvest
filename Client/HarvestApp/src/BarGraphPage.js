import React, {useState, useRef, useEffect} from 'react';

import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';

import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryLegend,
} from 'victory-native';

import SelectDropdown from 'react-native-select-dropdown';

export default function BarGraphPage({navigation, route}) {
  const {userIDToken, userAccessToken, authUsername, userID} = route.params;

  const [filterIsApplied, setFilterIsApplied] = useState(false);
  const [renderGraph, setRenderGraph] = useState(false);
  const [dateLabels, setDateLabels] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [refresh, setRefresh] = useState(true);

  const produceRef = useRef({});
  const TimePeriods = [
    'One Year',
    'Six Months',
    'Three Months',
    'One Month',
    'One Week',
  ];
  const Levels = ['Supertype', 'Type', 'Subtype', 'Food'];
  const Supertypes = ['Vegetable', 'Fruit', 'Herb', 'Flower'];
  const Types = [
    'Allium',
    'Berry',
    'Citrus',
    'Cruciferous',
    'Cucurbit',
    'False Fruit',
    'Flower',
    'Leaf',
    'Legume',
    'Nightshade',
    'Nut',
    'Pome Fruit',
    'Root',
    'Seed',
    'Soft Herb',
    'Stalk',
    'Stone Fruit',
    'Vine Fruit',
    'Hard Herb',
  ];
  const Subtypes = [
    'Almond',
    'Apple',
    'Artichoke',
    'Aubergine',
    'Basil',
    'Bean',
    'Beetroot',
    'Blackberry',
    'Blueberry',
    'Broccoli',
    'Cabbage',
    'Carrot',
    'Cauliflower',
    'Celery',
    'Chilli',
    'Chive',
    'Coriander',
    'Cucumber',
    'Curry Leaf',
    'Edible Flower',
    'Fennel',
    'Fig',
    'Ginger',
    'Gooseberry',
    'Granadilla',
    'Grape',
    'Grapefruit',
    'Jerusalem Artichoke',
    'Kale',
    'Kei Apple',
    'Leek',
    'Lemon',
    'Lemon Balm',
    'Lemon Verbena',
    'Lettuce',
    'Lime',
    'Marjoram',
    'Mint',
    'Mustard Leaf',
    'Naartjie',
    'Nasturtium',
    'Onion',
    'Orange',
    'Oregano',
    'Parsley',
    'Pea',
    'Peach',
    'Pepper',
    'Plum',
    'Pumpkin',
    'Radish',
    'Rhubarb',
    'Rosemary',
    'Sage',
    'Sorrel',
    'Spinach',
    'Squash',
    'Strawberry',
    'Sunflower Seed',
    'Sweet Potato',
    'Thyme',
    'Tomato',
    'Turmeric',
    'Turnip',
    'Zucchini',
  ];

  const [timePeriod, setTimePeriod] = useState(null);
  const [level, setLevel] = useState(null);
  const [produce, setProduce] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getData = async () => {
    let headerLevel, headerTime, headerPeriod, headerProduce;

    if (timePeriod === 'One Year') {
      headerTime = 1;
      headerPeriod = 'year';
    } else if (timePeriod === 'Six Months') {
      headerTime = 6;
      headerPeriod = 'month';
    } else if (timePeriod === 'Three Months') {
      headerTime = 3;
      headerPeriod = 'month';
    } else if (timePeriod === 'One Month') {
      headerTime = 1;
      headerPeriod = 'month';
    } else if (timePeriod === 'One Week') {
      headerTime = 7;
      headerPeriod = 'day';
    }

    if (level === 'Supertype') {
      headerLevel = 'Superdupertype';
    } else if (level === 'Type') {
      headerLevel = 'Supertype';
    } else if (level === 'Subtype') {
      headerLevel = 'Type';
    } else if (level === 'Food') {
      headerLevel = 'Subtype';
    }

    headerProduce = produce;

    return fetch('https://harvest-stalkoverflow.herokuapp.com/api/private', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userAccessToken,
        RequestType: 'GetFilteredLogs',
        userID: userID,
        Time: headerTime,
        Period: headerPeriod,
        Level: headerLevel,
        Produce: headerProduce,
      },
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        return json;
      })
      .catch(error => {
        console.log(error);
      });
  };

  let testData_0 = [
    ['January', ['Blueberry', 30], ['Blackberry', 10], ['Strawberry', 34]],
    ['February', ['Blueberry', 36], ['Blackberry', 17], ['Strawberry', 42]],
    ['March', ['Blueberry', 12], ['Blackberry', 20], ['Strawberry', 23]],
    ['April', ['Blueberry', 34], ['Blackberry', 34], ['Strawberry', 24]],
    ['May', ['Blueberry', 12], ['Blackberry', 12], ['Strawberry', 44]],
    ['June', ['Blueberry', 14], ['Blackberry', 53], ['Strawberry', 13]],
  ];

  let testData_1 = [
    ['Monday', ['Green Apple', 30], ['Red Apple', 10]],
    ['Tuesday', ['Green Apple', 36], ['Red Apple', 17]],
    ['Wednesday', ['Green Apple', 12], ['Red Apple', 20]],
    ['Thursday', ['Green Apple', 34], ['Red Apple', 34]],
    ['Friday', ['Green Apple', 12], ['Red Apple', 12]],
    ['Saturday', ['Green Apple', 12], ['Red Apple', 12]],
    ['Sunday', ['Green Apple', 14], ['Red Apple', 53]],
  ];

  // This function will process the data returned from the API
  const parseData = arr => {
    let dates = [];
    let completeData = [];
    for (let i in arr) {
      dates.push({name: i});
      let incompleteData = [];
      for (let j in arr[i]) {
        incompleteData.push({x: j, y: arr[i][j]});
      }
      completeData.push(incompleteData);
    }
    setDateLabels(dates);
    setGraphData(completeData);
  };

  const renderBarGraph = async () => {
    getData()
      .then(json => {
        parseData(json);
      })
      .then(() => {
        setFilterIsApplied(true);
      });
  };

  useEffect(() => {
    console.log("Refreshing")
    renderBarGraph();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.iconView}>
        <TouchableOpacity onPress={navigation.openDrawer}>
          <Image
            style={{
              height: 20,
              width: 20,
            }}
            source={require('../assets/hamburger-icon.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalOpen(true)}>
          <Image
            style={{
              height: 20,
              width: 20,
              marginRight: 20,
            }}
            source={require('../assets/filter.png')}
          />
        </TouchableOpacity>
      </View>
      <Modal visible={modalOpen} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.modalView}>
          <View>
            <TouchableOpacity onPress={() => setModalOpen(false)}>
              <Image
                style={{
                  height: 15,
                  width: 15,
                  marginLeft: 200,
                  marginBottom: 40,
                }}
                source={require('../assets/close-icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.filterView}>
            <Text style={styles.filterText}>Time Period:</Text>

            <SelectDropdown
              data={TimePeriods}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setTimePeriod(selectedItem);
              }}
              defaultButtonText={'Select an option'}
              buttonTextAfterSelection={(selectedItem, index) => {
                console.log('this is the date: ' + timePeriod);
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                borderWidth: 2,
                borderColor: '#A1E8Af',
                backgroundColor: '#fff',
                borderRadius: 10,
              }}
              buttonTextStyle={{color: '#A1E8Af'}}
              dropdownOverlayColor={'rgba(255, 255, 255, 0)'}
              dropdownStyle={{
                marginTop: 1,
                borderRadius: 10,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#A1E8Af',
              }}
              rowStyle={{
                borderWidth: 0,
                borderColor: '#A1E8Af',
                backgroundColor: '#fff',
                borderBottomWidth: 0,
                borderTopWidth: 0,
                marginLeft: 10,
                marginRight: 10,
              }}
              rowTextStyle={{color: '#A1E8Af'}}
            />
          </View>
          <View style={styles.filterView}>
            <Text style={styles.filterText}>Level:</Text>
            <SelectDropdown
              data={Levels}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                produceRef.current.reset();
                setLevel(selectedItem);
              }}
              defaultButtonText={'Select an option'}
              buttonTextAfterSelection={(selectedItem, index) => {
                console.log('this is the level: ' + level);
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                borderWidth: 2,
                borderColor: '#A1E8Af',
                backgroundColor: '#fff',
                borderRadius: 10,
              }}
              buttonTextStyle={{color: '#A1E8Af'}}
              dropdownOverlayColor={'rgba(255, 255, 255, 0)'}
              dropdownStyle={{
                marginTop: 1,
                borderRadius: 10,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#A1E8Af',
              }}
              rowStyle={{
                borderWidth: 0,
                borderColor: '#A1E8Af',
                backgroundColor: '#fff',
                borderBottomWidth: 0,
                borderTopWidth: 0,
                marginLeft: 10,
                marginRight: 10,
              }}
              rowTextStyle={{color: '#A1E8Af'}}
            />
          </View>
          <View style={styles.filterView}>
            <Text style={styles.filterText}>Produce:</Text>
            <SelectDropdown
              data={
                level === 'Supertype'
                  ? ['---']
                  : level === 'Type'
                  ? Supertypes
                  : level === 'Subtype'
                  ? Types
                  : level === 'Food'
                  ? Subtypes
                  : ['---']
              }
              ref={produceRef}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
                setProduce(selectedItem);
              }}
              defaultButtonText={'Select an option'}
              buttonTextAfterSelection={(selectedItem, index) => {
                console.log('this is the produce: ' + produce);
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{
                borderWidth: 2,
                borderColor: '#A1E8Af',
                backgroundColor: '#fff',
                borderRadius: 10,
              }}
              buttonTextStyle={{color: '#A1E8Af'}}
              dropdownOverlayColor={'rgba(255, 255, 255, 0)'}
              dropdownStyle={{
                marginTop: 1,
                borderRadius: 10,
                backgroundColor: '#fff',
                borderWidth: 2,
                borderColor: '#A1E8Af',
              }}
              rowStyle={{
                borderWidth: 0,
                borderColor: '#A1E8Af',
                backgroundColor: '#fff',
                borderBottomWidth: 0,
                borderTopWidth: 0,
                marginLeft: 10,
                marginRight: 10,
              }}
              rowTextStyle={{color: '#A1E8Af'}}
            />
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                console.log('Filter has been applied');
                setModalOpen(false);
                setRefresh(!refresh)
              }}>
              <Text style={styles.filterButton}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <View style={styles.graphView}>
        {filterIsApplied && graphData.length > 0 ? (
          <VictoryChart
            domainPadding={75}
            height={300}
            width={400}
            animate={{duration: 1000, easing: 'linear'}}>
            <VictoryLegend
              x={125}
              y={5}
              centerTitle
              orientation="horizontal"
              gutter={25}
              data={dateLabels}
              colorScale={[
                '#A1E8AF',
                '#4A7C59',
                '#A5BE00',
                '#717744',
                '#245501',
                '#73A942',
                '#AAD576',
                '#1A4301',
                '#909955',
                '#4F772D',
                '#33772C',
                '#132A13',
              ]}
            />
            <VictoryGroup
              offset={-15}
              colorScale={[
                '#A1E8AF',
                '#4A7C59',
                '#A5BE00',
                '#717744',
                '#245501',
                '#73A942',
                '#AAD576',
                '#1A4301',
                '#909955',
                '#4F772D',
                '#33772C',
                '#132A13',
              ]}>
              {graphData.map((item, index) => {
                return <VictoryBar key={index} data={item} barWidth={15} />;
              })}
            </VictoryGroup>
            <VictoryAxis dependentAxis/>
            <VictoryAxis
              style={{tickLabels: {angle: 30, transform: 'translate(1, 4)'}}}
            />
          </VictoryChart>
        ) : graphData.length == 0 ? (
          <Text>No Data to display</Text>
        ) : (
          <Text>Apply Filter Please</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drop_down: {
    backgroundColor: 'black',
    borderRadius: 2,
    borderBottomWidth: 0.5,
    padding: 2,
  },
  Filter_View: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  Popup_View: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: 'black',
    width: 230,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filter: {
    marginTop: -20,
    height: 0,
    width: 0,
    marginLeft: 350,
    backgroundColor: 'red',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconView: {
    flex: 0.1,
    flexDirection: 'row',
    paddingTop: 20,
    marginLeft: 20,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  graphView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeading: {
    color: '#000',
    fontSize: 35,
  },
  text: {
    color: '#000',
    fontSize: 25,
  },
  button: {
    margin: 15,
    padding: 15,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#A1E8AF',
  },
  modalView: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 500,
    width: 300,
    borderRadius: 30,
    marginTop: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  filterText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 5,
  },
  filterView: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    marginTop: 10,
  },
});