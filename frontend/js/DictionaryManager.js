// This code was written with assistance from ChatGPT (OpenAI).

class DictionaryManger {

    static API_BASE_URL = "https://shark-app-5cb96.ondigitalocean.app/api/definitions/"
    static async storeDefinition(word, definition, responseId) {
        if (!this.checkValidation(word) || !this.checkValidation(definition)) {
            responseId.innerHTML = INVALID_INPUT_TEXT;
        }
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", this.API_BASE_URL);
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

            xhr.onload = () => {
                if (xhr.status == 200) {
                    const response = JSON.parse(xhr.response);
                    const message = response.message;
                    if (message) {
                        responseId.innerHTML = message;
                    } else {
                        responseId.innerHTML = STORE_ERROR_TEXT;
                    }
                } else {
                    responseId.innerHTML = STORE_ERROR_TEXT;
                }
            }
            xhr.onerror = () => {
                responseId.innerHTML = STORE_ERROR_TEXT;
            }
            xhr.send(JSON.stringify({ "word": word, "definition": definition }));
        } catch (e) {
            responseId.innerHTML = `${ERROR_TEXT}: ${e}`
        }
    }

    static async searchWord(word, responseId) {
        if (!this.checkValidation(word)) {
            responseId.innerHTML = INVALID_INPUT_TEXT;
            return;
        }
        try {
            const response = await fetch(
                `${this.API_BASE_URL}?word=${word}`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();


            if (!response.ok) {
                if (response.status === 404) {
                    responseId.innerHTML = WORD_NOT_FOUND;
                    return;
                } else {
                    responseId.innerHTML = SEARCH_ERROR_TEXT;
                    return;
                }
            }
            responseId.innerHTML = data.message;
            return;

        } catch (error) {
            responseId.innerHTML = SEARCH_ERROR_TEXT;
            throw error;
        }
    }
    static checkValidation(word) {
        if (typeof word !== "string" || word.trim() === "") return false;
        if (/\d/.test(word)) return false;
        return true;
    }
}