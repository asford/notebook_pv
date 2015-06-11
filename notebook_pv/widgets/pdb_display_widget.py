# -*- coding: utf-8 -*-
from IPython.html import widgets

from IPython.utils import traitlets

class PDBDisplayWidget(widgets.DOMWidget):
    '''
    A sample widget... with one "real" traitlet, and a bunch of housekeeping
    '''
    _view_module = traitlets.Unicode('nbextensions/notebook_pv/js/pdb_display_widget', sync=True)
    _view_name = traitlets.Unicode( 'PDBDisplayView', sync=True )

    # the name of the CSS file to load with this widget
    #_view_style = traitlets.Unicode('nbextensions/notebook_pv/css/widget_pv', sync=True )

    pdb_data = traitlets.Unicode(u'', sync=True)
    display_type = traitlets.CaselessStrEnum(
        ["lines", "ballsAndSticks", "spheres", "cartoon"], "cartoon", allow_none=False, sync=True)
