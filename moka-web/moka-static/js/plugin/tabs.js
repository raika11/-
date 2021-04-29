(function($) {
    $.tabs = {
        init : function(){
            var $tablists = $('[role="tablist"]');
            $tablists.each(function(index, tablist){
                setTabs($(tablist), index);
            });
        }
    }
    
    function setTabs($tablist, index){
        $tabs = $tablist.find('[role="tab"]');
        $panels = $(".tab_content").eq(index).find('[role="tabpanel"]');
        for (i = 0; i < $tabs.length; ++i) {
            addListeners($($tabs[i]), $tabs, $panels, i);
        };
    }
    
    function addListeners ($tab, $tabs, $panels, index) {
        $tab.click(function(event){
            event.preventDefault();
            activateTab($tab, $tabs, $panels, index, false);
        });
    };

    function activateTab ($tab, $tabs, $panels, index, setFocus) {
        setFocus = setFocus || true;
        deactivateTabs($tabs, $panels);
        $tab.removeAttr('tabindex');
        $tab.attr('aria-selected', 'true');
        $tabs.removeAttr('hidden');
        $panels[index].removeAttribute('hidden');
        /*
        if (setFocus) {
            $tab.focus();
        };
        */
    };
    
    function deactivateTabs ($tabs, $panels) {
        for (t = 0; t < $tabs.length; t++) {
            $tabs[t].setAttribute('tabindex', '-1');
            $tabs[t].setAttribute('aria-selected', 'false');
        };
        for (p = 0; p < $panels.length; p++) {
            $panels[p].setAttribute('hidden', 'hidden');
        };
    };
})(jQuery);