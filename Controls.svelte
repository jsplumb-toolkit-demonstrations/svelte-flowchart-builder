<script>

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

</script>

<div class="controls">
    <i class="fa fa-arrows selected-mode" data-mode="pan" title="Pan Mode" on:click={() => dispatch('mode', 'pan')}></i>
    <i class="fa fa-pencil" data-mode="select" title="Select Mode" on:click={() => dispatch('mode', 'select')}></i>
    <i class="fa fa-home" data-reset title="Zoom To Fit" on:click={() => dispatch('zoomToFit')}></i>
    <i class="fa fa-undo" data-undo="true" title="Undo last action" on:click={() => dispatch('undo')}></i>
    <i class="fa fa-repeat" data-redo="true" title="Redo last action" on:click={() => dispatch('redo')}></i>
    <i class="fa fa-times" title="Clear flowchart" on:click={() => dispatch('clear')}></i>
</div>
