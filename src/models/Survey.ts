import { Schema, model } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const SurveyInfoSchema = new Schema({
  surveyName: {
    type: String,
    required: true,
  },
  surveyId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4(),
  },
  surveyType: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  questions: {
    type: {},
    required: true,
  },
})

export const SurveyInfo = model('SurveyInfo', SurveyInfoSchema)
