import { Environments, ToneMaps, DebugOutput } from './rendering_parameters.js';

class gltfUserInterface
{
    constructor(
        modelPathProvider,
        selectedModel,
        renderingParameters,
        stats)
    {
        this.modelPathProvider = modelPathProvider;
        this.selectedModel = selectedModel;
        this.renderingParameters = renderingParameters;
        this.stats = stats;

        this.gui = undefined;
        this.gltfFolder = undefined;

        this.onModelSelected = undefined;
    }

    initialize()
    {
        this.gui = new dat.GUI({ width: 300 });

        this.initializeGltfFolder();
        this.initializeLightingSettings();
        this.initializeDebugSettings();
        this.initializeMonitoringView();
    }

    initializeGltfFolder()
    {
        this.gltfFolder = this.gui.addFolder("glTF");

        this.initializeModelsDropdown();
        this.initializeGltfVersionView("");
        this.initializeSceneSelection([]);
        this.initializeCameraSelection([]);

        this.gltfFolder.open();
    }

    initializeModelsDropdown()
    {
        const modelKeys = this.modelPathProvider.getAllKeys();
        if (!modelKeys.includes(this.selectedModel))
        {
            this.selectedModel = modelKeys[0];
        }

        const self = this;
        this.gltfFolder.add(this, "selectedModel", modelKeys).name("Model").onChange(modelKey => self.onModelSelected(modelKey));
    }

    initializeGltfVersionView(version)
    {
        this.version = version;
        if (this.versionView !== undefined)
        {
            this.gltfFolder.remove(this.versionView);
        }
        this.versionView = this.gltfFolder.add(this, "version", version).name("glTF Version").onChange(() => this.version = version);
    }

    initializeSceneSelection(scenes)
    {
        if (this.sceneSelection !== undefined)
        {
            this.gltfFolder.remove(this.sceneSelection);
        }
        this.sceneSelection = this.gltfFolder.add(this.renderingParameters, "sceneIndex", scenes).name("Scene Index");
    }

    initializeCameraSelection(cameras)
    {
        if (this.cameraSelection !== undefined)
        {
            this.gltfFolder.remove(this.cameraSelection);
        }
        const camerasWithUserCamera = [ "default" ].concat(cameras);
        this.cameraSelection = this.gltfFolder.add(this.renderingParameters, "cameraIndex", camerasWithUserCamera).name("Camera Index");
    }

    initializeLightingSettings()
    {
        const self = this;
        const lightingFolder = this.gui.addFolder("Lighting");
        lightingFolder.add(this.renderingParameters, "useIBL").name("Image-Based Lighting");
        lightingFolder.add(this.renderingParameters, "usePunctual").name("Punctual Lighting");
        lightingFolder.add(this.renderingParameters, "environmentName", Object.keys(Environments)).name("Environment")
            .onChange(() => self.onModelSelected(self.selectedModel));
        lightingFolder.add(this.renderingParameters, "exposure", 0, 10, 0.1).name("Exposure");
        lightingFolder.add(this.renderingParameters, "gamma", 0, 10, 0.1).name("Gamma");
        lightingFolder.add(this.renderingParameters, "toneMap", Object.values(ToneMaps)).name("Tone Map");
        lightingFolder.addColor(this.renderingParameters, "clearColor", [50, 50, 50]).name("Background Color");
    }

    initializeDebugSettings()
    {
        const debugFolder = this.gui.addFolder("Debug");
        debugFolder.add(this.renderingParameters, "debugOutput", Object.values(DebugOutput)).name("Debug Output");
    }

    initializeMonitoringView()
    {
        const monitoringFolder = this.gui.addFolder("Performance");
        this.stats.domElement.height = "48px";
        for (const child of this.stats.domElement.children)
        {
            child.style.display = "";
        }
        this.stats.domElement.style.position = "static";
        const statsList = document.createElement("li");
        statsList.appendChild(this.stats.domElement);
        statsList.classList.add("gui-stats");
        monitoringFolder.__ul.appendChild(statsList);
    }
}

export { gltfUserInterface };
