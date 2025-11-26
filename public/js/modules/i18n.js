import { fetchJson} from "../utils/fetchJson.js";
import {updateText} from "./dom.js";

// Variable global para almacenar las traducciones actuales
let currentTranslations = {};

export async function loadLanguage(lang){
    try {
        const translations = await fetchJson(`./locales/${lang}.json`);
        currentTranslations = translations; // Guardar traducciones para uso global
        updateText(translations);
        updatePageTitle(translations); // Agregar esta línea para actualizar el título
    } catch (error) {
        console.error("Error loading language:", error);
    }
}

// Función para obtener una traducción específica
export function getTranslation(key) {
    return currentTranslations[key] || key;
}

// Función para actualizar el título de la página
function updatePageTitle(translations) {
    if (translations['page-title']) {
        document.title = translations['page-title'];
    }
}
