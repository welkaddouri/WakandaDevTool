chrome.devtools.panels.elements.createSidebarPane(
   "wakanda-widget",
    function(sidebar) {
        function update() {
            sidebar.setExpression("$$($0.id)");
        }

        update();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(update);
    }
);






chrome.devtools.panels.create("Wakanda",
                              "logo.jpg",
                              "panel.html",
                              function(panel) { });