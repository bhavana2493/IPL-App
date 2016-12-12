$(function () {
    //global variable
    var teams = [];
    //function to read firebase
    //a function that takes callback as parameter 
    function readFirebase(callback) {
        //creating firebase reference
        var ref = firebase.database().ref();
        //retrive the data from firebase
        ref.on("value", function (data) {
            // console.log(data.val());
            teams = data.val();
            callback(teams);
        });
    }
    //function to read firebase
    readFirebase(function (data) {
        $(".loader").hide();
        console.log("firebase");
        $(window).trigger('hashchange');
    });
    //To display image in home page......
    function random_img() {
        var bgurl = [];
        $.each(teams, function (key, f) {
            bgurl[key] = f.team_img_url;


        });
        //generating random images logo
        var x = Math.floor(Math.random() * bgurl.length);
        if (x <= bgurl.length) {
            $("#logo1").attr("src", bgurl[x]);
            //animation for logo images.....
            var div = $("#logo1");
            div.animate({ height: '300px', opacity: '0.4' }, "slow");
            div.animate({ width: '300px', opacity: '0.8' }, "slow");
            div.animate({ height: '100px', opacity: '0.4' }, "slow");
            div.animate({ width: '100px', opacity: '0.8' }, "slow");

            setTimeout(random_img, 1000);
        }
    }

    $(window).on('hashchange', function () {
        render(decodeURI(window.location.hash));
    });
    //renders the page according to url content
    function render(url) {

        console.log(url);
        var tmp = url.split('/')[0];
        var map = {
            //display home page
            '': function () {
                random_img();
            },
            //displays team page
            '#teams': function () {

              //using promise function
                myPromise2().then(function () {
                    renderTeamPage(teams);
                })

            },
            //displays single team page with players
            '#team': function () {

                var index = url.split('#team/')[1].trim();
                renderSingleTeamPage(index, teams);
            }
        };
        if (map[tmp]) {
            map[tmp]();
        }
    }
    //IPL team page....
    function renderTeamPage(data) {

        var list = $('.all-teams .team-list');
        var theTemplateScript = $("#team-template").html();
        //compile the template
        var theTemplate = Handlebars.compile(theTemplateScript);
        list.append(theTemplate(data));
        //Each team has a data-index attribute.
        //On click it should display team info 
        list.find('li').on('click', function (e) {
            e.preventDefault();
            var teamIndex = $(this).data('index');
            window.location.hash = 'team/' + teamIndex;
        });
    }
    //displays single team page....
    function renderSingleTeamPage(team_i, data) {
        // debugger;
        var players = [];
        //first mypromise function will execute...
        myPromise().then(function () {
            var info = $('.team-info .jumbotron .team-display');
            var list = $('.team-info .player-list');
            $.each(data, function (key, value) {
                if (value.id == team_i) {
                    $('.jumbotron').css({
                        "background": "url(" + value.team_bg + ") no-repeat ",
                        "-webkit-background-size": "cover", "-moz-background-size": "cover",
                        "-o-background-size": "cover", "background-size": "cover",
                        "padding": "8em inherit", "opacity": "0.2px"
                    });
                    info.append(
                        "<li><b>Team Name : <b>" + value.team_name + "</li>" +
                        "<li><b>Team Owner : <b>" + value.team_owner + "</li>" +
                        "<li><b>Team Captain : <b>" + value.team_captain + "</li>" +
                        "<li><b>Team Coach : <b>" + value.team_coach + "</li>" +
                        "<li><b>Team Name : <b>" + value.team_home_venue + "</li>");
                    // debugger;
                    console.log(value.team_players);
                    var theTemplateScript = $("#players-template").html();
                    // console.log(theTemplateScript);
                    //compile the template
                    player = value.team_players;
                    var theTemplate = Handlebars.compile(theTemplateScript);
                    list.append(theTemplate(value.team_players));
                }
            })

          //displays modal view 
            list.find('li').on('click', function (e) {
                debugger;
                e.preventDefault();
                var teamIndex = $(this).data('index');
                var list1 = $('.team-info .player ');
                $.each(player, function (k, v) {
                    //debugger;
                    if (v.id == teamIndex) {
                        // debugger
                        var theTemplateScript1 = $("#Splayer-template").html();
                        // console.log(theTemplateScript);
                        //compile the template
                        //debugger
                        var theTemplate1 = Handlebars.compile(theTemplateScript1);
                        //debugger;
                        list1.append(theTemplate1(v));
                        console.log(v);
                    }
                })
            });
        }).catch(function (data) {
            console.log(data);
        })




    }
    /*promise functions.....*/
    function myPromise() {
        return new Promise(function (resolve, reject) {
            $(".main-content").load("team-info.html", ".team-info", function () {
                resolve();
            });
        });

    }
    function myPromise2() {
        return new Promise(function (resolve, reject) {
            $(".main-content").load("team.html", ".all-teams", function () {
                resolve();
            });
        });

    }


})