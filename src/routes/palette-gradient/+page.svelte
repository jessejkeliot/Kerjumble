<div class="whole">
  <div class="title"><h1>Palette Generator</h1></div>
  <div class="IOContainer">
    <div class="imageHolder input">
        <label for="palette">Drop Palette File</label>
        <input type="file" name="Palette File" id="palette" hidden>
    </div>
    <div class="imageHolder output"><input type="file" name="Palette File" id="palette"></div>
  </div>
</div>

<style>
  * {
    outline: 1px solid #000 !important;
  }
  .title {
    color: #000;
    font-family: Helvetica;
    font-style: italic;
    /* outline: 1px solid black; */
    display: flex;
    align-items: center;
  }
  .title h1 {
    color: #fff0;
    text-shadow: 0 0 20px #222;
    padding: 0;
    margin: 0;
    font-size: 6rem;
    animation: fadeColorIn 1.2s ease 1s forwards;
    user-select: none;
  }
  .whole {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .IOContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    width: 90%;
    height: 70%;
    max-width: 1000px;
  }
  @media (max-width: 600px) {
    .IOContainer {
      flex-direction: column; /* switch to column under 600px */
    }
    .imageHolder {
      width: 100%;
    }
  }
  .imageHolder {
    flex: 1;
    height: 100%;
    border-radius: 0.5rem;
    box-shadow: inset 0 0 10px #0005;
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes fadeColorIn {
    from {
        color: #0000;
    }
    to {
        color: #0009;
    }
  }
</style>
