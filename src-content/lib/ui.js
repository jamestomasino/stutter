class UI {
  constructor () {
    this.template = ``
  }

  show (word) {
    console.log('[UI::show]', word)
  }
}

export let ui = new UI()
