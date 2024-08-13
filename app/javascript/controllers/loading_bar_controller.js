import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["bar", "percentage"]

  connect() {
    this.hideBar()
    this.setupTurboListeners()
  }

  setupTurboListeners() {
    document.addEventListener("turbo:before-visit", this.showBar.bind(this))
    document.addEventListener(
      "turbo:before-fetch-response",
      this.startProgress.bind(this)
    )
    document.addEventListener("turbo:load", this.hideBar.bind(this))
  }

  showBar() {
    this.element.classList.remove("hidden")
    this.progress = 0 // Initialize progress here
    this.barTarget.style.width = "0%"
    this.percentageTarget.textContent = "0%" // Initialize percentage text
    this.interval = setInterval(() => this.updateProgress(), 100) // Start progress update interval
  }

  startProgress() {
    this.progress = 0 // Reset progress on visit
    clearInterval(this.interval) // Clear any existing interval
    this.interval = setInterval(() => this.updateProgress(), 100) // Start a new interval
  }

  updateProgress() {
    this.progress += Math.random() * 10
    if (this.progress >= 100) {
      this.progress = 100
      this.hideBar() // Stop the interval and hide the bar when complete
      clearInterval(this.interval)
    }
    this.barTarget.style.width = `${this.progress}%`
    this.percentageTarget.textContent = `${Math.round(this.progress)}%`
  }

  hideBar() {
    this.barTarget.style.width = "100%"
    setTimeout(() => {
      this.element.classList.add("hidden")
    }, 3000)
  }
}
