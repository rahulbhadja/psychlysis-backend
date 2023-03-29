import express from 'express'
import { SurveyResponse } from '../models/SurveyResponse'
import { SurveyInfo } from '../models/Survey'
const EmailUser = require('../models/EmailUser')

let router = express.Router()

router.post('/create', async (req: any, res) => {
  const {
    surveyName,
    surveyType,
    ccReward,
    usdReward,
    duration,
    bountyFrequency,
    questions,
    description,
  } = req.body

  if (
    !surveyName ||
    !surveyType ||
    !questions
    // || !usdReward
  ) {
    return res.send({
      success: false,
      message: 'Unable to create survey, missing required fields',
    })
  }
  // if(!req?.user){
  // 	return res.send({ success: false,
  // 		message: "Unable to create survey, user not logged in" });
  // }

  const survey = new SurveyInfo({
    surveyName,
    surveyType,
    ccReward,
    usdReward,
    duration,
    description,
    bountyFrequency,
    questions,
  })
  await survey.save()
  if (survey) {
    return res.send({
      success: true,
      message: 'Survey created successfully',
      createdSurvey: survey,
    })
  } else {
    return res.send({
      success: false,
      message: 'Survey creation failed',
    })
  }
})

router.get('/getall', async (req: any, res) => {
  // if(!req?.user){
  // 	return res.send({ success: false,
  // 		message: "Unable to get survey, user not logged in" });
  // }
  const survey = await SurveyInfo.find({})

  if (survey) {
    return res.send({
      success: true,
      message: 'Survey fetched successfully',
      fetchedSurvey: survey,
    })
  } else {
    return res.send({
      success: false,
      message: 'Survey fetch failed',
    })
  }
})

router.get('/get/:surveyId', async (req: any, res) => {
  const { surveyId } = req.params

  if (!surveyId) {
    return res.send({
      success: false,
      message: 'Unable to get survey, missing required fields',
    })
  }
  // if(!req?.user){
  // 	return res.send({ success: false,
  // 		message: "Unable to get survey, user not logged in" });
  // }
  const survey = await SurveyInfo.findOne({
    surveyId,
  })

  if (survey) {
    return res.send({
      success: true,
      message: 'Survey fetched successfully',
      fetchedSurvey: survey,
    })
  }
})

router.post('/submit', async (req: any, res) => {
  const { response, userId, surveyId, surveyName } = req.body

  if (!response || !userId || !surveyId || !surveyName) {
    return res.send({
      success: false,
      message: 'Unable to submit survey, missing required fields',
    })
  }
  // if(!req?.user){
  // 	return res.send({ success: false,
  // 		message: "Unable to submit survey, user not logged in" });
  // }
  try {
    // const user = User.findOne({
    // 	address: userAddress,
    // })
    // if(!user){
    // 	return res.send({ success: false,
    // 		message: "Unable to submit survey, user not registered" });
    // }

    const user = await EmailUser.findOne({
      userId,
    })

    if (!user) {
      return res.send({
        success: false,
        message: 'Unable to submit survey, user not registered',
      })
    }

    const userSubmittedSurvey = await SurveyResponse.findOne({
      userId,
      surveyId,
    })
    if (userSubmittedSurvey) {
      return res.send({
        success: false,
        message:
          'Opps! Looks like you already submitted this survey, Please submit another survey.',
      })
    }

    const userResponse = new SurveyResponse({
      response,
      userId,
      surveyId,
      surveyName,
    })
    await userResponse.save()
    if (userResponse) {
      return res.send({
        success: true,
        message:
          'Well done! You have successfully submitted the survey. Please wait for the next survey to be released.',
        submittedSurvey: userResponse,
      })
    }
  } catch (error) {
    return res.send({
      success: false,
      message: 'Survey submission failed',
      error: error,
    })
  }
})

// get specific users survey response
router.get('/getresponse/:userId', async (req: any, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.send({
      success: false,
      message: 'Unable to get survey, missing required fields',
    })
  }

  const survey = await SurveyResponse.find({
    userId: userId,
  })

  if (survey) {
    return res.send({
      success: true,
      message: 'Survey fetched successfully',
      fetchedSurvey: survey,
    })
  } else {
    return res.send({
      success: false,
      message: 'Survey fetch failed',
    })
  }
})

export default router
