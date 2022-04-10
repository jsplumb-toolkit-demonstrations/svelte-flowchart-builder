<script>

    export let data;
    export let toolkit;
    export let surface;
    export let vertex;

    export let manager;
</script>

<div style="width:{data.w}px;height:{data.h}px" class="flowchart-object flowchart-question" data-jtk-target="true" data-jtk-port-type="target">
    <svg width={data.w} height={data.h}>
        <path d="M {data.w/2}  10 L {data.w - 10} {data.h/2} L {data.w/2} {data.h - 10} L 10 {data.h/2} Z" class="inner"/>
    </svg>
    <span>{data.text}</span>
    <div class="node-edit node-action" on:click={() => manager.edit(vertex)}></div>
    <div class="node-delete node-action delete" on:click={() => manager.remove(vertex)}></div>
    <div class="drag-start connect" data-jtk-source="true" data-jtk-port-type="source"></div>
</div>
