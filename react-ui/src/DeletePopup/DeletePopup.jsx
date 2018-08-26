import React from 'react'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import styles from './DeletePopup_styles'

class DeletePopup extends React.Component {
    
    componentDidMount() {
        this.delete = (e) => {
            if (e.keyCode === 89) {
                this.props.deleteWord()
            } else if(e.keyCode === 78) {
                this.props.abortDelete()
            } else {
                return
            }
        }
        document.body.addEventListener("keydown", this.delete)
    }

    componentWillUnmount() {
        document.body.removeEventListener("keydown", this.delete)
    }

    render() {
        const {classes} = this.props
        return (
            <div className={classes.container}>
                <p>Вы уверены, что хотите удалить слово? (Y/N)</p>
                <Button onClick={this.props.deleteWord}>
                    Да
                </Button>
                <Button onClick={this.props.abortDelete}>
                    Отмена
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(DeletePopup)