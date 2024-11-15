'use client'

import { useState } from 'react'
import OpenAI from 'openai'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

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
    <main className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-3xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">CV in the Shell</CardTitle>
            <CardDescription>Generate a tailored resume using AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                OpenAI API Key
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Your Qualifications
              </label>
              <Textarea
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="List your qualifications and skills..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Current Resume
              </label>
              <Textarea
                value={currentResume}
                onChange={(e) => setCurrentResume(e.target.value)}
                placeholder="Paste your current resume here..."
                className="min-h-[200px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateResume}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Generate Resume'}
            </Button>
          </CardFooter>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {generatedResume && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Resume</CardTitle>
              <CardDescription>Your AI-tailored resume is ready</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap font-mono text-sm">
                {generatedResume}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
