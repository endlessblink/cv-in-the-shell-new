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
    if (!apiKey) {
      setError('Please enter your OpenAI API key')
      return
    }
    if (!jobDescription) {
      setError('Please enter the job description')
      return
    }
    if (!currentResume) {
      setError('Please enter your current resume')
      return
    }

    try {
      setError('')
      setIsLoading(true)

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })

      const prompt = `
You are an expert ATS-optimization and resume writing specialist. Please convert the provided CV into an ATS-optimized format following these specific requirements:

FORMAT REQUIREMENTS:
- Use single-column layout
- Convert to plain text format
- Use standard bullet points (•) only
- Remove all tables, graphics, columns, text boxes
- Use standard formatting
- Maintain consistent spacing
- Keep under 2 pages
- Use MM/YYYY date format

STRUCTURE (Follow this exact order):
1. Contact Information
   - Full Name
   - Professional Email
   - Phone Number
   - City, State
   - LinkedIn URL (if provided)

2. Professional Summary (3-4 lines)
   - Match keywords from job description
   - Focus on relevant skills and achievements
   - Quantify impact where possible

3. Technical Skills
   - List hard skills first
   - Group by category
   - Include relevant keywords from job posting
   - Remove outdated/irrelevant skills

4. Professional Experience
   For each position:
   - Company Name
   - Job Title
   - Location (City, State)
   - Employment Dates (MM/YYYY - MM/YYYY)
   - 3-5 achievement-focused bullets per role
   - Start each bullet with action verbs
   - Include metrics and quantifiable results
   - Use present tense for current role, past for previous

5. Education
   - Degree, Major
   - University Name
   - Graduation Date (MM/YYYY)
   - Relevant coursework (if recent graduate)
   - GPA if above 3.5 (if provided)

6. Certifications (if provided)
   - Name of certification
   - Issuing organization
   - Date obtained (MM/YYYY)
   - Expiration date if relevant

OPTIMIZATION RULES:
1. Match exact keywords from job description
2. Use standard industry terminology
3. Spell out acronyms at first use
4. Remove personal pronouns
5. Eliminate articles (a, an, the) when possible
6. Start achievement bullets with strong action verbs
7. Focus on measurable impacts and results
8. Remove references section
9. Eliminate irrelevant hobbies/interests

Job Description:
${jobDescription}

${qualifications ? `Additional Qualifications:
${qualifications}

Use these additional qualifications to enhance the Professional Summary and Technical Skills sections where relevant.` : ''}

Current Resume:
${currentResume}

Please process this CV according to the above specifications while maintaining relevant content and optimizing for ATS compatibility. Format the output in plain text with clear section breaks and consistent spacing.`

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        temperature: 0.7,
        max_tokens: 2000
      })

      setGeneratedResume(completion.choices[0].message.content || '')
    } catch (err) {
      setError('Error generating resume. Please check your API key and try again.')
      console.error('Error:', err)
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
              <p className="text-sm text-slate-600">Enter your OpenAI API key and paste the target job description. Your resume will be optimized for ATS systems.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-lg font-semibold mb-2 text-slate-800">2. Current Resume</div>
              <p className="text-sm text-slate-600">Share your existing resume. AI will reformat it to be ATS-friendly with proper keywords and structure.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-lg font-semibold mb-2 text-slate-800">3. Get ATS-Optimized CV</div>
              <p className="text-sm text-slate-600">Receive a professionally formatted, ATS-optimized resume tailored to your target role.</p>
            </div>
          </div>

          {/* ATS info badge */}
          <div className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Optimized for Applicant Tracking Systems (ATS)
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
                OpenAI API Key <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Job Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[100px] transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Your Qualifications <span className="text-slate-400">(optional)</span>
              </label>
              <Textarea
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="List any additional qualifications or skills you'd like to highlight..."
                className="min-h-[100px] transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Current Resume <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={currentResume}
                onChange={(e) => setCurrentResume(e.target.value)}
                placeholder="Paste your current resume here..."
                className="min-h-[200px] transition-all duration-300 hover:border-slate-400 focus:ring-2 focus:ring-slate-400/50"
                required
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
