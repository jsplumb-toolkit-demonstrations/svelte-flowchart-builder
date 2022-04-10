<script>

    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    export let manager

</script>

<div style="width:{data.w}px;height:{data.h}px" class="flowchart-object flowchart-action" data-jtk-target="true" data-jtk-port-type="target">
    <svg width={data.w} height={data.h}>
        <rect x="10" y="10" width={data.w-20} height={data.h-20} class="inner" rx="5" ry="5"/>
    </svg>
    <span>{data.text}</span>
    <div class="node-edit node-action" on:click={() => manager.edit(vertex)}></div>
    <div class="node-delete node-action" on:click={() => manager.remove(vertex)}></div>
    <div class="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
</div>
