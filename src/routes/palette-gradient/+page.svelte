<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import MageImageAdd from "~icons/mage/image-plus";
    import CardImage from "./components/CardImage.svelte";
    import "./style.css";
    import { actionHistory, type Action } from "./shared.svelte";
    import { passive } from "svelte/legacy";
    // Image files and previews
    let cardARef: CardImage;
    let cardBRef: CardImage;

    const keystate = {
        cmd: false,
    };

    function handleApplyToOtherA(event: CustomEvent) {
        const { palette, via } = event.detail;
        console.log("");
        cardBRef?.applyExternalMap(palette, via);
    }

    function handleApplyToOtherB(event: CustomEvent) {
        const { palette, via } = event.detail;
        cardARef?.applyExternalMap(palette, via);
    }
    let clientX = $state(0);
    let clientY = $state(0);

    function handleMouseMove(e: MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    export function performUndo() {
        const action = actionHistory.undo();
        if (action) {
            applyActionToCard(action);
            console.log(`Applying ${action.type} undo to ${action.tabID}`);
        }
    }

    export function performRedo() {
        const action = actionHistory.redo();
        if (action) {
            applyActionToCard(action);
            console.log(`Applying ${action.type} redo to ${action.tabID}`);
        }
    }

    function applyActionToCard(action: Action) {
        switch (action.tabID) {
            case "A":
                cardARef?.applyAction(action);
                break;
            case "B":
                cardBRef?.applyAction(action);
                break;
            default:
                break;
        }
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Meta") {
            keystate.cmd = true;
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
            event.preventDefault();
            if (event.shiftKey) {
                performRedo();
            } else {
                performUndo();
            }
        }
    }
</script>

<svelte:window on:mousemove={handleMouseMove} on:keydown={handleKeyPress} />
<div class="whole">
    <!-- <div class="title"><h4>Ollets</h4></div> -->
    <div class="middlebox">
        <div class="IOContainer">
            <!-- Palette Drop Zone -->
            <CardImage bind:this={cardARef} name="A" on:applyToOther={handleApplyToOtherA} on:undo={performUndo} on:redo={performRedo}></CardImage>
            <!-- Canvas Drop Zone -->
            <CardImage bind:this={cardBRef} name="B" on:applyToOther={handleApplyToOtherB} on:undo={performUndo} on:redo={performRedo}></CardImage>
        </div>
    </div>
</div>

<!-- <Number prefix={"$"}></Number> -->
<!-- STYLES -->
<style>
    .middlebox {
        display: flex;
        flex-direction: column;
        height: 90%;
        width: 90%;
        /* max-height: 700px;
    max-width: 1000px; */
        border-radius: 1rem;
        /* outline: 1px solid black; */
        align-items: center;
    }
    .whole {
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-family: Arial, Helvetica, sans-serif;
    }

    .IOContainer {
        flex: 9;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        gap: 1.25em;
        width: 100%;
        height: 100%;
        max-width: 1600px;
        min-height: 500px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 1rem;
        background: rgba(20, 20, 20, 0.4);
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    @media (max-width: 700px) {
        .IOContainer {
            flex-direction: column;
            height: auto;
            min-height: 100%;
            padding: 0.75rem;
        }
        .middlebox {
            height: 95%;
        }
    }
    @media (max-width: 480px) {
        .whole {
            font-size: 15px;
        }
    }
</style>
