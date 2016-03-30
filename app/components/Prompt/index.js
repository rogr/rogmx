import React from 'react'
import classNames from 'classnames'

import styles from './styles.css'

class Prompt extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      prompt: '',
      promptValid: true
    }
    this.prompt = this.prompt.bind(this)
    this.promptBlur = this.promptBlur.bind(this)
    this.promptFocus = this.promptFocus.bind(this)
    this.promptEnter = this.promptEnter.bind(this)
    this.promptChange = this.promptChange.bind(this)
    this.promptKeyStroke = this.promptKeyStroke.bind(this)
  }

  static promptInterval = null

  componentWillMount () {
    this.setState({prompt: this.props.command})
    this.prompt(this.props.command)
  }

  componentWillReceiveProps (nextProps) {
    const promptCaret = this.refs.caret
    promptCaret.style.backgroundColor = '#0091FF'
    promptCaret.style.border = 'none'

    this.prompt(nextProps.command)
  }

  prompt (promptValue) {
    let prompAux = ''
    const prompInputText = './'

    clearInterval(this.promptInterval)
    promptValue.split('').forEach((char, i) => {
      window.setTimeout(() => {
        prompAux += char
        this.setState({prompt: prompInputText + prompAux})
        if (i === promptValue.length - 1) {
          this.promptFocus()
        }
      }, 200 * i)
    })
  }

  promptFocus () {
    const promptInput = this.refs.prompt
    const promptCaret = this.refs.caret

    promptInput.focus()
    promptCaret.style.backgroundColor = '#0091FF'
    promptCaret.style.border = 'none'
    this.promptInterval = window.setInterval(() => {
      if (promptCaret.style.visibility === 'visible') {
        promptCaret.style.visibility = 'hidden'
      } else {
        promptCaret.style.visibility = 'visible'
      }
    }, 250)
  }

  promptBlur () {
    const promptCaret = this.refs.caret

    clearInterval(this.promptInterval)
    promptCaret.style.visibility = 'visible'
    promptCaret.style.backgroundColor = '#262626'
    promptCaret.style.border = '1px solid #fff'
  }

  promptChange (e) {
    const promptInput = this.refs.prompt
    this.setState({prompt: promptInput.value})
  }

  promptKeyStroke (e) {
    e = e || window.event
    const key = e.keyCode
    const arrows = [38, 40, 37, 39]
    if (arrows.indexOf(key) > -1) {
      e.preventDefault()
    }
  }

  promptEnter (e) {
    e.preventDefault()
    let promptValue = this.state.prompt.replace(/^\s+|\s+$/g, '').replace(' ', '-').toLowerCase()
    this.setState({prompt: promptValue})

    let command = promptValue.replace('./', '')
    command = command.indexOf('bowie') > -1 ? 'bowie' : command

    const promptActions = {
      'exit': () => {
        this.setState({compact: false, section: '', prompt: ''})
      },
      'twitter': () => {
        console.log('Twitter!')
      },
      'github': () => {
        console.log('Github!')
      },
      'music': () => {
        console.log('Music!')
      },
      'blog': () => {
        console.log('Blog!')
      },
      'otis': () => {
        console.log('Auuuuu uh! uuuh! uuuh!')
      },
      'bowie': () => {
        console.log('Wham Bam Thank You Mam!')
      }
    }

    const promptNotFound = () => {
      const tempPrompt = this.state.prompt
      this.setState({prompt: 'Error: Command not found.', promptValid: false})
      setTimeout(() => {
        this.setState({prompt: tempPrompt, promptValid: true})
      }, 666)
    }

    if (promptActions.hasOwnProperty(command)) {
      promptActions[command]()
    } else {
      promptNotFound()
    }
  }

  render () {
    return (
      <form className={styles.Prompt} onSubmit={this.promptEnter}>
        <div className={classNames({
          [styles.Prompt__CMD]: true,
          [styles['Prompt__CMD--error']]: !this.state.promptValid
        })} onClick={this.promptFocus}>
          <span className={styles.Prompt__Symbol}>»</span>
          <span className={styles.Prompt__CMD__Input}>{this.state.prompt}</span>
          <div ref='caret' className={styles.Prompt__CMD__Caret}></div>
        </div>
        <input ref='prompt' type='text' value={this.state.prompt} onChange={this.promptChange} onBlur={this.promptBlur} onKeyDown={this.promptKeyStroke} />
      </form>
    )
  }
}

Prompt.propTypes = {
  command: React.PropTypes.string
}

export default Prompt
