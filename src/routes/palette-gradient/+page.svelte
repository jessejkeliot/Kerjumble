<div class="IOContainer">
    <div class="imageHolder input"></div>
    <div class="imageHolder output"></div>
</div>

<style>
    .IOContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        width: 100%;
        height: 70%;
        max-width: 1000px;
    }
    .imageHolder {
        flex: 1;
        height: 100%;
        background-color: #000a;
        border-radius: 0.5rem;
        box-shadow: inset 0 0 10px #0005;
        backdrop-filter: blur(8px);
    }
</style>