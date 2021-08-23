const axios = require("axios")
const fs = require("fs")
const path = require("path")
const vocab = require("./terms").terms

const currentDirectorey = path.join(__dirname)
// vars
const API_KEY = "1434c8af-81d1-4571-906b-8c556d7ef48b"
let combined = {}
let missing = []

// get defs
const getDefs = (terms) => {
  // make array of requests
  let requests = terms.map((term) => {
    return axios.get(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${term}?key=${API_KEY}`
    )
  })
  // return responses

  return Promise.allSettled(requests).catch((err) => console.log(err))
}

// driver code
const main = async (terms) => {
  let defs = await getDefs(terms)

  for (def of defs) {
    if (def.value.data[0]?.meta?.id) {
      combined[`${def.value.data[0].meta.id}`] = def.value.data[0].shortdef[0]
    }
  }

  for (let term of terms) {
    if (!combined[term] && !combined[`${term}:1`]) {
      missing.push(term)
    }
  }

  fs.writeFile(
    `${currentDirectorey}/definitions.json`,
    JSON.stringify(combined),
    (err) => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    }
  )

  fs.writeFile(
    `${currentDirectorey}/missing.json`,
    JSON.stringify(missing),
    (err) => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    }
  )

  return combined
}

main(vocab)
