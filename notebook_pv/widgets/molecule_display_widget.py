from IPython.html import widgets
from IPython.utils.traitlets import Unicode, Dict, List

class MoleculeDisplayWidget(widgets.DOMWidget):
    _view_module = Unicode(u'nbextensions/notebook_pv/js/molecule_display_widget', sync=True)
    _view_name = Unicode(u'MoleculeDisplayView', sync=True)
    structure = Dict(dict(), sync=True)
    views = List([{"selection" : "//structure", "mode" : "cartoon"}], sync=True)
