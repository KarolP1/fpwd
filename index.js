const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const id = req.params.questionId

  const specificQuestion = await req.repositories.questionRepo.getQuestionById(
    id
  )

  if (specificQuestion.length === 0) {
    res.json({ message: 'No questions found' })
    return
  }
  res.json(specificQuestion)
})

app.post('/questions', async (req, res) => {
  const { author, summary } = req.body
  if (author === undefined || summary === undefined) {
    res.json({ succes: 'false', message: ' author or summary undefined' })
    return
  }
  const newQuestion = { id: '', author, summary, answers: [] }
  const questions = await req.repositories.questionRepo.addQuestion(newQuestion)
  res.json({ questions })
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const id = req.params.questionId
  const specificQuestionAnswers =
    await req.repositories.questionRepo.getAnswers(id)
  res.json(specificQuestionAnswers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const questionId = req.params.questionId
  const { author, summary } = req.body
  const answer = { id: '', author, summary }
  const newAnswer = await req.repositories.questionRepo.addAnswer(
    questionId,
    answer
  )
  res.json(newAnswer)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { answerId, questionId } = req.params

  const specificQuestionAnswer = await req.repositories.questionRepo.getAnswer(
    questionId,
    answerId
  )
  res.json(specificQuestionAnswer)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
