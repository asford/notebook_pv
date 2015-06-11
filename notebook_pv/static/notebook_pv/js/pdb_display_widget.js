// the immediately-called closure and 'use strict' helps ensure hygiene
;(function(define) {
'use strict';
define([
  // libraries
  'jquery',
  'underscore',

  // ipython API
  'widgets/js/widget',

  // local imports
  './pv',
  './utils'

],
function($, _, widget, pv, utils) {
  var PDBDisplayView = widget.DOMWidgetView.extend({
    // namespace your CSS so that you don't break other people's stuff
    className: 'notebook_pv PDBDisplayView',

    loadCss: utils.loadCss,

    // Initialize DOM, etc. called once per view creation,
    // i.e. `display(widget)`
    render: function() {
      // add a stylesheet, if defined in `_view_style`
      this.loadCss();

      var options = {
        width: 1200,
        height: 600,
        antialias: true,
        quality : 'medium'
      };
      
      this.viewer = pv.Viewer(this.$el[0], options);

      // call an update once the node has been added to the DOM...
      this.update();

      return this;
    },

    update: function() {
        var self = this;
        
        self.viewer.rm("protein");

        var structure = pv.io.pdb(self.model.get("pdb_data"));

        self.viewer.renderAs('protein', structure, self.model.get("display_type"), { color : pv.color.ssSuccession() });
        self.viewer.centerOn(structure);
    },
  }); 

  // The requirejs namespace.
  return {
    PDBDisplayView: PDBDisplayView
  };
});
}).call(this, define);
