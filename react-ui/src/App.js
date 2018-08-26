import React from 'react';
import axios from 'axios'
import Form from './Form/Form'
import WordsList from './WordsList/WordsList'
import { withStyles } from '@material-ui/core/styles';
import styles from './App_styles'
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './index.css'

class App extends React.Component {
      constructor(props) {
          super(props)
          this.state = {
              words: [],
              isFetching: false,
              displaySucces: false,
              displayForm: false
          }
          this.fetchWords = this.fetchWords.bind(this)
          this.showSucces = this.showSucces.bind(this)
      }

      componentDidMount() {
          this.fetchWords()

          this.changeForm = (e) => {
              if(e.keyCode === 17) {
                this.setState((prev) => ({displayForm: !prev.displayForm}))
              } else {
                  return
              }
          }

          document.body.addEventListener("keydown", this.changeForm)
      }

      componentWillUnmount() {
          document.body.removeEventListener("keydown", this.changeForm)
      }

      showSucces() {
          this.setState((prev) => ({displaySucces: !prev.displaySucces}))
      }

      fetchWords() {
          this.setState({isFetching: true})
          axios.get('/api')
          .then(res => {
              this.setState({words: res.data, isFetching: false})
          })
      }

      render() {
          const {classes} = this.props
        if(this.state.isFetching) {
          return <p>Загрузка...</p>
        } else {
          return (
            <div> 
                <p className={classes.indexDescription}>Вы можете использовать стрелки для навигации.</p>
                <p className={classes.indexDescription}>Стрелка вправо - следующее слово, влево - предыдущее. Стрелка вверх - показать первод. Стрелка вниз - удалить слово. CTRL - открыть/закрыть форму.</p>
                {this.state.displaySucces ? 
                <Paper elevation={1} className={classes.succes}>
                    <Typography className={classes.succesText} variant="headline" component="h3">Готово!</Typography>
                </Paper>
                :
                null
                }
          {this.state.displayForm ? 
          <div className={classes.mainForm}>
            <Form
            fetchWords={this.fetchWords}
            showSucces={this.showSucces}
            />
            <Button variant="outlined" onClick={() => this.setState({displayForm: false})}>
                Скрыть форму
            </Button>
          </div>
          :
          <Button  size="small" variant="outlined" className={classes.addButton} onClick={() => this.setState({displayForm: true})}>Добавить слово</Button>
          }
          <WordsList
          words={this.state.words}
          fetchWords={this.fetchWords}
          showSucces={this.showSucces}
          />
          </div>
          )
        }
      }
}

export default withStyles(styles)(App);
