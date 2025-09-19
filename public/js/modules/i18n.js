import { fetchJson} from "../utils/fetchJson.js";
import {updateText} from "./dom.js";

export async function loadLanguage(lang){
    try {
        const translations = await fetchJson(`.locales/${lang}.json`);
        updateText(translations);
    } catch (error) {
        console.error("Error loading language:", error);
    }
}