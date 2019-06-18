import React,{Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import MLBGameDayApi from './../api/MLBGameDayApi';

export default class VideosScreen extends Component{
  constructor(props){
    super(props);
    this.item = this.props.navigation.getParam('item',{ });

  }
  componentDidMount(){
    // MLBGameDayApi.getVideoData(this.item.url).then(function(data){
    //
    // })
    MLBGameDayApi.getVData(this.item.url);
  }
  render(){
    return <Text>Videos Screen</Text>;
  }
};

const styles = StyleSheet.create({

});
