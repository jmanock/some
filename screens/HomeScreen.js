import React,{Component} from 'react';
import {ScrollView, View, StyleSheet, Text, FlatList, Button, ActivityIndicator, Animated} from 'react-native';
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
    this.getGamesForDay();
  }
  getGamesForDay = () =>{
    this.setState({isLoading:true});
    var year = this.state.date.getFullYear();
    var month = this.state.date.getMonth() + 1;
    var day = this.state.date.getDate();
    MLBGameDayApi.getListOfGamesForDay(year,month,day).then(function(data){
      this.setState({games:data});
      this.setState({isLoading:false})
    }.bind(this))
  }
  onDateChange = date => {
    this.setState({date});
    this.getGamesForDay();
  }
  onListItemPress = () =>{
    var chevronToValue = (this.state.isExpanded) ? 0 : 1;
    Animated.timing(this.chevronRotation, {
      toValue:chevronToValue, duration:200
    }).start();
    var heightToValue = (this.state.isExpanded) ? 0 : 100;
    Animated.timing(this.listItemHeight, {
      toValue:heightToValue,duration:200
    }).start();
    this.setState({isExpanded:!this.state.isExpanded});
  }
  getChevronRotateStyle = () =>{
    const rotate = this.chevronRotation.interpolate({
      inputRange:[0,1],
      outputRange:['0deg','90deg']
    });
    return {transform:[{rotate:rotate}]};
  }
  renderSubtitle = () =>{
    return(
      <Animated.View style={{alignItems:'center', paddingVertical:10,height:this.listItemHeight}}>
        <Text>Subtitle</Text>
      </Animated.View>
    )
  }
  renderListItem = ({item}) =>{
    var title = `${item.awayTeam} @ ${item.homeTeam}`;
    const chevronStyle = this.getChevronRotateStyle();
    const subtitle = this.renderSubtitle();
    return(
      <ListItem key={item.key} title={title} onPress={this.onListItemPress} rightIcon={<AnimatedIcon name='chevron-right' size={30} color='gray' style={[chevronStyle,{alignSelf:'flex-start'}]}/>} subtitle={subtitle}/>
    )
  }
  render(){
    if(this.state.isLoading){
      return <ActivityIndicator animation={true} size='large' style={{paddingTop:50}} />
    }
    return(
      <ScrollView style={styles.container}>
        <DateBar onDateChange={this.onDateChange} date={this.state.date} />
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
  }
});
