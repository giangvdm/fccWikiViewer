var api = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";

var Util = {
    pushForFooter() {
        var pushElem = "<div id='push'></div>";
        $("#main").append(pushElem);
    }
}

var App = {
    searchIsOpen: false,
    searchInput: document.querySelector(".search__area > input[type='text']"),
    toggleSearch() {
        var searchArea = document.querySelector(".search__area");
        if (this.searchIsOpen === false) {
            searchArea.classList.add("show");
            if ($(window).width() <= 360) { // for responsiveness
                $(".random-article").css("margin-top", "60px");
            }
            this.searchIsOpen = true;
        }
        else {
            searchArea.classList.remove("show");
            if ($(window).width() <= 360) { // for responsiveness
                $(".random-article").css("margin-top", "0");
            }
            this.searchIsOpen = false;
        }
    },
    resetSearch() {
        this.searchInput.value = "";
    },
    search() {
        var term = this.searchInput.value;
        var searchUrl = api + term;
        var results = [];
        function getResAndProcess(handleRes) {
            // get results from API
            $.ajax({
                method: 'GET',
                url: searchUrl,
                async: false,
                dataType: 'jsonp',
                success: function (res) {
                    handleRes(res);
                }
            });
        }
        getResAndProcess(function (results) {
            // Process received results
            const titles = results[1];
            const summaries = results[2];
            const articleUrl = results[3];
            function constructArticle(title, summary, url) {
                // Article container
                var elem = "<div class='article'>";
                // Article title
                elem += "<h3 class='article__title'>";
                elem += (title);
                elem += "</h3>";
                // Acticle summary
                elem += "<p class='article__summary'>";
                elem += (summary);
                elem += "</p>";
                // "Read more" anchor
                elem += "<a class='article__url' target='_blank' href='" + url + "'>";
                elem += "Click to read more"
                elem += "</a>"
                // Closing tag(s)
                elem += "</div>";

                return elem;
            }
            // Clear previous searched articles and push element (if any)
            var articleList = $(".article");
            for (var i = 0; i < articleList.length; i++) {
                articleList[i].remove();
            }
            $("#push").remove();

            // Append new articles to the list
            for (var i = 0; i < titles.length; i++) {
                var article = constructArticle(titles[i], summaries[i], articleUrl[i]);
                $("#main").append(article);
            }

            // Add onclick events to articles, which direct to their respective articleUrl
            var articleList = $(".article");
            for (var i = 0; i < articleList.length; i++) {
                articleList.eq(i).attr("onclick", "window.open('" + articleUrl[i] + "')");
            }

            // Completed displaying all search results/articles
            // Push a little bit down to make space for the footer
            Util.pushForFooter();
        });

    }
}

document.querySelector("#search-button").addEventListener("click", function () {
    App.toggleSearch();
});

document.querySelector("#search-clear").addEventListener("click", function () {
    App.resetSearch();
});

document.querySelector(".search__area > input[type='text']").addEventListener("change", function () {
    App.search();
});

