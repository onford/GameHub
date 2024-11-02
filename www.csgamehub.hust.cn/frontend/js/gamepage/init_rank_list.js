function init_rank_list() {
    event.preventDefault();
    var ranklist = document.getElementById("ranklist");
    var game_rank_api = "./../../backend/api/game_rank_api.php";
    var temp_form_data = new FormData();
    temp_form_data.append("gamename", localStorage.getItem("cur_game"));
    fetch(game_rank_api, {
        method: "POST",
        body: temp_form_data
    }).then(response => response.json())
        .then(data => {
            if (data.code != 0) {
                alert(data.msg);
            } else {
                console.log("游戏排名查询成功");
                console.log(data);
                var usernames = data.data.usernames;
                var scores = data.data.highest_scores;
                console.assert(usernames.length == scores.length); //不会打断执行, 是true的时候也不会显示在控制台
                var len = usernames.length;
                for (var i = 0; i < len; i++) {
                    if (usernames[i] == localStorage.getItem("username")) {
                        document.getElementsByClassName("history_best")[0].innerHTML = "历史最佳: " + scores[i];
                        score_ready = true;
                    }
                    var new_item = document.createElement("tr");
                    new_item.innerHTML = "<th scope=\"row\" class=\"myth\">" + crown_style(i + 1) + "</th><td class=\"mytd\">" + usernames[i] + "</td><td class=\"mytd\">" + scores[i] + "</td>";
                    ranklist.appendChild(new_item);
                }
                if (document.getElementsByClassName("history_best")[0].innerHTML == '') {
                    document.getElementsByClassName("history_best")[0].innerHTML = "历史最佳: 0";
                    score_ready = true;
                }
            }
        })
        .catch(error => {
            console.error(error);
        })
}

// 前1~3名给予皇冠
function crown_style(rank) {
    if (rank > 3) return rank;
    return "<i class=\"fa-solid fa-crown\" style=\"color:" + (rank == 1 ? "gold" : (rank == 2 ? "silver" : "rgb(186,110,64)")) + ";\"></i>";
}
// window.onload = init();