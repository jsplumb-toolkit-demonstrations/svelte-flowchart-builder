
<script>
    import { onMount } from "svelte"
    import { AbsoluteLayout } from "@jsplumbtoolkit/core"
    import { newInstance,
        SurfaceComponent,
        render,
        EVENT_CANVAS_CLICK,
        EVENT_CLICK,
        EVENT_DBL_CLICK,
            EVENT_TAP,
        BlankEndpoint,
        ArrowOverlay, AnchorLocations, DEFAULT, LabelOverlay
    } from "@jsplumbtoolkit/browser-ui-svelte";

    import { initialiseDialogs } from './dialogs'

    import { OrthogonalConnector } from "@jsplumbtoolkit/connector-orthogonal"
    import * as ConnectorEditors from "@jsplumbtoolkit/connector-editors"
    import * as OrthogonalConnectorEditor from "@jsplumbtoolkit/connector-editors-orthogonal"
    import { DrawingToolsPlugin } from "@jsplumbtoolkit/browser-ui-plugin-drawing-tools"
    import { LassoPlugin } from "@jsplumbtoolkit/browser-ui-plugin-lasso"

    import ActionComponent from './components/ActionComponent.svelte'
    import OutputComponent from './components/OutputComponent.svelte'
    import QuestionComponent from './components/QuestionComponent.svelte'

    import Controls from './Controls.svelte'

    OrthogonalConnectorEditor.initialize()

    export let data;

    let surfaceComponent;

    let dialogs = initialiseDialogs()

    let pathEditor;
    const toolkit = newInstance()

    const START = "start"
    const OUTPUT = "output"
    const ACTION = "action"
    const QUESTION = "question"
    const SELECTABLE = "selectable"
    const SOURCE = "source"
    const TARGET = "target"
    const RESPONSE = "response"

    /**
     * Optional props injector for vertices. In this app we supply a manager to each vertex that offers remove and edit methods.
     * @param vertex
     * @return {{}}
     */
    function injectManager(vertex) {
        return {
            manager:{
                remove: (vertex) => {
                    toolkit.removeNode(vertex)
                },
                edit:(vertex) => {
                    dialogs.editName(vertex.data, (d) => {
                        if (d.text && d.text.length > 2) {
                            // if name is at least 2 chars long, update the underlying data and
                            // update the UI.
                            toolkit.updateNode(vertex, d);
                        }
                    })

                }
            }
        }
    }

    function editLabel(edge, deleteOnCancel) {
        dialogs.showEdgeLabelDialog(edge.data, (data) => {
            toolkit.updateEdge(edge, { label:data.label || "" });
        }, () => {
            if (deleteOnCancel) {
                toolkit.removeEdge(edge);
            }
        })
    }

    const viewParams = {
        nodes:{
            [SELECTABLE]: {
                events: {
                    [EVENT_TAP]:  (params) => {
                        toolkit.toggleSelection(params.obj);
                    }
                }
            },
            action:{
                parent:SELECTABLE,
                component:ActionComponent
            },
            question:{
                parent:SELECTABLE,
                component:QuestionComponent
            },
            output:{
                parent:SELECTABLE,
                component:OutputComponent
            }
        },
        edges: {
            [DEFAULT]: {
                anchor:AnchorLocations.AutoDefault,
                endpoint:BlankEndpoint.type,
                connector: { type:OrthogonalConnector.type, options:{ cornerRadius: 5 } },
                paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
                hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
                events: {
                    [EVENT_DBL_CLICK]:  (params) => {
                        dialogs.confirmDelete({text:"Edge"}, () => {
                            toolkit.removeEdge(params.edge)
                        })
                    },
                    [EVENT_CLICK]: (params) => {
                        pathEditor.startEditing(params.edge, {})
                    }
                },
                overlays: [
                    { type:ArrowOverlay.type, options:{ location: 1, width: 10, length: 10 }},
                    { type:ArrowOverlay.type, options:{ location: 0.3, width: 10, length: 10 }}
                ]
            },
            [RESPONSE]:{
                parent:DEFAULT,
                overlays:[
                    {
                        type: LabelOverlay.type,
                        options:{
                            label: "{{label}}",
                            events:{
                                [EVENT_CLICK]:(params) => {
                                    editLabel(params.edge);
                                }
                            }
                        }
                    }
                ]
            }
        },
        ports: {
            [START]: {
                edgeType: DEFAULT
            },
            [SOURCE]: {
                maxConnections: -1,
                edgeType: RESPONSE
            },
            [TARGET]: {
                maxConnections: -1,
                isTarget: true
            }
        }
    }

    const renderParams = {
        layout:{
            type:AbsoluteLayout.type
        },
        zoomToFit:true,
        dragOptions: {
            filter: ".jtk-draw-handle, .node-action, .node-action i"
        },
        plugins:[
            DrawingToolsPlugin.type, LassoPlugin.type
        ],
        defaults:{
            connector:OrthogonalConnector.type
        },
        events: {
            [EVENT_CANVAS_CLICK]: (e) => {
                toolkit.clearSelection()
                pathEditor.stopEditing()
            }
        },
        consumeRightClick:false
    }

    function load(data) {
        toolkit.load({data})
    }

    function zoom() {
        surfaceComponent.getSurface().zoomToFit()
    }

    function undo() { toolkit.undo() }
    function redo() { toolkit.redo() }

    function clear() {
        if(confirm("Clear flowchart?")) {
            toolkit.clear()
        }
    }

    function setMode(evt) {
        surfaceComponent.getSurface().setMode(evt.detail)
    }

    onMount( async() => {
        pathEditor = ConnectorEditors.newInstance(surfaceComponent.getSurface())

        if (data) {
            load(data)
        }
    })

</script>


<div class="jtk-demo-canvas" id="canvas">
    <SurfaceComponent viewParams={viewParams}
                      renderParams={renderParams}
                      toolkit={toolkit}
                      bind:this={surfaceComponent}
                        injector={injectManager}
    />
    <!-- controls -->
    <Controls on:zoomToFit={zoom} on:undo={undo} on:redo={redo} on:clear={clear} on:mode={setMode}/>
    <!-- miniview -->
    <div class="miniview"></div>
</div>

<div class="jtk-demo-rhs">

    <!-- the node palette -->
    <div class="node-palette sidebar" id="node-palette"></div>
    <div class="description">
        <p>
            This sample application is a builder for flowcharts. Questions, actions and outputs are supported.
        </p>
        <ul>
            <li>Drag new nodes from the palette on the left onto whitespace to add new disconnected nodes</li>
            <li>Drag new nodes from the palette on the left onto on edge to drop a node between two existing nodes</li>
            <li>Drag from the grey border of any node to any other node to establish a link, then provide a description for the link's label</li>
            <li>Click a link to edit its label.</li>
            <li>Click the 'Pencil' icon to enter 'select' mode, then select several nodes. Click the canvas to exit.</li>
            <li>Click the 'Home' icon to zoom out and see all the nodes.</li>
        </ul>
    </div>
</div>

