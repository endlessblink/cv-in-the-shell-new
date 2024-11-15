'use client'

import { useState } from 'react'
import OpenAI from 'openai'

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [currentResume, setCurrentResume] = useState('')
  const [generatedResume, setGeneratedResume] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateResume = async () => {
    if (!apiKey || !jobDescription || !qualifications || !currentResume) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')
    setGeneratedResume('')

    try {
      console.log('Starting resume generation...')
      console.log('Initializing OpenAI client...')
      const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

      console.log('Making API request to OpenAI...')
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Your task is to create a tailored resume based on the provided job description, qualifications, and current resume. Focus on relevant experience and skills that match the job requirements.'
          },
          {
            role: 'user',
            content: `
Job Description:
${jobDescription}

Candidate Qualifications:
${qualifications}

Current Resume:
${currentResume}

Please create a tailored resume that highlights the relevant experience and skills for this job position. Format the resume professionally and ensure it is ATS-friendly.`
          }
        ],
        temperature: 0.7,
      })

      console.log('Successfully received response from OpenAI')
      setGeneratedResume(response.choices[0].message.content || '')
    } catch (err) {
      console.error('Error generating resume:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while generating the resume')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <h1>CV in the Shell - AI Resume Generator</h1>
      
      <div className="form-group">
        <label htmlFor="apiKey">OpenAI API Key</label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="qualifications">Your Qualifications</label>
        <textarea
          id="qualifications"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          placeholder="List your relevant qualifications and skills..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentResume">Current Resume</label>
        <textarea
          id="currentResume"
          value={currentResume}
          onChange={(e) => setCurrentResume(e.target.value)}
          placeholder="Paste your current resume here..."
        />
      </div>

      <button onClick={generateResume} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Resume'}
      </button>

      {error && <div className="error">{error}</div>}
      
      {generatedResume && (
        <div className="result">
          <h2>Generated Resume:</h2>
          {generatedResume}
        </div>
      )}
    </main>
  )
}
