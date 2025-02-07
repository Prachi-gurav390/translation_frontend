
"use client"

import { useEffect } from "react"
import languageData from "./info.js"

const LanguageTranslator = () => {
  useEffect(() => {
    const sourceText = document.querySelector(".source-text")
    const targetText = document.querySelector(".target-text")
    const swapIcon = document.querySelector(".swap-languages")
    const languageSelectors = document.querySelectorAll("select")
    const actionIcons = document.querySelectorAll(".row i")
    const translateButton = document.querySelector("button")

    languageSelectors.forEach((selector, index) => {
      for (const langCode in languageData) {
        const isSelected =
          index === 0 ? (langCode === "en-GB" ? "selected" : "") : langCode === "hi-IN" ? "selected" : ""
        const optionElement = `<option ${isSelected} value="${langCode}">${languageData[langCode]}</option>`
        selector.insertAdjacentHTML("beforeend", optionElement)
      }
    })

    swapIcon.addEventListener("click", () => {
      const tempText = sourceText.value
      const tempLang = languageSelectors[0].value
      sourceText.value = targetText.value
      targetText.value = tempText
      languageSelectors[0].value = languageSelectors[1].value
      languageSelectors[1].value = tempLang
    })

    sourceText.addEventListener("keyup", () => {
      if (!sourceText.value) {
        targetText.value = ""
      }
    })

    translateButton.addEventListener("click", async () => {
      const textToTranslate = sourceText.value.trim()
      const sourceLang = languageSelectors[0].value
      const targetLang = languageSelectors[1].value
      if (!textToTranslate) return
      targetText.setAttribute("placeholder", "Translating...")
      try {
        const response = await fetch(
          `http://localhost:5000/?text=${textToTranslate}&source=${sourceLang}&target=${targetLang}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const translatedContent = await response.text()
        targetText.value = translatedContent
        targetText.setAttribute("placeholder", "Translation")
      } catch (error) {
        console.error("Fetch error:", error)
        targetText.setAttribute("placeholder", "Error in translation")
      }
    })

    actionIcons.forEach((icon) => {
      icon.addEventListener("click", ({ target }) => {
        if (!sourceText.value || !targetText.value) return
        if (target.classList.contains("fa-copy")) {
          if (target.id === "source") {
            navigator.clipboard.writeText(sourceText.value)
          } else {
            navigator.clipboard.writeText(targetText.value)
          }
        } else {
          let speechUtterance
          if (target.id === "source") {
            speechUtterance = new SpeechSynthesisUtterance(sourceText.value)
            speechUtterance.lang = languageSelectors[0].value
          } else {
            speechUtterance = new SpeechSynthesisUtterance(targetText.value)
            speechUtterance.lang = languageSelectors[1].value
          }
          speechSynthesis.speak(speechUtterance)
        }
      })
    })
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
            <textarea spellCheck="false" readOnly disabled className="target-text" placeholder="Translation"></textarea>
          </div>
          <ul className="options">
            <li className="row source">
              <div className="action-icons">
                <i id="source" className="fas fa-volume-up"></i>
                <i id="source" className="fas fa-copy"></i>
              </div>
              <select></select>
            </li>
            <li className="swap-languages">
              <i className="fas fa-exchange-alt"></i>
            </li>
            <li className="row target">
              <select></select>
              <div className="action-icons">
                <i id="target" className="fas fa-volume-up"></i>
                <i id="target" className="fas fa-copy"></i>
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


