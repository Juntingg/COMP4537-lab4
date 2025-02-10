document.getElementById("title").innerText = STORE_TITLE_TEXT;
document.getElementById("wordLabel").innerText = STORE_WORD_LABEL;
document.getElementById("definitionLabel").innerText = STORE_DEFINITION_LABEL;
document.getElementById("submit").innerHTML = ADD_WORD_BUTTON;

document.getElementById("submit").addEventListener("click",async ()=>{
    const wordContent = document.getElementById("word").value; 
    const definitionContent = document.getElementById("definition").value;
    document.getElementById("messageLabel").innerHTML = "";
    await DictionaryManger.storeDefinition(wordContent, definitionContent, "search_result");

})