export const de: Record<string, string> = {
  // Header
  'header.new': 'Neu',
  'header.newConfirm': 'Aktuelles Projekt verwerfen und neu beginnen?',
  'header.loadTray': 'Tray',
  'header.export': 'Export',
  'header.exportTitle': 'Tray exportieren',
  'header.snap': 'Snap',
  'header.snapTitle': 'Snap an Raster',
  'header.snapUnit': 'mm',
  'header.edges': 'Kanten',
  'header.edgesTitle': 'Kanten ein/aus',
  'header.measure': 'Messen',
  'header.measureTitle': 'Mess-Werkzeug',
  'header.pattern': 'Pattern',
  'header.patternTitle': 'Pattern-Generator',
  'header.items': 'Items',
  'header.sel': 'sel.',
  'header.langSwitch': 'EN',

  // Panels
  'panel.tray': 'Tray',
  'panel.itemTypes': 'Item-Typen',
  'panel.layers': 'Ebenen',
  'panel.properties': 'Eigenschaften',
  'panel.align': 'Ausrichten',
  'panel.scene': 'Szene',

  // TrayInfo
  'tray.noTray': 'Kein Tray geladen',
  'tray.name': 'Name',
  'tray.size': 'Größe',
  'tray.items': 'Items',
  'tray.types': 'Typen',

  // ItemPalette
  'items.noItems': 'Keine Items geladen',
  'items.load': '+ Item-JSON laden',
  'items.addTitle': 'Hinzufügen: {name}',

  // Layers
  'layers.add': '+ Ebene hinzufügen',
  'layers.hide': 'Ausblenden',
  'layers.show': 'Einblenden',
  'layers.assign': "Auswahl auf '{name}' verschieben",

  // Properties
  'props.nothing': 'Nichts ausgewählt',
  'props.multiSelect': '{n} Items ausgewählt',
  'props.x': 'X (mm)',
  'props.y': 'Y (mm)',
  'props.z': 'Z (mm)',
  'props.rx': 'RX (°)',
  'props.ry': 'RY (°)',
  'props.rz': 'RZ (°)',
  'props.order': 'Order',
  'props.dupOrder': 'Doppelte Order-ID!',
  'props.layer': 'Ebene:',
  'props.prevLayer': 'Vorherige Ebene (PageUp)',
  'props.nextLayer': 'Nächste Ebene (PageDown)',

  // Align
  'align.title': 'Ausrichten',
  'align.distribute': 'Verteilen',
  'align.rotation': 'Rotation',

  // Scene list
  'scene.noItems': 'Keine Items',

  // AddLayer modal
  'addLayer.title': 'Ebene hinzufügen',
  'addLayer.name': 'Name',
  'addLayer.zOffset': 'Z-Offset (mm)',
  'addLayer.cancel': 'Abbrechen',
  'addLayer.add': 'Hinzufügen',
  'addLayer.placeholder': 'Ebene {id}',

  // Pattern modal
  'pattern.title': 'Pattern-Generator',
  'pattern.itemType': 'Item-Typ',
  'pattern.rows': 'Reihen',
  'pattern.cols': 'Spalten',
  'pattern.spacingX': 'Abstand X (mm)',
  'pattern.spacingY': 'Abstand Y (mm)',
  'pattern.startX': 'Start X (mm)',
  'pattern.startY': 'Start Y (mm)',
  'pattern.summary': '→ {n} Items auf Ebene {layer}',
  'pattern.cancel': 'Abbrechen',
  'pattern.generate': 'Generieren',
  'pattern.noItem': 'Kein Item-Typ ausgewählt',
  'pattern.created': '{n} Items erstellt',

  // Context menu
  'ctx.duplicate': 'Duplizieren',
  'ctx.snapToGrid': 'An Raster ausrichten',
  'ctx.layer': 'Ebene',
  'ctx.delete': 'Löschen',

  // Viewport / Grid info
  'view.3d': '3D Perspektive',
  'view.top': 'Draufsicht (XY)',
  'view.front': 'Vorderansicht (XZ)',
  'view.side': 'Seitenansicht (YZ)',
  'view.fit': 'Fit',
  'view.btn.3d': '3D',
  'view.btn.top': 'Top',
  'view.btn.front': 'Front',
  'view.btn.side': 'Side',

  // StatusBar
  'status.collision': 'Kollision',
  'status.dupOrder': 'dup.order',
  'status.overlap': 'overlap',
  'status.collisionTitle': '{n} überlappende Items',
  'status.dupOrderTitle': '{n} Items mit doppelter Order-ID',
  'status.toggleOn': 'Kollisionserkennung deaktivieren',
  'status.toggleOff': 'Kollisionserkennung aktivieren',

  // Measure tool
  'measure.setA': 'Klick: Punkt A setzen',
  'measure.setB': 'Klick: Punkt B setzen',
  'measure.reset': '✕ Reset',
  'measure.distance': 'Distanz: {d} mm',
  'measure.label': '{d} mm',

  // Shortcuts panel
  'shortcuts.title': 'Tastenkürzel',
  'shortcuts.views': 'Ansichten',
  'shortcuts.edit': 'Bearbeiten',
  'shortcuts.camera': 'Kamera',
  'shortcuts.1234': '1 / 2 / 3 / 4',
  'shortcuts.1234.desc': '3D · Top · Front · Side',
  'shortcuts.undo': 'Strg+Z / Strg+Shift+Z',
  'shortcuts.undo.desc': 'Rückgängig / Wiederholen',
  'shortcuts.selAll': 'Strg+A',
  'shortcuts.selAll.desc': 'Alles auswählen',
  'shortcuts.dup': 'Strg+D',
  'shortcuts.dup.desc': 'Duplizieren',
  'shortcuts.del': 'Entf',
  'shortcuts.del.desc': 'Löschen',
  'shortcuts.esc': 'Esc',
  'shortcuts.esc.desc': 'Auswahl aufheben',
  'shortcuts.arrows': '← ↑ → ↓',
  'shortcuts.arrows.desc': 'Verschieben 1 mm',
  'shortcuts.shiftArrows': 'Shift+Pfeile',
  'shortcuts.shiftArrows.desc': 'Verschieben 10 mm',
  'shortcuts.pageud': 'PageUp / Down',
  'shortcuts.pageud.desc': 'Ebene wechseln',
  'shortcuts.pan': 'Strg+Maus',
  'shortcuts.pan.desc': 'Ansicht verschieben',
  'shortcuts.rotate': 'Strg+Shift+Maus',
  'shortcuts.rotate.desc': 'Ansicht drehen',
  'shortcuts.zoom': 'Mausrad',
  'shortcuts.zoom.desc': 'Zoom zum Cursor',

  // Landing page
  'landing.title': 'Neue Konfiguration starten',
  'landing.subtitle': 'Lade eine Container-JSON-Datei, um den Editor zu starten.',
  'landing.hint': 'Für eine exakte Größen-Darstellung kannst du im Anschluss die passenden Item-Dateien hinzufügen.',
  'landing.loadContainer': 'Container-JSON-Datei auswählen',
  'landing.draftFound': 'Es wurde ein ungespeicherter Entwurf gefunden.',
  'landing.restore': 'Wiederherstellen',
  'landing.draftDate': 'Zuletzt gespeichert: {date}',
  'landing.privacy': 'Alle Änderungen werden ausschließlich lokal in deinem Browser verarbeitet. Es findet kein Upload auf einen Server statt.',
  'landing.disclaimer': 'Dieses Projekt ist ein unabhängiges Community-Tool und steht in keiner offiziellen Verbindung zur ABB-Gruppe. ABB™ und PickMaster™ sind eingetragene Marken der ABB Asea Brown Boveri Ltd.',

  // Disclaimer
  'disclaimer.line1': 'Kein offizielles ABB-Produkt.',
  'disclaimer.line2': 'PickMaster® ist eine eingetragene Marke von ABB Ltd.',

  // Toasts
  'toast.trayLoaded': 'Tray geladen: {name}',
  'toast.noTrayFile': 'Keine Tray-Datei erkannt',
  'toast.loadError': 'Fehler beim Laden',
  'toast.fileError': 'Fehler beim Laden von {name}',
  'toast.exported': 'Exportiert',
  'toast.noTrayExport': 'Kein Tray zum Exportieren',
  'toast.itemsLoaded': '{n} Item-Typ(en) geladen',
  'toast.newProject': 'Neues Projekt erstellt',
  'toast.restored': 'Projekt wiederhergestellt',
  'toast.noTray': 'Kein Tray geladen',
};
