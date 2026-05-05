export const en: Record<string, string> = {
  // Header
  'header.new': 'New',
  'header.newConfirm': 'Discard current project and start fresh?',
  'header.loadTray': 'Tray',
  'header.export': 'Export',
  'header.exportTitle': 'Export tray',
  'header.snap': 'Snap',
  'header.snapTitle': 'Snap to grid',
  'header.snapUnit': 'mm',
  'header.edges': 'Edges',
  'header.edgesTitle': 'Toggle edges',
  'header.measure': 'Measure',
  'header.measureTitle': 'Measurement tool',
  'header.pattern': 'Pattern',
  'header.patternTitle': 'Pattern generator',
  'header.items': 'items',
  'header.sel': 'sel.',
  'header.langSwitch': 'DE',

  // Panels
  'panel.tray': 'Tray',
  'panel.itemTypes': 'Item Types',
  'panel.layers': 'Layers',
  'panel.properties': 'Properties',
  'panel.align': 'Align',
  'panel.scene': 'Scene',

  // TrayInfo
  'tray.noTray': 'No tray loaded',
  'tray.name': 'Name',
  'tray.size': 'Size',
  'tray.items': 'Items',
  'tray.types': 'Types',

  // ItemPalette
  'items.noItems': 'No items loaded',
  'items.load': '+ Load item JSON',
  'items.addTitle': 'Add: {name}',

  // Layers
  'layers.add': '+ Add Layer',
  'layers.hide': 'Hide',
  'layers.show': 'Show',
  'layers.assign': "Move selection to '{name}'",

  // Properties
  'props.nothing': 'Nothing selected',
  'props.multiSelect': '{n} items selected',
  'props.x': 'X (mm)',
  'props.y': 'Y (mm)',
  'props.z': 'Z (mm)',
  'props.rx': 'RX (°)',
  'props.ry': 'RY (°)',
  'props.rz': 'RZ (°)',
  'props.order': 'Order',
  'props.dupOrder': 'Duplicate order ID!',
  'props.layer': 'Layer:',
  'props.prevLayer': 'Previous layer (PageUp)',
  'props.nextLayer': 'Next layer (PageDown)',

  // Align
  'align.title': 'Align',
  'align.distribute': 'Distribute',
  'align.rotation': 'Rotation',

  // Scene list
  'scene.noItems': 'No items',

  // AddLayer modal
  'addLayer.title': 'Add Layer',
  'addLayer.name': 'Name',
  'addLayer.zOffset': 'Z-Offset (mm)',
  'addLayer.cancel': 'Cancel',
  'addLayer.add': 'Add',
  'addLayer.placeholder': 'Layer {id}',

  // Pattern modal
  'pattern.title': 'Pattern Generator',
  'pattern.itemType': 'Item Type',
  'pattern.rows': 'Rows',
  'pattern.cols': 'Columns',
  'pattern.spacingX': 'Spacing X (mm)',
  'pattern.spacingY': 'Spacing Y (mm)',
  'pattern.startX': 'Start X (mm)',
  'pattern.startY': 'Start Y (mm)',
  'pattern.summary': '→ {n} items on layer {layer}',
  'pattern.cancel': 'Cancel',
  'pattern.generate': 'Generate',
  'pattern.noItem': 'No item type selected',
  'pattern.created': '{n} items created',

  // Context menu
  'ctx.duplicate': 'Duplicate',
  'ctx.snapToGrid': 'Snap to Grid',
  'ctx.layer': 'Layer',
  'ctx.delete': 'Delete',

  // Viewport / Grid info
  'view.3d': '3D Perspective',
  'view.top': 'Top View (XY)',
  'view.front': 'Front View (XZ)',
  'view.side': 'Side View (YZ)',
  'view.fit': 'Fit',
  'view.btn.3d': '3D',
  'view.btn.top': 'Top',
  'view.btn.front': 'Front',
  'view.btn.side': 'Side',

  // StatusBar
  'status.collision': 'Collision',
  'status.dupOrder': 'dup.order',
  'status.overlap': 'overlap',
  'status.collisionTitle': '{n} overlapping items',
  'status.dupOrderTitle': '{n} items with duplicate order ID',
  'status.toggleOn': 'Disable collision detection',
  'status.toggleOff': 'Enable collision detection',

  // Measure tool
  'measure.setA': 'Click: Set point A',
  'measure.setB': 'Click: Set point B',
  'measure.reset': '✕ Reset',
  'measure.distance': 'Distance: {d} mm',
  'measure.label': '{d} mm',

  // Shortcuts panel
  'shortcuts.title': 'Shortcuts',
  'shortcuts.views': 'Views',
  'shortcuts.edit': 'Edit',
  'shortcuts.camera': 'Camera',
  'shortcuts.1234': '1 / 2 / 3 / 4',
  'shortcuts.1234.desc': '3D · Top · Front · Side',
  'shortcuts.undo': 'Ctrl+Z / Ctrl+Shift+Z',
  'shortcuts.undo.desc': 'Undo / Redo',
  'shortcuts.selAll': 'Ctrl+A',
  'shortcuts.selAll.desc': 'Select all',
  'shortcuts.dup': 'Ctrl+D',
  'shortcuts.dup.desc': 'Duplicate',
  'shortcuts.del': 'Del',
  'shortcuts.del.desc': 'Delete',
  'shortcuts.esc': 'Esc',
  'shortcuts.esc.desc': 'Deselect',
  'shortcuts.arrows': '← ↑ → ↓',
  'shortcuts.arrows.desc': 'Move 1 mm',
  'shortcuts.shiftArrows': 'Shift+Arrows',
  'shortcuts.shiftArrows.desc': 'Move 10 mm',
  'shortcuts.pageud': 'PageUp / Down',
  'shortcuts.pageud.desc': 'Change layer',
  'shortcuts.pan': 'Ctrl+Mouse',
  'shortcuts.pan.desc': 'Pan view',
  'shortcuts.rotate': 'Ctrl+Shift+Mouse',
  'shortcuts.rotate.desc': 'Rotate view',
  'shortcuts.zoom': 'Scroll wheel',
  'shortcuts.zoom.desc': 'Zoom to cursor',

  // STL
  'stl.mode': 'STL',
  'stl.modeTitle': 'Show 3D models (STL)',
  'stl.upload': 'Upload STL',
  'stl.remove': 'Remove STL',
  'stl.loaded': '3D model loaded',
  'stl.missingHint': '{n} items without type — load item files in the left panel',
  'stl.uploadHint': 'Upload STL files in the left panel, then activate',
  'stl.sectionTitle': '3D Models (STL)',
  'stl.sectionHint': 'Upload STL files to replace boxes with real 3D models.',
  'stl.offsetRotation': 'Model Offset (Rotation)',
  'stl.rx': 'RX (°)',
  'stl.ry': 'RY (°)',
  'stl.rz': 'RZ (°)',

  // Landing page
  'landing.title': 'Start a new configuration',
  'landing.subtitle': 'Load a Container JSON file to launch the editor.',
  'landing.hint': 'For accurate size rendering, you can add the matching Item files afterwards.',
  'landing.loadContainer': 'Select Container JSON file',
  'landing.draftFound': 'An unsaved draft was found.',
  'landing.restore': 'Restore',
  'landing.draftDate': 'Last saved: {date}',
  'landing.privacy': 'All changes are processed exclusively in your browser. No data is uploaded to any server.',
  'landing.disclaimer': 'This project is an independent community tool and has no official affiliation with the ABB Group. ABB™ and PickMaster™ are registered trademarks of ABB Asea Brown Boveri Ltd.',

  // Disclaimer
  'disclaimer.line1': 'Not an official ABB product.',
  'disclaimer.line2': 'PickMaster® is a registered trademark of ABB Ltd.',

  // Toasts
  'toast.trayLoaded': 'Tray loaded: {name}',
  'toast.noTrayFile': 'No tray file recognized',
  'toast.loadError': 'Load error',
  'toast.fileError': 'Error loading {name}',
  'toast.exported': 'Exported',
  'toast.noTrayExport': 'No tray to export',
  'toast.itemsLoaded': '{n} item type(s) loaded',
  'toast.newProject': 'New project created',
  'toast.restored': 'Project restored',
  'toast.noTray': 'No tray loaded',
};
