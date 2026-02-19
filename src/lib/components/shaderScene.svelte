<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { VideoTexture } from "three";
  import defaultVertexShader from "$lib/shaders/vertex/basic.vert?raw";

  let { shaderCode, config, width, height } = $props();

  // Reactive States
  let time = $state(0);
  let zoom = $state(1);
  let viewOffset = $state({ x: 0, y: 0 });
  let mousePos = $state({ x: 0, y: 0 });
  let videoTexture = $state<VideoTexture | null>(null);

  // 1. Stable Uniforms Object
  // We initialize these so Three.js reserves the "slots" on the GPU
  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: [0, 0] },
    u_zoom: { value: 1 },
    u_viewOffset: { value: [0, 0] },
    u_mousePos: { value: [0, 0] },
    u_webcam: { value: null }
  };

  // 2. Sync Svelte State to Three.js Uniforms
  // This $derived/effect pattern is the "Gold Standard" for Svelte 5 + Three.js
  $effect(() => {
    uniforms.u_resolution.value = [width, height];
    uniforms.u_zoom.value = zoom;
    uniforms.u_viewOffset.value = [viewOffset.x, viewOffset.y];
    uniforms.u_mousePos.value = [mousePos.x, mousePos.y];
    uniforms.u_webcam.value = videoTexture;
  });

  // 3. Frame loop for time
  useTask((delta) => {
    time += delta;
    uniforms.u_time.value = time;
  });

  // 4. Input Listeners (Correctly cleaned up)
  $effect(() => {
    if (!config.keyboard) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "w") viewOffset.y += 0.1;
      if (e.key === "s") viewOffset.y -= 0.1;
      if (e.key === "a") viewOffset.x += 0.1;
      if (e.key === "d") viewOffset.x -= 0.1;
      if (e.key === "ArrowUp") zoom += 0.1;
      if (e.key === "ArrowDown") zoom -= 0.1;
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  // 5. Webcam Logic
  $effect(() => {
    if (config.webcam && !videoTexture) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        videoTexture = new VideoTexture(video);
      });
    }
  });
</script>

<T.Mesh>
  <T.PlaneGeometry args={[2, 2]} />
  <T.ShaderMaterial
    vertexShader={defaultVertexShader}
    fragmentShader={shaderCode}
    {uniforms}
  />
</T.Mesh>