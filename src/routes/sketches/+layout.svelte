<script>
  import { page } from "$app/state";
  import MainContainer from "$lib/components/MainContainer.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  const rootroute = "/sketches";

  let examples = [
    {
      title: "Organ",
      route: "/sketches/organ",
    },
    {
      title: "Wave",
      route: "/sketches/wavemaker",
    },
  ];
</script>

<div>
  <MainContainer>
    <Sidebar header={"Sketches"} elements={examples} {rootroute} />
    <div class="slot">
      <slot />
    </div>
  </MainContainer>
</div>

<style>
  .slot {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  div {
    flex: 1;
    height: 100%;
    width: 100%;
  }
</style>
