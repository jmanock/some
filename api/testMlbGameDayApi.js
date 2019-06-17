var XMLParser = require('react-xml-parser');
export default class testMlbGameDayApi{
  constructor(){}
  static getDayURL(year,month,day){
    if(month < 10){month = '0'+month;}
    if(day < 10){day = '0'+day;}
    return `${testMlbGameDayApi.BaseURL}/components/game/mlb/year_${year}/month_${month}/day_${day}/`;
  }
  static getListOfGamesForDay(year,month,day){
    var master_scoreboard = testMlbGameDayApi.getDayURL(year,month,day)+'master_scoreboard.xml';
    return fetch(master_scoreboard)
      .then(function(response){return response.text();})
      .then(function(text){return testMlbGameDayApi.parseXML(text)})
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
    const url = `${testMlbGameDayApi.BaseURL}${gameURL}/boxscore.json`;
    return fetch(url)
      .then(function(response){return response.json();})
      .then(function(data){
        if(!data || !data.data || !data.data.boxscore || !data.data.boxscore.linescore){
          return Promise.resolve(null);
        }

        var awayTeamName = data.data.boxscore['away_fname'];
        var homeTeamName = data.data.boxscore['home_fname'];
        var homeTeamRuns = data.data.boxscore.linescore['home_team_runs'];
        var awayTeamRuns = data.data.boxscore.linescore['away_team_runs'];
        var awayWins = data.data.boxscore['away_wins'];
        var awayLosses = data.data.boxscore['away_loss'];
        var homeWins = data.data.boxscore['home_wins'];
        var homeLosses = data.data.boxscore['home_loss'];

        var obj = {
          key:gameURL,
          home_team_runs:homeTeamRuns,
          away_team_runs:awayTeamRuns,
          home_fname:homeTeamName,
          away_fname:awayTeamName,
          home_wins:homeWins,
          away_wins:awayWins,
          home_loss:homeLosses,
          away_loss:awayLosses
        };
        return Promise.resolve(obj);
      });
  }
  static getAllGameDataForDay(year,month,day){
    return testMlbGameDayApi.getListOfGamesForDay(year,month,day)
      .then(function(dayGames){
        const gameDataPromises = dayGames.map(function(dayGame){
          return testMlbGameDayApi.getGameData(dayGame.url);
        });
        return Promise.all(gameDataPromises);
      });
  }
  static parseXML(xmlText){
    var xml = new XMLParser().parseFromString(xmlText);
    return Promise.resolve(xml);
  }
}
testMlbGameDayApi.BaseURL = 'https://gd2.mlb.com';
