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
    <main className="min-h-screen bg-background p-8 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-100/20 via-teal-100/20 to-violet-100/20" />
      
      {/* Spotlight effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[100px] transition-all duration-1000 group-hover:via-white/20" />

      <div className="container mx-auto max-w-3xl relative">
        {/* Title Section */}
        <div className="text-center mb-8 relative">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 animate-gradient mb-2 tracking-tight">
              CV in the Shell
            </h1>
            {/* Animated underline */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-shimmer opacity-50" />
          </div>
          
          {/* Animated badge */}
          <div className="inline-flex items-center px-3 py-1 mt-3 text-sm font-medium rounded-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-lg animate-gradient">
            <span className="mr-1">Powered by</span>
            <span className="text-emerald-400">GPT-4</span>
          </div>

          {/* Description Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left">
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-lg font-semibold mb-2 text-slate-800">1. Input Details</div>
              <p className="text-sm text-slate-600">Enter your OpenAI API key, paste the job description, and provide your qualifications.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-lg font-semibold mb-2 text-slate-800">2. Current Resume</div>
              <p className="text-sm text-slate-600">Share your existing resume to use as a base for the AI-powered enhancement.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-lg font-semibold mb-2 text-slate-800">3. Generate</div>
              <p className="text-sm text-slate-600">Let AI tailor your resume to match the job requirements perfectly.</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="mb-8 relative overflow-hidden border border-slate-800/20 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Resume Generator</CardTitle>
            <CardDescription>Fill in the details below to generate your tailored resume</CardDescription>
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
                className="transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
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
                className="min-h-[100px] transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
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
                className="min-h-[100px] transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
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
                className="min-h-[200px] transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateResume}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 hover:opacity-90 transition-all duration-300 animate-gradient bg-[length:200%_200%]"
            >
              {isLoading ? 'Generating...' : 'Generate Resume'}
            </Button>
          </CardFooter>
        </Card>

        {error && (
          <Card className="border-destructive animate-in slide-in-from-top-4 duration-300">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {generatedResume && (
          <Card className="animate-in slide-in-from-bottom-4 duration-300 border border-slate-800/20 bg-white shadow-xl">
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
