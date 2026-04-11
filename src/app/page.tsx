'use client';

import { useState } from 'react';

interface PageProps {
  params: Promise<{ appName: string }>;
}

const APP_TITLES: Record<string, string> = {
  'ai-spaced-repetition': 'SM-2 Spaced Repetition Scheduler',
  'ai-socratic-tutor': 'Socratic Tutor Engine',
  'ai-rubric-generator': 'Assessment Rubric Builder',
  'ai-differentiated-instruction': 'Differentiated Lesson Planner',
  'ai-learning-styles': 'VARK Learning Style Assessment',
  'ai-blooms-taxonomy': "Bloom Taxonomy Lesson Sequencer",
  'ai-course-syllabus': 'Academic Syllabus Generator',
  'ai-literature-review': 'Literature Review Synthesizer',
  'ai-hypothesis-generator': 'Research Hypothesis Generator',
  'ai-experimental-design': 'Experimental Design Optimizer',
  'ai-lab-protocol': 'Lab Protocol Optimizer',
  'ai-data-viz-suggester': 'Data Visualization Recommender',
  'ai-lab-notebook': 'Lab Notebook Reviewer',
  'ai-lab-safety': 'Lab Safety Compliance Auditor',
  'ai-student-report': 'Student Progress Report Writer',
  'ai-thesis-planner': 'Thesis/Dissertation Timeline Planner',
  'ai-grant-budget': 'Research Grant Budget Builder',
  'ai-peer-review': 'Peer Review Feedback Generator',
  'ai-knowledge-graph': 'Research Knowledge Graph Constructor',
  'ai-citation-formatter': 'Multi-Format Citation Manager',
};

const APP_DESCRIPTIONS: Record<string, string> = {
  'ai-spaced-repetition': 'Create optimized SM-2 spaced repetition schedules for any topic.',
  'ai-socratic-tutor': 'Engage in guided Socratic dialogue for deeper conceptual understanding.',
  'ai-rubric-generator': 'Build detailed, actionable assessment rubrics for academic assignments.',
  'ai-differentiated-instruction': 'Plan tiered lessons for diverse learner needs and readiness levels.',
  'ai-learning-styles': 'Take a VARK self-assessment and get personalized study strategies.',
  'ai-blooms-taxonomy': 'Sequence lessons through Bloom\'s taxonomy cognitive levels.',
  'ai-course-syllabus': 'Generate comprehensive, professional academic syllabi.',
  'ai-literature-review': 'Synthesize and organize scientific literature reviews.',
  'ai-hypothesis-generator': 'Generate testable, well-formulated research hypotheses.',
  'ai-experimental-design': 'Design rigorous experiments with proper controls.',
  'ai-lab-protocol': 'Optimize laboratory protocols with troubleshooting guides.',
  'ai-data-viz-suggester': 'Get the best data visualizations for your research.',
  'ai-lab-notebook': 'Review lab notebook entries for completeness and compliance.',
  'ai-lab-safety': 'Perform comprehensive lab safety compliance audits.',
  'ai-student-report': 'Write formative, detailed student progress reports.',
  'ai-thesis-planner': 'Plan your thesis or dissertation with structured timelines.',
  'ai-grant-budget': 'Build detailed, compliant research grant budgets.',
  'ai-peer-review': 'Generate constructive peer review feedback.',
  'ai-knowledge-graph': 'Construct conceptual knowledge graphs from research.',
  'ai-citation-formatter': 'Format citations in APA, MLA, Chicago, IEEE, Harvard, Vancouver.',
};

const APP_PLACEHOLDERS: Record<string, string> = {
  'ai-spaced-repetition': 'Enter a topic or list of concepts to create a spaced repetition schedule...',
  'ai-socratic-tutor': 'Enter a topic or concept to begin a Socratic dialogue...',
  'ai-rubric-generator': 'Enter an assignment description to generate an assessment rubric...',
  'ai-differentiated-instruction': 'Enter a topic or learning standard to create differentiated lesson plans...',
  'ai-learning-styles': 'Enter a subject or topic to create a VARK self-assessment questionnaire...',
  'ai-blooms-taxonomy': "Enter a topic to scaffold a lesson through Bloom's taxonomy levels...",
  'ai-course-syllabus': 'Enter a course title, subject, and target audience to generate a syllabus...',
  'ai-literature-review': 'Enter your research topic or thesis statement to organize a literature review...',
  'ai-hypothesis-generator': 'Enter a research question or area of interest to generate testable hypotheses...',
  'ai-experimental-design': 'Enter a research question to design a rigorous experiment...',
  'ai-lab-protocol': 'Enter an experimental goal or technique to generate an optimized lab protocol...',
  'ai-data-viz-suggester': 'Enter a data description or research question to get visualization recommendations...',
  'ai-lab-notebook': 'Enter lab notebook entry details or paste an entry to review...',
  'ai-lab-safety': 'Enter lab type or materials to perform a comprehensive safety audit...',
  'ai-student-report': 'Enter student name, grade level, and subject area to generate a progress report...',
  'ai-thesis-planner': 'Enter thesis topic and defense deadline to create a structured timeline...',
  'ai-grant-budget': 'Enter grant type, project scope, and funding amount to build a budget...',
  'ai-peer-review': 'Paste a manuscript abstract or section to generate peer review feedback...',
  'ai-knowledge-graph': 'Enter a research topic or list of papers to construct a knowledge graph...',
  'ai-citation-formatter': 'Enter references or citation lists to format in APA, MLA, Chicago, IEEE and more...',
};

const APP_COLORS: Record<string, string> = {
  'ai-spaced-repetition': '#5cb578',
  'ai-socratic-tutor': '#b366d9',
  'ai-rubric-generator': '#6b8fc9',
  'ai-differentiated-instruction': '#4dbd8f',
  'ai-learning-styles': '#a6d14d',
  'ai-blooms-taxonomy': '#d4a63d',
  'ai-course-syllabus': '#d47a3d',
  'ai-literature-review': '#6b5dc9',
  'ai-hypothesis-generator': '#d96bb3',
  'ai-experimental-design': '#3dbdb3',
  'ai-lab-protocol': '#d94d4d',
  'ai-data-viz-suggester': '#3dbd6b',
  'ai-lab-notebook': '#3dbd9f',
  'ai-lab-safety': '#d94d6b',
  'ai-student-report': '#6b8fa6',
  'ai-thesis-planner': '#a64dd9',
  'ai-grant-budget': '#4d7a8f',
  'ai-peer-review': '#d94d9f',
  'ai-knowledge-graph': '#d94d4d',
  'ai-citation-formatter': '#9f4dd9',
};

function resultToHtml(text: string): string {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-900 rounded p-4 overflow-x-auto my-4"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="my-3">')
    .replace(/\n/g, '<br/>');
}

export default function Page({ params }: PageProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please enter a topic or content to generate.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    try {
      const resolvedParams = await params;
      const appName = resolvedParams.appName;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, appName }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result || '');
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Peer Review Feedback Generator</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Generate constructive peer review feedback.</p>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700 mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a manuscript abstract or section to generate peer review feedback..."
            className="w-full h-40 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-d94d9f text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate();
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: '#d94d9f' }}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
        </div>

        {result && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#d94d9f' }}>Output</h2>
            <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: resultToHtml(result) }} />
          </div>
        )}
      </div>
    </main>
  );
}
