import '../style.scss'

class UI {
  constructor () {
    this.template = `
    <div class="__stutter_text">
      <span class="__stutter_left"></span><span class="__stutter_right"></span>
    </div>`
    this.holder = document.createElement('div')
    this.holder.classList.add('__stutter')
    this.holder.innerHTML = this.template
    this.left = this.holder.getElementsByClassName('__stutter_left')[0]
    this.right = this.holder.getElementsByClassName('__stutter_right')[0]
  }

  show (word) {
    this.left.textContent = word.val.substr(0, word.index)
    this.right.textContent = word.val.substr(word.index)
  }

  hide () {
    if (this.holder.parentNode) {
      this.holder.parentNode.removeChild(this.holder)
    }
  }

  reveal () {
    if (!this.holder.parentNode) {
      document.body.insertBefore(this.holder, document.body.childNodes[0])
    }
  }
}

export let ui = new UI()
