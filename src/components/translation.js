"use client"

import { useEffect } from "react"
import languageData from "./info.js"
import "@fortawesome/fontawesome-free/css/all.min.css"

const LanguageTranslator = () => {
  useEffect(() => {
    const sourceText = document.querySelector(".source-text")
    const targetText = document.querySelector(".target-text")
    const swapIcon = document.querySelector(".swap-languages")
    const languageSelectors = document.querySelectorAll("select")
    const actionIcons = document.querySelectorAll(".row i")
    const translateButton = document.querySelector("button")

    // Populate language dropdowns
    languageSelectors.forEach((selector, index) => {
      for (const langCode in languageData) {
        const isSelected = index === 0 
          ? langCode === "en-GB" ? "selected" : ""
          : langCode === "hi-IN" ? "selected" : ""
        const option = `<option ${isSelected} value="${langCode}">${languageData[langCode]}</option>`
        selector.insertAdjacentHTML("beforeend", option)
      }
    })

    // Swap languages handler
    const handleSwap = () => {
      const tempText = sourceText.value
      const tempLang = languageSelectors[0].value
      sourceText.value = targetText.value
      targetText.value = tempText
      languageSelectors[0].value = languageSelectors[1].value
      languageSelectors[1].value = tempLang
    }

    // Translate handler
    const handleTranslate = async () => {
      const text = sourceText.value.trim()
      const sourceLang = languageSelectors[0].value
      const targetLang = languageSelectors[1].value
      
      if (!text) return
      
      targetText.placeholder = "Translating..."
      try {
        const response = await fetch(
          `http://localhost:5000/?text=${text}&source=${sourceLang}&target=${targetLang}`
        )
        targetText.value = await response.text()
        targetText.placeholder = "Translation"
      } catch (error) {
        console.error("Translation error:", error)
        targetText.placeholder = "Error in translation"
      }
    }

    // Icon click handler
    const handleIconClick = (event) => {
      const icon = event.currentTarget
      const row = icon.closest(".row")
      const isSource = row.classList.contains("source")

      if (icon.classList.contains("fa-copy")) {
        const text = isSource ? sourceText.value : targetText.value
        navigator.clipboard.writeText(text)
      } else {
        const text = isSource ? sourceText.value : targetText.value
        const lang = isSource ? languageSelectors[0].value : languageSelectors[1].value
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        speechSynthesis.speak(utterance)
      }
    }

    // Event listeners
    swapIcon.addEventListener("click", handleSwap)
    translateButton.addEventListener("click", handleTranslate)
    actionIcons.forEach(icon => icon.addEventListener("click", handleIconClick))

    // Cleanup
    return () => {
      swapIcon.removeEventListener("click", handleSwap)
      translateButton.removeEventListener("click", handleTranslate)
      actionIcons.forEach(icon => icon.removeEventListener("click", handleIconClick))
    }
  }, [])

  return (
    <>
      <div className="header-container">
        <h1 className="header-content">Language Translator</h1>
      </div>

      <div className="app-container">
        <div className="content-wrapper">
          <div className="input-output">
            <textarea spellCheck="false" className="source-text" placeholder="Enter text"></textarea>
            <textarea spellCheck="false" readOnly className="target-text" placeholder="Translation"></textarea>
          </div>
          <ul className="options">
            <li className="row source">
              <div className="action-icons">
                <i className="fas fa-volume-up"></i>
                <i className="fas fa-copy"></i>
              </div>
              <select></select>
            </li>
            <li className="swap-languages">
              <i className="fas fa-exchange-alt"></i>
            </li>
            <li className="row target">
              <select></select>
              <div className="action-icons">
                <i className="fas fa-volume-up"></i>
                <i className="fas fa-copy"></i>
              </div>
            </li>
          </ul>
        </div>
        <button>Translate Text</button>
      </div>
    </>
  )
}

export default LanguageTranslator
