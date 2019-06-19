import React,{Component} from 'react';
import {ScrollView, View, StyleSheet, Text, FlatList, Button, Animated} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {ListItem} from 'react-native-elements';
import {MaterialCommunityIcons as Icon} from 'react-native-vector-icons';
import MLBGameDayApi from './../api/MLBGameDayApi';
import {DateBar} from '../components/app';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class HomeScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading:false,
      date:new Date(),
      games:[],
      isExpanded:false
    };
    this.chevronRotation = new Animated.Value(0);
    this.listItemHeight = new Animated.Value(0);
  }
  componentDidMount(){
    this.getGamesForDay(this.state.date);
  }
  getGamesForDay = (date) =>{
    this.setState({isLoading:true});
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    MLBGameDayApi.getAllGameDataForDay(year,month,day).then(function(data){
      this.setState({games:data});
      this.setState({isLoading:false})
    }.bind(this))
  }
  onDateChange = date => {
    this.setState({date});
    this.getGamesForDay(date);
  }
  onListItemPress = (item) =>{
    var chevronToValue = (this.state.isExpanded) ? 0 : 1;
    Animated.timing(this.chevronRotation,{
      toValue:chevronToValue, duration:300
    }).start();
    var heightToValue = (this.state.isExpanded) ? 0 : 100;
    Animated.timing(this.listItemHeight,{
      toValue:heightToValue, duration:300
    }).start();
    this.setState({isExpanded:!this.state.isExpanded});
  }
  getChevronRotateStyle = () =>{
    const rotate = this.chevronRotation.interpolate({
      inputRange:[0,1],
      outputRange:['0deg','95deg']
    });
    return{transform:[{rotate:rotate}]};
  }
  onVideosPress = (item) =>{
    this.props.navigation.navigate('Videos',{item:item});
  }
  renderSubtitle = (item) =>{
    return(
      <Animated.View style={{height:this.listItemHeight,paddingVertical:20}}>
      </Animated.View>
    );
  }
  renderListItem = ({item}) =>{
    const subtitle = this.renderSubtitle(item);
    const chevronStyle = this.getChevronRotateStyle();
    const title = (
      <View>
        <Text>{item.time}</Text>
        <View style={styles.holder}>
          <View style={styles.width}>
            <Text style={styles.team}>{item.away_fname}</Text>
            <Text style={styles.winsLoss}>{item.away_wins} - {item.away_loss}</Text>
          </View>
          <Text style={styles.runs}>{item.away_team_runs}</Text>
        </View>
        <View style={styles.holder}>
          <View style={styles.width}>
            <Text style={styles.team}>{item.home_fname}</Text>
            <Text style={styles.winsLoss}>{item.home_wins} - {item.home_loss}</Text>
          </View>
          <Text style={styles.runs}>{item.home_team_runs}</Text>
        </View>
      </View>
    )
    return(
      <ListItem key={item.key} title={title} subtitle={subtitle} onPress={this.onListItemPress} rightIcon={
          <AnimatedIcon name='chevron-right' size={30} color='orange' style={[chevronStyle],{alignSelf:'flex-start'}}/>
        }/>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}>
        <DateBar onDateChange={this.onDateChange} date={this.state.date} />
        <Spinner visible={this.state.isLoading} textContent={'Loadingz'} textStyle={styles.spinnerTextStyle} />
        <FlatList data={this.state.games} renderItem={this.renderListItem} />
      </ScrollView>
    )
  }
}
HomeScreen.navigationOptions = {
  title:'GameScreen'
};
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  holder:{
    flexDirection:'row',
  },
  width:{
    width:200,
  },
  team:{
    fontWeight:'bold',
  },
  winsLoss:{
    fontSize:12,
    color:'gray'
  },
  runs:{
    fontSize:16
  },
  spinnerTextStyle:{
    color:'#333',
  },
  links:{

  }
});
