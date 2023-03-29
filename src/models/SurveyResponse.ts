import { Schema, model } from 'mongoose'

export interface SurveyResponseInterface {
  surveyId: string
  email: string
  surveyVersion?: string
  response: { [key: string]: string }
}

const SurveyResponseSchema = new Schema({
  surveyId: {
    type: String,
    required: true,
  },
  surveyName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  response: {
    type: {},
    required: true,
  },
})

export const SurveyResponse = model<SurveyResponseInterface>(
  'SurveyResponse',
  SurveyResponseSchema
)
