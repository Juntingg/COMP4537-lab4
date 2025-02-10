document.getElementById("title").innerText = SEARCH_TITLE_TEXT;
document.getElementById("wordLabel").innerText = SEARCH_WORD_LABEL;
const submitBtn = document.getElementById("submit");
submitBtn.innerText = SEARCH_WORD_BUTTON;
const resultContainer = document.getElementById("search_result");

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const wordContent = document.getElementById("word").value;
    resultContainer.innerHTML = "";
    const result = await DictionaryManger.searchWord(wordContent, resultContainer);
    resultContainer.innerHTML = result.message;

})