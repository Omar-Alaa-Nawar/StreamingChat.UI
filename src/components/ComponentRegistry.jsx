import SimpleComponent from "./SimpleComponent";
import TableA from "./TableA";
import ChartComponent from "./ChartComponent";

/**
 * Component Registry - Maps component type strings to React components
 *
 * Usage:
 *   const Component = ComponentRegistry['SimpleComponent'];
 *   <Component id={id} data={data} />
 *
 * To add new components:
 *   1. Import the component
 *   2. Add to the registry object
 */
const ComponentRegistry = {
  SimpleComponent: SimpleComponent,
  TableA: TableA,
  ChartComponent: ChartComponent,
  // Future components:
  // etc.
};

export default ComponentRegistry;
