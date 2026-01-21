<script lang="ts">
    import { shaderRegistry } from "$lib/shaders/shader_registry";
    import { page } from "$app/state";
    import { T } from "@threlte/core";
    import { VideoTexture } from "three";

    // 1. Get the raw shader code (using the ?raw suffix)
    const date = page.params.date;
    const shaderCode = import.meta.glob(`$lib/shaders/*.frag`, { as: "raw", eager: true })[`$lib/shaders/${date}.frag`];

    // 2. Get the metadata for today
    const meta = shaderRegistry[date] || { title: "Untitled" };

    // 3. Conditional logic for Keyboard and Mouse
    let viewOffset = { x: 0, y: 0 };
    let zoom = 1;
    if (meta.keyboard) {
        window.addEventListener("keydown", (e) => {
            if ("viewOffset" in meta.uniforms) {
                //y
                if (e.key === "w") viewOffset.y += 0.1;
                if (e.key === "s") viewOffset.y -= 0.1;
                //x
                if (e.key === "a") viewOffset.x += 0.1;
                if (e.key === "d") viewOffset.x -= 0.1;
            }
            if ("zoom" in meta.uniforms) {
                //edit zoom
                if (e.key === "ArrowUp") zoom += 0.1;
                if (e.key === "ArrowDown") zoom -= 0.1;
            }
        });
    }

    let mousePos = { x: 0, y: 0 };
    if (meta.keyboard) {
        window.addEventListener("mousemove", (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });
    }

    // 4. Conditional logic for Webcam
    let videoTexture: VideoTexture | null = null;
    async function setupWebcam() {
        if (!meta.webcam) return;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        videoTexture = new VideoTexture(video);
    }
    setupWebcam();
</script>

<T.Mesh>
    <T.PlaneGeometry args={[2, 2]} />
    <T.ShaderMaterial
        fragmentShader={shaderCode}
        uniforms={{
            u_time: { value: 0 },
            // These are only "active" if the registry says so
            u_zoom: {value: zoom},
            u_viewOffset: { value: [viewOffset.x, viewOffset.y] },
            u_webcam: { value: videoTexture },
            u_mousePos: { value: [mousePos.x, mousePos.y] },
        }}
    />
</T.Mesh>
