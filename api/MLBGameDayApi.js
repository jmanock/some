var XMLParser = require('react-xml-parser');
export default class MLBGameDayApi{
  constructor(){}
  static getDayURL(year,month,day){
    if(month < 10){month = '0'+month;}
    if(day < 10){day = '0'+day;}
    return `${MLBGameDayApi.BaseURL}/components/game/mlb/year_${year}/month_${month}/day_${day}/`;
  }
  static getListOfGamesForDay(year,month,day){
    var master_scoreboard = MLBGameDayApi.getDayURL(year,month,day)+'master_scoreboard.xml';
    return fetch(master_scoreboard)
      .then(function(response){return response.text();})
      .then(function(text){return MLBGameDayApi.parseXML(text)})
      .then(function(data){
        var games = data.getElementsByTagName('game');
        var urls = games.map(function(game){
          var url = game.attributes['game_data_directory'];
          var awayTeamID = game.attributes['away_file_code'];
          var homeTeamID = game.attributes['home_file_code'];
          var homeTeamName = game.attributes['home_team_name'];
          var awayTeamName = game.attributes['away_team_name'];
          return {url:url, key:url, homeTeamId:homeTeamID,awayTeamId:awayTeamID,homeTeam:homeTeamName,awayTeam:awayTeamName};
        });
        return Promise.resolve(urls);
      });
  }
  static parseXML(xmlText){
    var xml = new XMLParser().parseFromString(xmlText);
    return Promise.resolve(xml);
  }
}
MLBGameDayApi.BaseURL = 'https://gd2.mlb.com';
