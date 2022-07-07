const { readFile, writeFile } = require('fs/promises')
const { v4: uuidv4 } = require('uuid')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const allQuestions = await getQuestions()
    const specificQuestion = allQuestions.find(
      question => question.id == questionId
    )
    return specificQuestion
  }

  const addQuestion = async question => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    const id = uuidv4()
    question.id = id
    await questions.push(question)

    await writeFile(fileName, JSON.parse(questions), 'utf-8')
    return questions
  }

  const getAnswers = async questionId => {
    const specificQuestion = await getQuestionById(questionId)
    const answers = specificQuestion.answers
    return answers
  }
  const getAnswer = async (questionId, answerId) => {
    const allAnswers = await getAnswers(questionId)
    const specificAnswer = allAnswers.find(answer => answer.id === answerId)
    return specificAnswer
  }
  const addAnswer = async (questionId, answer) => {
    let allQuestions = await getQuestions()
    let specificQuestion = await getQuestionById(questionId)
    let answers = await getAnswers(questionId)
    const id = uuidv4()
    answer.id = id
    const newAnswers = [...answers, answer]
    const newSpecificQuestion = { ...specificQuestion, answers: newAnswers }

    const allQuestionsWOthisOne = allQuestions.filter(
      question => question.id !== questionId
    )

    const newAllQuestions = [...allQuestionsWOthisOne, newSpecificQuestion]
    await writeFile(fileName, JSON.stringify(newAllQuestions), 'utf-8')
    return newAllQuestions
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
