import React from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import styles from './Form_styles'

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            word: "",
            isFetching: false,
            displayError: false
        }
    }

    sendWord(e) {
        e.preventDefault()
        const word = this.state.word
        if(!word.trim() || !/^[a-z' ]*$/i.test(word)) {
            this.setState({displayError: true, word: ""})
            setTimeout(() => this.setState({displayError: false}), 3000)
        } else {
            axios.post('/api/new', {word})
            .then(res => {
                this.props.showSucces()
                this.props.fetchWords()
                setTimeout(() => this.props.showSucces(), 2000)
            })
        }
    }

    render() {
        const {classes} = this.props
        return (
            <div>
                {this.state.displayError ? 
                <p className={classes.error}>Введите слово на английском языке. Убедитесь, что отсутсвуют цифры, кириллица или другие символы.</p>
                :
                null
                }
        <form
        onSubmit={(e) => this.sendWord(e)}
        >
            <p>Введите слово на английском языке, чтобы сохранить его в словарь.</p>
            <TextField 
            type="text"
            onChange={(e) => this.setState({word: e.currentTarget.value})}
            value={this.state.word}
            className={classes.text}
            />
            <Button className={classes.addButton} variant="outlined"
            onClick={(e) => this.sendWord(e)}>
                Добавить
            </Button>
        </form>
        </div>
        )
    }
}

export default withStyles(styles)(Form)