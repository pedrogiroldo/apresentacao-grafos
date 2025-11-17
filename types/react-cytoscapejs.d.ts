declare module 'react-cytoscapejs' {
  import { Component } from 'react';
  import Cytoscape from 'cytoscape';

  export interface CytoscapeComponentProps {
    elements?: Cytoscape.ElementDefinition[];
    style?: React.CSSProperties;
    stylesheet?: Cytoscape.Stylesheet[];
    layout?: Cytoscape.LayoutOptions;
    cy?: (cy: Cytoscape.Core) => void;
    zoom?: number;
    pan?: Cytoscape.Position;
    minZoom?: number;
    maxZoom?: number;
    autoungrabify?: boolean;
    autounselectify?: boolean;
    boxSelectionEnabled?: boolean;
    className?: string;
    id?: string;
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
