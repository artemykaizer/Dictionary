const axios = require('axios')
const API_KEY = "trnsl.1.1.20180824T101418Z.dbc18982a7f64d54.016b6f7b5a43c67bf4cbdd5108b3fed74e7da366"
const MAIN_URL = "https://translate.yandex.net/api/v1.5/tr.json/translate"

function makeTranslation (word, done) {
    axios.get(`${MAIN_URL}?key=${API_KEY}&text=${word}&lang=en-ru&format=plain`)
    .then(res => {
        console.log(res.data.text)
        done(res.data.text.toString())
    })
}

module.exports = {
    makeTranslation
}