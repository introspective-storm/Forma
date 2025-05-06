import { GoogleGenAI} from '@google/genai'
import { AI_SYSTEM_INSTRUCTIONS, GOOGLE_AI_KEY } from '$env/static/private'

// set new genAI
const ai = new GoogleGenAI({apiKey: GOOGLE_AI_KEY})

// function declarations
const entryPointAPIFunctionDeclaration = {
    name: "entry_point_api",
    description: "The entry for the microservice API. It decides where to send the data off to for further processing given a JSON.",
    parameters: {
      type: "object",
      properties: {
        request: {
          type: "object",
          // enum: ["cleaning", "regression", "stochastic", "survival", "timeseries", "descriptive_statistics", "ml", "non_parametric"],
          description: `These are major categories, and directly help the API determine where to send the data off to. If a user request fits one or more
                        of these fields, then the category was choosen as a request. If that category was not choosen, then simply keep the field as null.
                        If none of these categories work, then keep every field as null.`,
          properties: {
            cleaning: {
              type: "array",
              description: "If 'cleaning' was choosen as a request, then choose one or many of the following options here.",
              items: {
                type: "string",
                enum:["duplicates", "missing-values", "outliers", "consistency", "normalization", "standardization", "encoding"],
              }
            },
            descriptive_statistics: {
              type: "array",
              description: "If 'descriptive_statistics' was choosen as a request, then choose one or many of the following options here to calculate the needed statistics",
              items: {
                type: "string",
                enum:["mean", "median", "mode", "variance", "standard-deviation", "quartiles", "skewness", "kurtosis"],
              }
            },
            // non_parametric: {
            //   type: "array",
            //   enum:[],
            //   description: ""
            // },
            regression: {
              type: "string",
              enum:["simple-linear", "multiple-linear", "logistic", "lasso", "ridge", "polynomial"],
              description: "If 'regression' was choosen as a request, then choose one of the following options here to run the right type of regression.",
            },
            stochastic: {
              type: "string",
              enum:["discrete-markov", "continuous-markov", "poisson", "compound-poisson", "brownian"],
              description: "If 'stochastic' was choosen as a request, then choose one of the following options here to model the data under the right type of stochastic process.",
            },
            survival: {
              type: "array",
              description: "If 'survival' was choosen as a request, then choose one or many of the following options here to model the data correctly using survival analysis.",
              items: {
                type: "string",
                enum:["km", "life-table", "log-rank-test", "wilcoxon-test", "cox-proportional-hazards", "parametric"]
              }
            },
            timeseries: {
              type: "array",
              description: "If 'timeseries' was choosen as a request, then choose one or many of the following options here to run the right type of time-series model and technique.",
              items: {
                type: "string",
                enum:["arma", "arima", "sarima", "holt-winters-additive", "holt-winters-multiplicative"],
              }
            },
            ml: {
              type: "string",
              enum:["pca", "svm", "k-means", "gmm", "random-forests", "bart"],
              description: "If 'ml' was choosen as a request, then choose one or many of the following options here to use a machine learning algorithim to help with understanding the data.",
            }
          }
        },
        data: {
            type: "object",
            description: "This field holds the data required for the API. Pay close attention to not changing the actual numbers, but still keeping it in the format outlined here.",
            properties: {
              columns: {
                type: "array",
                description: "The name/header of each column in the dataset (eg. ['x1', 'x2']). Please ensure they are all strings.",
                items: {type: "string"}
              },
              x: {
                type: "array",
                description: `Holds the actual data. Each columns in the dataset should be an array as well 
                              (eg. the x1 and x2 column, who's data is [1,2,3] and [4,5,6] respectivly will corospond to [[1,2,3], [4,5,6]]).
                              If the data is categorical, then please let it be a number that indicates category 
                              (eg. "red, blue, green" can become 0,1,2)`,
                items: {
                  type: "array",
                  items: {
                    type: "number"
                  }
                }
              }
            }
        }
      },
      required: ['request', 'data']
    }
};

// model config settings
const modelConfig = {
  systemInstruction: AI_SYSTEM_INSTRUCTIONS,
  tools: [{
    functionDeclarations: [entryPointAPIFunctionDeclaration]
    }]
}

// pass user prompt to model, and return output/function call
/*
TODO: clean up the lumi function. For multi-chat turns, instead have this function return after every turn with the chat history.
The first chat history will be empty (and in the future, only for new chats). Run the model once and get back a response, and save it in
the return object. Then, pass it back down to the model, this time with the history. This should ensure a better flow and more control
on the server.
*/
async function lumi(message, conversationHistory=[]) {

  const contents = [...conversationHistory, {role: "user", parts: [{text: message}]}]
  // model response to user
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: contents,
    config: modelConfig
  });

  const functionCall = response.functionCalls

  if(functionCall) {
    for (const fn of functionCall) {
      if(fn.name === "entry_point_api") {
        const entryPointAPICall = {
          method: "POST",
          request: fn.args.request,
          data: fn.args.data
        }
        //temp checking to see if it runs
        console.log(entryPointAPICall)

        return {
          latestModelResponse: {role:"model", parts: [{functionCall: fn}]},
          conversationHistory: [...contents, {role:"model", parts: [{functionCall: fn}]}],
          functionResult: entryPointAPICall
        }
        // push function call and response after it is received, and return
        // contents.push({role:"model", parts: [{functionCall: fn}]})
        // contents.push({role:"user", parts: [{functionResponse: {name: "entry_point_api", response: {result: "hi!"}}}]}) //using just the json as temp check

      } else if(fn.name === "create_chart") {
        const createChart = {
          chart_type: fn.args.chart_type,
          data: fn.args.data
        }
        //temp checking to see if it runs
        console.log(createChart)

        return {
          latestModelResponse: {role:"model", parts: [{functionCall: fn}]},
          conversationHistory: [...contents, {role:"model", parts: [{functionCall: fn}]}],
          functionResult: createChart
        }
        // push function call and response after it is received
        // contents.push({role:"model", parts: [{functionCall: fn}]})
        // contents.push({role:"user", parts: [{functionResponse: {name: "create_chart", response: {result: "hi!"}}}]}) //using just the json as temp check
      }
    }

  } else if(response.text) {
    return {
      latestModelResponse: {role:"model", parts: [{text: response.text}]},
      conversationHistory: [...contents, {role:"model", parts: [{text: response.text}]}],
      functionResult: null
    }
    //append user and model response to contents array
    // contents.push({role:"user", parts: [{text: message}]})
    // contents.push({role:"model", parts: [{text: response.text}]})
  } else {
    return {
      latestModelResponse: {role:"model", parts: [{text: "Something went wrong, please try asking me again."}]},
      conversationHistory: [...contents, {role:"model", parts: [{text: "Something went wrong, please try asking me again."}]}],
      functionResult: createChart
    }
    // console.log("Something went wrong with Lumi")
  }
  // call the model again, and append the result of the
  // const finalResponse = await ai.models.generateContent({
  //   model: 'gemini-2.0-flash',
  //   contents: contents,
  //   config: modelConfig
  // });
  // contents.push({role:"model", parts: [{text: finalResponse.text}]})

  // return {
  //   latestModelResponse: contents[contents.length-1], // get last response
  //   functionCall: response.functionCalls,
  //   allResponses: contents,
  //   modelReply: contents[contents.length-1].parts[0].text
  // }
}

export {lumi}