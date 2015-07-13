require.config({paths : {
    text : "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
    css  : "https://cdnjs.cloudflare.com/ajax/libs/require-css/0.1.8/css.min",
    tpl  : "https://cdnjs.cloudflare.com/ajax/libs/requirejs-tpl/0.0.2/tpl.min",
}})

define([
    "jquery",
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js",
    "widgets/js/widget",
    "widgets/js/manager",
    "./bio-pv",
    "tpl!../templates/molecule_display_view",
    "tpl!../templates/molecule_display_view-view_table",
    "css!../css/molecule_display_view.css",
    "./element-resize-detector"],
    function($, _underscore, widget, manager, pv, view_template, view_table_template, _css, elementResizeDetectorMaker){
    
    var MoleculeDisplayView = widget.DOMWidgetView.extend({
        
        render: function(){ 
            MoleculeDisplayView.current = this;
            
            // Set unique id for root element and set class.
            // ID used in templates to link elements
            this.$el.addClass("MoleculeDisplayView");
           
            this.$el.uniqueId();
            this.id_suffix = "-" + this.$el[0].id;
            
            // Layout view
            this.$el.html(view_template( {id_suffix : this.id_suffix} ));
            _.defer(_.bind(this.render_viewer, this)); 
        },

        render_viewer: function() {
            // Setup view event handlers
            this.$el.on("click", "button.add_view", _.partial(this.handle_add_view, this));
            this.$el.on("click", "button.delete_view", _.partial(this.handle_delete_view, this));
            
            // Setup viewer component
            this.viewer_container = this.$el.find(".viewer_content")[0];

            // Set initial viewer dimensions to non-zero values
            // Viewer will be resized to fit container view via resize event
            var options = {
                width : 1, height: 1, antialias : true, 
                outline : true, quality : 'medium', style : 'hemilight',
                background : '#fff', animateTime: 500
            };
            
            this.viewer = pv.Viewer(this.viewer_container, options);

            // Setup view render and resize handlers
            this.viewer.addListener('viewerReady', _.bind(this.render_views, this));

            this.erd = elementResizeDetectorMaker( { strategy: "scroll" });
            this.erd.listenTo( this.$el.find(".viewer_content")[0], _.bind(this.handle_reflow, this));

            this.$el.on("click", ".nav_view", _.bind(this.handle_nav_start, this) );
            this.$el.on("transitionend", ".viewer_sidebar_container", _.bind(this.handle_nav_end, this));

            this.listenTo(this.model, "change:views", this.render_views);
            this.listenTo(this.model, "change:structure", this.render_views);
        },

        handle_nav_start : function() {
          this.in_reflow = true;
          this.$el.find(".viewer_main_container").toggleClass('hide_sidebar');

          window.requestAnimationFrame( _.bind( this.reflow_animation_handler, this) );
        },

        reflow_animation_handler : function() {
          this.handle_reflow();

          if ( this.in_reflow ) {
            window.requestAnimationFrame( _.bind( this.reflow_animation_handler, this) );
          }
        },

        handle_nav_end : function() {
          this.in_reflow = false;
        },

        handle_reflow : _.throttle(function() {
          this.viewer.fitParent();
        }, 5),

        handle_add_view : function(self) {
            var this_button = this;

            var form = self.$el.find("form.view_input");

            console.log(form);

            var result = form.serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {});
            // Remove non-truthy values, removed uninitialized fields
            console.log(result);
            result = _.pick(result, _.identity);

            form[0].reset();

            console.log(self.model.get("views"), [result]);
            var new_views = _.union( self.model.get("views"), [ result ])
            console.log(new_views);

            self.model.save( { views : new_views } );
        },

        handle_delete_view : function(self) {
            var this_button = this;

            var view_index = $(this_button).attr("view_index");

            console.log(view_index);
            
            // Must shallow-copy attribute value before editing
            // otherwise 'changed' event will not fire.
            var new_views = self.model.get("views").slice(0);
            console.log(new_views);
            new_views.splice(view_index, 1);
            console.log(new_views);

            self.model.save( { views : new_views });
        },
        
        render_views : function(){
            this.$el.find(".modal-body pre").text( JSON.stringify(this.model.get("structure"), null, 2));
            this.$el.find(".viewer_sidebar tbody").html( view_table_template( { views : this.model.get("views") }) );
            
            this.structure = pv.mol.docmodel.objToMol(this.model.get("structure"));
            this.structure_doc = pv.mol.docmodel.molToDoc(this.structure);

            pv.mol.assignHelixSheet( this.structure );
            
            var views = this.model.get("views");

            this.viewer.clear();

            for( var v = 0; v < views.length; v++) {
              console.log("Rendering: ", views[v]);
              var structure_view = this.structure_doc.selectView( views[v].selection );
              console.log("View: ", structure_view);
               
              pv.declarativeView.renderView( this.viewer, v.toString(), structure_view, views[v] );
            }

            //Zoom
            this.viewer.autoZoom();
        },
    });
    
    MoleculeDisplayView.pv = pv;
    
    window.MoleculeDisplayView = MoleculeDisplayView;

    return {
      MoleculeDisplayView : MoleculeDisplayView
    }
})
