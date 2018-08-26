import React from 'react'
import axios from 'axios';
import DeletePopup from '../DeletePopup/DeletePopup'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import styles from './WordsList_style'

class WordsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentWord: 0,
            displayTranslation: false,
            confirmDeletePopup: false 
        }
        this.prevWord = this.prevWord.bind(this)
        this.nextWord = this.nextWord.bind(this)
        this.deleteWord = this.deleteWord.bind(this)
    }

    nextWord() {
        this.setState(prev => {
            if(prev.currentWord>=this.props.words.length-1) {
                return {currentWord: 0}
            } else {
                return {currentWord: prev.currentWord+1}
            }
        })
    }

    prevWord() {
        this.setState(prev => {
            if (prev.currentWord<=0) {
                return {currentWord: this.props.words.length-1}
            } else {
                return {currentWord: prev.currentWord-1}
            }
        })
    }
    
    componentDidMount() {
        this.keyEvents = (e) => {
            switch(e.keyCode) {
                case 37: //Стрелка влево, прошлое слово.
                    this.prevWord()
                    this.setState({displayTranslation: false})
                    break
                case 38: //Стрелка вверх, перевод.
                    this.setState({displayTranslation: true})
                    break
                case 39: //Стрелка вправо, следующее слово.
                    this.nextWord()
                    this.setState({displayTranslation: false})
                    break
                case 40: //Стрелка вниз, удалить слово.
                    this.setState({confirmDeletePopup: true})
                    break
                default: 
                    return 
            }
        }

        document.body.addEventListener("keydown", this.keyEvents)
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.keyEvents)
    }

    deleteWord() {
        axios.delete(`/api/delete/${this.props.words[this.state.currentWord]._id}`)
        .then(res => {
            this.props.showSucces()
            this.props.fetchWords()
            setTimeout(() => this.props.showSucces(), 2000)
        })
    }

    render() {
        const {classes} = this.props
        if(!this.props.words || this.props.words.length===0) {
            return (
                <div>
                <p className={classes.noWords}>Слов еще нет.</p>
                <p className={classes.noWords}>Попробуйте добавить новое.</p>
                </div>
            )
        } else {
        return (
            <div>
            {this.state.confirmDeletePopup ?
            <DeletePopup
            deleteWord={this.deleteWord}
            abortDelete={() => this.setState({confirmDeletePopup: false})}
            />
            :
            null
            }
            
            <p className={classes.mainWord}>{this.props.words[this.state.currentWord].word}</p>
            
            <div className={classes.buttonContainer}>
            {this.state.displayTranslation ? 
            <p className={classes.mainWord}>{this.props.words[this.state.currentWord].translation}</p>
            :
            <Button variant="outlined" color="primary" className={classes.button}
            onClick={() => this.setState({displayTranslation: true})}
            >
            Показать перевод
            </Button>
            }
            <Button variant="outlined" color="primary" className={classes.button}
            onClick={() => {
                this.prevWord()
                this.setState({displayTranslation: false})
            }}
            >
            Прошлое слово
            </Button>

            <Button variant="outlined" color="primary" className={classes.button}
            onClick={() => {
                this.nextWord()
                this.setState({displayTranslation: false})
            }}
            >
            Следующее слово
            </Button>
            <Button  variant="outlined" color="secondary"
            onClick={() => this.setState({confirmDeletePopup: true})}>
                Удалить слово
            </Button>
            </div>
        </div>
        )
    }
    }
}


export default withStyles(styles)(WordsList)