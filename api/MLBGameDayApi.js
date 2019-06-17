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
  static getGameData(gameURL){
    const url = `${MLBGameDayApi.BaseURL}${gameURL}/linescore.json`;
    return fetch(url)
      .then(function(response){return response.json();})
      .then(function(data){
        // if(!data || !data.data || !data.data.boxscore || !data.data.boxscore.linescore){
        //   return Promise.resolve(null);
        // }

        var awayTeamCity = data.data.game['away_team_city'];
        var homeTeamCity = data.data.game['home_team_city'];
        var awayTeamMName = data.data.game['away_team_name'];
        var homeTeamMName = data.data.game['home_team_name'];
        var homeTeamName = homeTeamCity+' ' + homeTeamMName;
        var awayTeamName = awayTeamCity +' '+ awayTeamMName;
        var gameTime = data.data.game['time'];
        var homeTeamRuns = data.data.game['home_team_runs'];
        var awayTeamRuns = data.data.game['away_team_runs'];
        var homeWins = data.data.game['home_win'];
        var homeLosses = data.data.game['home_loss'];
        var awayWins = data.data.game['away_win'];
        var awayLosses = data.data.game['away_loss'];
        console.log(gameTime, homeTeamName, awayTeamName);
        var obj = {
          key:gameURL,
          home_team_runs:homeTeamRuns,
          away_team_runs:awayTeamRuns,
          home_fname:homeTeamName,
          away_fname:awayTeamName,
          home_wins:homeWins,
          away_wins:awayWins,
          home_loss:homeLosses,
          away_loss:awayLosses,
          time:gameTime
        };
        return Promise.resolve(obj);
      });
  }
  static getAllGameDataForDay(year,month,day){
    return MLBGameDayApi.getListOfGamesForDay(year,month,day)
      .then(function(dayGames){
        const gameDataPromises = dayGames.map(function(dayGame){
          return MLBGameDayApi.getGameData(dayGame.url);
        });
        return Promise.all(gameDataPromises);
      });
  }
  static parseXML(xmlText){
    var xml = new XMLParser().parseFromString(xmlText);
    return Promise.resolve(xml);
  }
}
MLBGameDayApi.BaseURL = 'https://gd2.mlb.com';
