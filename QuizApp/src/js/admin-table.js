let api_key = getCookie('api_key');
let user_id = parseInt(getCookie('user_id'));
function sendApiRequest() {
  fetch(`${config.api_url}/api/useranswers/GetLeaderboard/${api_key}`)
    .then((response) => response.text())
    .then((result) => {
      var result = JSON.parse(result);

      let i = 0;
      let leaderboardArr = [];
      result.forEach((e) => {
        let name = `${e.user.name} ${e.user.surname}`;
        let start_time = Date.parse(e.user.start_time);
        let end_time = Date.parse(e.user.end_time);
        let time = end_time - start_time;
        let timeMin = Math.floor(time / (1000 * 60));
        let timeSec = Math.floor(time % 1000);
        let timeMs = Math.floor(time % 100);
        let timeStr = `${timeMin}min ${timeSec}.${timeMs}s`;

        let correct_answers = `${e.correct_answers}/${config.totalQuestions}`;

        leaderboardArr.push({
          id: e.user.id,
          name: name,
          time: timeStr,
          points: correct_answers,
        });

        i++;
      });

      createView(leaderboardArr, user_id);
    })
    .catch((error) => console.error(error));
}

sendApiRequest();

const createView = (leaderboardArr, id) => {
  const leaderboard = document.querySelector("#leaderboard");

  let leaderboardText=`<div class="grid-container">`;
//    = `<div class="grid-container">
//                             <div class="grid-header">
//                                 Imię i nazwisko:
//                             </div>
//                             <div class="grid-header">
//                                 Czas:
//                             </div>
//                             <div class="grid-header">
//                                 Punkty:
//                             </div>
//                         `;

  const userId = id;

  let i = 0;
  leaderboardArr.forEach((e) => {
    ++i;
    if(i<20){
      leaderboardText += `
                            <div class="grid-item">
                                ${e.name}
                            </div>
                            `;
    }
  });
  leaderboardText+='</div>';
  leaderboard.innerHTML = leaderboardText;
};
