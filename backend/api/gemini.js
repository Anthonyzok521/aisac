const {GoogleGenerativeAI} = require("@google/generative-ai");
const {GoogleAIFileManager} = require("@google/generative-ai/files");

const {GEMINI_API_KEY, SYSTEM_INSTRUCTION, GENERATION_CONFIG, getHistory} = require("../config/config");

class AISAC {
    constructor() {

        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        this.fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            systemInstruction: SYSTEM_INSTRUCTION,
            });

        this.generationConfig = GENERATION_CONFIG;

        this.chatSession = {};

        //Singleton
        if (AISAC.instance) {
            console.log("AISAC initialized already");
            return AISAC.instance;            
        }
        AISAC.instance = this;
        console.log("AISAC initialized");
    }

    async uploadToGemini(path, mimeType) {
        const uploadResult = await this.fileManager.uploadFile(path, {
            mimeType,
            displayName: path,
        });

        const file = uploadResult.file;
        console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
        return file;
    }

    async waitForFilesActive(files) {
        console.log("Waiting for file processing...");
        for (const name of files.map((file) => file.name)) {
            let file = await this.fileManager.getFile(name);
            while (file.state === "PROCESSING") {
                //process.stdout.write(".")
                await new Promise((resolve) => setTimeout(resolve, 10_000));
                file = await this.fileManager.getFile(name);
            }
            if (file.state !== "ACTIVE") {
                throw Error(`File ${file.name} failed to process`);
            }
        }
        console.log("...all files ready\n");
    }

    async Run(prompt) {

        //const result = await model.generateContent(prompt);
        /* const response = await result.response;
        const text = response.text();
        console.log(text); */

        const result = await this.chatSession.sendMessage(prompt);
        return result;
    }

    async LoadFiles(){
        const files = [
            await this.uploadToGemini("documents/Pensum-Informática-2024.md", "text/markdown"),
            await this.uploadToGemini("documents/Horarios-Profesores-Informática.md", "text/markdown"),
        ];

        const chatSession = this.model.startChat({
            generationConfig : this.generationConfig,
            // safetySettings: Adjust safety settings
            // See https://ai.google.dev/gemini-api/docs/safety-settings
            history: getHistory(files)
        });
        
        await this.waitForFilesActive(files);

        this.setChatSession(chatSession);
    }

    setChatSession(value) {
        this.chatSession = value;
    }
}

module.exports = {
    AISAC
};