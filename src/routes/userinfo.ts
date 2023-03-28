import express from 'express'
import { SurveyResponse } from '../models/SurveyResponse'

let router = express.Router()

router.get('/completed-survey/:userId', async (req: any, res) => {
  const { userId } = req.params

  try {
    if (!userId) {
      return res.send({
        success: false,
        message: 'Unable to get survey, missing required fields',
      })
    }

    const survey = await SurveyResponse.find({ userId: userId })
    if (survey) {
      return res.send({
        success: true,
        message: 'Survey found successfully',
        completedSurvey: survey,
      })
    } else {
      return res.send({
        success: false,
        message: "User doesn't have any completed survey",
      })
    }
  } catch (err) {
    return res.send({
      success: false,
      message: 'request failed',
    })
  }
})

router.get('/completed-survey/:userId/:surveyId', async (req: any, res) => {
  const { userId, surveyId } = req.params

  try {
    if (!userId || !surveyId) {
      return res.send({
        success: false,
        message: 'Unable to get survey, missing required fields',
      })
    }

    // find survey name form the surveyId

    const survey = await SurveyResponse.find({
      userId: userId,
      surveyId: surveyId,
    })

    if (survey) {
      return res.send({
        success: true,
        message: 'Survey found successfully',
        survey,
      })
    } else {
      return res.send({
        success: false,
        message: 'Survey not found',
      })
    }
  } catch (err) {
    return res.send({
      success: false,
      message: 'User not found',
    })
  }
})

export default router
