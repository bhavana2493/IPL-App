$(function () {
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
    readFirebase(function (data) {
        $(window).trigger('hashchange');
        random_img();
    });
    function random_img() {
        var bgurl = [];
        var i = 0;
        $.each(teams, function (key, f) {
            bgurl[i] = f.team_img_url;
            i++;

        });
        var x = Math.floor(Math.random() * bgurl.length);
        if (x <= bgurl.length) {
            $("#logo1").attr("src", bgurl[x]);
            setTimeout(random_img, 1000);
        }
    }
    $('.teams').on('click', function () {
        $(".main-content").load("/IPL_MyApp2/team.html");

    });
    $(window).on('hashchange', function () {
        render(decodeURI(window.location.hash));
    });
    //renders the page according to url content
    function render(url) {
        var tmp = url.split('/')[0];
        $('.main-content page').removeClass('visible');
        var map = {
            '#teams': function () {

                renderTeamPage(teams);
            },
            '#team': function () {
                var index = url.split('#team/')[1].trim();
                renderSingleTeamPage(index, teams);
            }
        };
        if (map[tmp]) {
            map[tmp]();
        }
    }
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

})