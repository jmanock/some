import React,{Component} from 'react';
import {TouchableOpacity,Text,View,StyleSheet} from 'react-native';
import{MaterialCommunityIcons as Icon} from 'react-native-vector-icons';

export default class LinksScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      date:new Date(),

    }
  }
  games = (games) =>{
    var year = games.getFullYear();
    var month = games.getMonth() + 1;
    var day = games.getDate();
    var url = `gd2.mlb.com/components/game/mlb/year_/${year}/month_${month}/day_${day}`;
    this.allGamesForDay(url);
  }
  allGamesForDay = (x) =>{
    // This need to show something on start up
    
  }
  onLeftArrowPress = () =>{
    var newDate = new Date(this.state.date);
    newDate.setDate(newDate.getDate() -1);
    this.setState({date:newDate});
    this.games(newDate);
  }
  onRightArrowPress = () =>{
    var newDate = new Date(this.state.date);
    newDate.setDate(newDate.getDate() +1);
    this.setState({date:newDate});
    this.games(newDate);
  }
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={this.onLeftArrowPress}>
          <Icon name='chevron-left' style={styles.icon}/>
        </TouchableOpacity>
        <Text style={styles.date}>{this.state.date.toString()}</Text>
        <TouchableOpacity onPress={this.onRightArrowPress}>
          <Icon name='chevron-right' style={styles.icon}/>
        </TouchableOpacity>
      </View>
    )
  }
}

LinksScreen.navigationOptions = {
  title: 'Links',
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:'#ddd',
    paddingVertical:10
  },
  date:{
    paddingTop:8,fontWeight:'bold'
  },
  icon:{fontSize:30,color:'gray'}
});
